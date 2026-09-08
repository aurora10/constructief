import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

/**
 * Syncs web-form sub-contractor submissions into the EXISTING Recruiter_Bot
 * Google Sheet (GOOGLE_SHEET_ID_NEW / tab "Sheet1") using the bot's service
 * account (GOOGLE_CREDENTIALS_FILE → service_account.json). Column layout and
 * append semantics mirror Recruiter_Bot's google_sync.py so records land in the
 * same sheet as the bot's chat-candidates → one CRM import.
 */

const SCOPES =
  'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

export const RECRUITER_SHEET_ID = process.env.GOOGLE_SHEET_ID_NEW || '';
export const RECRUITER_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const TAB = 'Sheet1';

// Exact header layout of Recruiter_Bot Sheet1 (A..X)
export const RECRUITER_HEADERS = [
  'record_id', 'created_at', 'completed_at', 'candidate_name', 'phone_number',
  'specialization', 'legal_status', 'car_and_tools', 'location', 'rate',
  'languages', 'team_size', 'availability', 'is_broker', 'collected_facts',
  'media_count', 'drive_folder_url', 'photo_links', 'video_links',
  'dossier_pdf_url', 'dossier_html_url', 'status', 'recruiter_notes', 'synced_at',
];

interface Creds {
  email: string;
  key: string;
}

let tokenCache: { accessToken: string; expiresAt: number } | null = null;
let userTokenCache: { accessToken: string; expiresAt: number } | null = null;

function loadCreds(): Creds | null {
  // 1) Explicit bot-scoped env (optional, for when the site uses a dedicated account)
  const botEmail = process.env.GOOGLE_SHEETS_BOT_CLIENT_EMAIL;
  const botKey = process.env.GOOGLE_SHEETS_BOT_PRIVATE_KEY;
  if (botEmail && botKey) {
    return { email: botEmail, key: botKey.replace(/\\n/g, '\n') };
  }
  // 2) The site's own service account (constructief-sheets@constructief.iam.gserviceaccount.com)
  //    — already configured and proven. Use it to append into the Recruiter_Bot
  //    spreadsheet once that spreadsheet is shared with this account.
  const siteEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const siteKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  if (siteEmail && siteKey) {
    return { email: siteEmail, key: siteKey.replace(/\\n/g, '\n') };
  }
  // 3) Recruiter_Bot style: JSON credentials file
  const fileName = process.env.GOOGLE_CREDENTIALS_FILE || 'service_account.json';
  const filePath = path.isAbsolute(fileName) ? fileName : path.resolve(process.cwd(), fileName);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (data.client_email && data.private_key) {
        return { email: data.client_email, key: data.private_key };
      }
    } catch (err) {
      console.error('[recruiterBotSync] failed to read credentials file:', err);
    }
  }
  return null;
}

async function importPrivateKey(rawKey: string): Promise<CryptoKey> {
  let pem = rawKey.trim();
  if (pem.startsWith('"') && pem.endsWith('"')) pem = pem.slice(1, -1);
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const der = Buffer.from(b64, 'base64');
  return crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }
  const creds = loadCreds();
  if (!creds) {
    throw new Error('recruiterBotSync: no bot credentials (GOOGLE_CREDENTIALS_FILE / GOOGLE_SHEETS_BOT_*)');
  }
  const key = await importPrivateKey(creds.key);
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({ scope: SCOPES })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(creds.email)
    .setSubject(creds.email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`recruiterBotSync: token error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  tokenCache = { accessToken: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 };
  return tokenCache.accessToken;
}

async function sheetsFetch(pathAndQuery: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${RECRUITER_SHEET_ID}/${pathAndQuery}`;
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers },
  });
  if (!res.ok) {
    throw new Error(`recruiterBotSync: sheets ${res.status}: ${await res.text()}`);
  }
  return res;
}

/** Writes the header row if Sheet1 is empty (mirrors the bot's _ensure_header). */
async function ensureHeader(): Promise<void> {
  const res = await sheetsFetch(`values/${TAB}!A1:X1`);
  const data = await res.json();
  if (!data.values || data.values.length === 0) {
    await sheetsFetch(`values/${TAB}!A1?valueInputOption=RAW`, {
      method: 'PUT',
      body: JSON.stringify({ values: [RECRUITER_HEADERS] }),
    });
  }
}

/**
 * Appends one full sub-contractor row (24 cells, A..X) to Sheet1, the same way
 * the bot does (new row always leaves the recruiter columns V/W empty).
 * @param row - exactly 24 values in RECRUITER_HEADERS order
 */
export async function appendRecruiterRow(row: (string | number)[]): Promise<void> {
  if (RECRUITER_SHEET_ID && RECRUITER_SHEET_ID !== '') {
    await ensureHeader();
  }
  await sheetsFetch(`values/${TAB}!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ values: [row] }),
  });
}

/**
 * OAuth USER access token (Recruiter_Bot's own Google account). Required for
 * Drive uploads: service accounts have no Drive storage quota, so photo uploads
 * use the user's refresh token (GOOGLE_DRIVE_CLIENT_ID / _CLIENT_SECRET /
 * _REFRESH_TOKEN). Returns null when not configured → caller falls back.
 */
async function getUserAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  if (userTokenCache && userTokenCache.expiresAt > Date.now() + 60_000) {
    return userTokenCache.accessToken;
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    console.error(`[recruiterBotSync] user token refresh failed ${res.status}: ${await res.text()}`);
    return null;
  }
  const data = await res.json();
  userTokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + ((data.expires_in || 3600) - 60) * 1000,
  };
  return userTokenCache.accessToken;
}

/** Uploads one photo into the shared Recruiter_Bot Drive folder; returns a view URL. */
export async function uploadPhoto(
  folderId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<string> {
  // User OAuth token (has Drive quota); service account only as fallback (will
  // usually fail for normal folders — see Google quota rules).
  const token = (await getUserAccessToken()) ?? (await getAccessToken());
  const boundary = `rb_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const metadata = { name: fileName, parents: [folderId], mimeType };
  const payload =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n` +
    `${buffer.toString('base64')}\r\n--${boundary}--`;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: payload,
  });
  if (!res.ok) {
    throw new Error(`recruiterBotSync: drive upload ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return `https://drive.google.com/file/d/${data.id}/view`;
}

export function isRecruiterBotConfigured(): boolean {
  return Boolean(RECRUITER_SHEET_ID && RECRUITER_FOLDER_ID);
}

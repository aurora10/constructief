import { SignJWT } from 'jose';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

/**
 * Parses a PEM-encoded PKCS#8 private key and imports it as a CryptoKey.
 * Handles formatting quirks from .env files (escaped newlines, extra quotes).
 */
async function importPrivateKey(rawKey: string): Promise<CryptoKey> {
  // Strip surrounding quotes if present (common .env artifact)
  let pem = rawKey.trim();
  if (pem.startsWith('"') && pem.endsWith('"')) {
    pem = pem.slice(1, -1);
  }

  // Strip PEM headers/footers and whitespace to get raw base64
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

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const rawKey = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!email || !rawKey) {
    throw new Error('Missing GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY');
  }

  return { email, rawKey };
}

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const { email, rawKey } = getServiceAccountAuth();
  const key = await importPrivateKey(rawKey);

  const now = Math.floor(Date.now() / 1000);

  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(email)
    .setSubject(email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(now + 3600) // 1 hour max
    .sign(key);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s OAuth timeout

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to get Google access token: ${err}`);
    }

    const data = await response.json();
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    };

    return tokenCache.accessToken;
  } finally {
    clearTimeout(timeout);
  }
}

async function sheetsApi(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000); // 15s Sheets API timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Google Sheets API error (${response.status}): ${err}`);
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Inserts a new row at the top of a sheet (row 2) with an auto-generated
 * sequential integer ID. Merges the read + ID computation + write into a
 * single read/write pair to minimize latency.
 *
 * @param sheetName - The tab/sheet name (e.g., "Candidates" or "Employers")
 * @param values - Array of values for the new row (excluding ID — ID is prepended)
 * @returns The generated ID
 */
export async function insertRowWithId(sheetName: string, values: (string | number)[]): Promise<number> {
  console.time(`[Sheets] ${sheetName} insert`);

  // 1. Read all existing data rows (columns A through Z, to capture all columns including Created At)
  const range = `${encodeURIComponent(sheetName)}!A2:Z`;
  console.timeLog(`[Sheets] ${sheetName} insert`, 'reading existing rows');
  const readResponse = await sheetsApi(`values/${range}`);
  const readData = await readResponse.json();
  const existingRows: any[][] = readData.values || [];

  // 2. Compute the next sequential ID from existing rows
  let maxId = 0;
  for (const row of existingRows) {
    const val = parseInt(row[0], 10);
    if (!isNaN(val) && val > maxId) {
      maxId = val;
    }
  }
  const nextId = maxId + 1;

  // 3. Build new data: new row (with ID) at top, then all existing rows
  const newRow = [nextId, ...values];
  const newData = [newRow, ...existingRows];

  // 4. Determine the full range to write back
  const numColumns = newData.length > 0 ? Math.max(...newData.map(r => r.length), newRow.length) : newRow.length;
  const colLetter = String.fromCharCode(64 + numColumns); // 1→A, 2→B, ...
  const writeRange = `${encodeURIComponent(sheetName)}!A2:${colLetter}${2 + newData.length - 1}`;

  // 5. Write everything back
  console.timeLog(`[Sheets] ${sheetName} insert`, 'writing rows');
  await sheetsApi(`values/${writeRange}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ values: newData }),
  });

  console.timeEnd(`[Sheets] ${sheetName} insert`);
  return nextId;
}

/**
 * Returns the next sequential integer ID for a sheet by reading column A.
 * Legacy helper — prefer insertRowWithId for write operations.
 *
 * @param sheetName - The tab/sheet name (e.g., "Candidates" or "Employers")
 * @returns The next ID (1 if sheet is empty, otherwise max + 1)
 */
export async function getNextId(sheetName: string): Promise<number> {
  const range = `${encodeURIComponent(sheetName)}!A2:A`;
  const readResponse = await sheetsApi(`values/${range}`);
  const readData = await readResponse.json();
  const rows: any[][] = readData.values || [];

  let maxId = 0;
  for (const row of rows) {
    const val = parseInt(row[0], 10);
    if (!isNaN(val) && val > maxId) {
      maxId = val;
    }
  }

  return maxId + 1;
}

/**
 * Reads all rows from a sheet and finds one by ID (first column).
 * @param sheetName - The tab/sheet name
 * @param id - The ID to find in column A (matches as string)
 * @returns The row data as an object keyed by header, or null if not found
 */
export async function findRowById(sheetName: string, id: string): Promise<Record<string, string> | null> {
  // Read headers + all data
  const range = `${encodeURIComponent(sheetName)}!A1:Z`;
  const readResponse = await sheetsApi(`values/${range}`);

  const readData = await readResponse.json();
  const rows: any[][] = readData.values || [];
  if (rows.length < 2) return null; // No data rows

  const headers = rows[0];

  // Find the row where column A matches the ID
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      const row: Record<string, string> = {};
      headers.forEach((header: string, idx: number) => {
        row[header] = rows[i][idx] || '';
      });
      return row;
    }
  }

  return null;
}
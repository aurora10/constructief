import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import {
  appendRecruiterRow,
  uploadPhoto,
  RECRUITER_FOLDER_ID,
  isRecruiterBotConfigured,
} from '@/lib/recruiterBotSync';

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 1_500_000; // client already downscales; hard server cap
const ALONE_OPTION_VALUE = 'Ik werk alleen (zzp)';

interface PhotoPayload {
  name?: string;
  mimeType?: string;
  dataBase64?: string;
}

function isoNow(): string {
  return new Date().toISOString();
}

interface NotificationData {
  name: string;
  phone: string;
  specialization: string;
  legal_status: string;
  car_and_tools: string;
  location: string;
  rate: string;
  languages: string;
  team_size: string;
  availability: string;
  photoLinks: string[];
}

async function sendNotificationEmail(recordId: string, d: NotificationData): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const sheetLink = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID_NEW}/edit#gid=0`;
  const text = [
    `Nieuwe onderaannemer inschrijving (via website)`,
    `Record: ${recordId}`,
    ``,
    `Naam: ${d.name}`,
    `Specialisatie: ${d.specialization}`,
    `Documenten: ${d.legal_status}`,
    `Auto/Gereedschap: ${d.car_and_tools}`,
    `Locatie: ${d.location}`,
    `Tarief: ${d.rate}`,
    `Telefoon: ${d.phone}`,
    `Talen: ${d.languages}`,
    `Alleen/ploeg: ${d.team_size}`,
    `Beschikbaarheid: ${d.availability}`,
    ``,
    d.photoLinks.length ? `Foto's:\n${d.photoLinks.join('\n')}` : "Foto's: (geen)",
    ``,
    `Bekijk in het spreadsheet: ${sheetLink}`,
  ].join('\n');

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER, // same inbox as Recruiter_Bot notifications
    subject: `Nieuwe onderaannemer inschrijving – ${recordId}`,
    text,
  });
}

export async function POST(request: NextRequest) {
  try {
    // 1. IP rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      console.warn(`[RATE LIMIT] Subcontractor intake blocked IP: ${ip}`);
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const data = await request.json();
    const {
      candidate_name,
      specialization,
      legal_status,
      car_and_tools,
      location,
      rate,
      phone_number,
      languages,
      team_size,
      availability,
      photos,
      turnstileToken,
      website,
    } = data;

    // 2. Honeypot — bots fill the hidden "website" field
    if (website) {
      console.warn(`[HONEYPOT] Blocked bot submission from IP: ${ip}`);
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    // 3. Turnstile human check
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'Failed CAPTCHA verification' }, { status: 403 });
    }

    // 4. Validate required fields (name, valid phone, legal status = hard filter)
    const name = (candidate_name || '').trim();
    const phoneDigits = (phone_number || '').replace(/\D/g, '');
    if (!name) return NextResponse.json({ error: 'Missing required field: candidate_name' }, { status: 400 });
    if (phoneDigits.length < 5) {
      return NextResponse.json({ error: 'Invalid phone_number: need at least 5 digits' }, { status: 400 });
    }
    if (!(legal_status || '').trim()) {
      return NextResponse.json({ error: 'Missing required field: legal_status' }, { status: 400 });
    }

    if (!isRecruiterBotConfigured()) {
      return NextResponse.json(
        { error: 'Recruiter sheet not configured (GOOGLE_SHEET_ID_NEW / GOOGLE_DRIVE_FOLDER_ID)' },
        { status: 503 },
      );
    }

    // 5. Upload photos into the shared Recruiter_Bot Drive folder
    const photoLinks: string[] = [];
    const photoList: PhotoPayload[] = Array.isArray(photos) ? photos.slice(0, MAX_PHOTOS) : [];
    for (const [index, photo] of photoList.entries()) {
      if (!photo.dataBase64) continue;
      const mimeType = /^image\/(jpeg|png|webp)$/.test(photo.mimeType || '')
        ? (photo.mimeType as string)
        : 'image/jpeg';
      const buffer = Buffer.from(photo.dataBase64, 'base64');
      if (buffer.length === 0 || buffer.length > MAX_PHOTO_BYTES) continue;

      const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'kandidaat';
      try {
        const link = await uploadPhoto(
          RECRUITER_FOLDER_ID,
          `${safeName}-web-${index + 1}.${ext}`,
          mimeType,
          buffer,
        );
        photoLinks.push(link);
      } catch (err: any) {
        console.error('[DRIVE] upload failed:', err?.message);
      }
    }

    // 6. Append a row to Recruiter_Bot Sheet1 (A..X), matching google_sync.py
    const now = isoNow();
    const recordId = `web-${Date.now()}`;
    const hasTeam = Boolean((team_size || '').trim()) && (team_size || '').trim() !== ALONE_OPTION_VALUE;
    const row: (string | number)[] = [
      recordId,                                   // A record_id
      now,                                        // B created_at
      now,                                        // C completed_at
      name,                                       // D candidate_name
      (phone_number || '').trim(),                // E phone_number
      (specialization || '').trim(),              // F specialization
      (legal_status || '').trim(),                // G legal_status
      (car_and_tools || '').trim(),               // H car_and_tools
      (location || '').trim(),                    // I location
      (rate || '').trim(),                        // J rate
      (languages || '').trim(),                   // K languages
      (team_size || '').trim(),                   // L team_size
      (availability || '').trim(),                // M availability
      hasTeam ? 'Yes' : 'No',                     // N is_broker
      'Website inschrijving',                     // O collected_facts
      photoLinks.length,                          // P media_count
      '',                                         // Q drive_folder_url
      photoLinks.join('\n'),                      // R photo_links
      '',                                         // S video_links
      '',                                         // T dossier_pdf_url
      '',                                         // U dossier_html_url
      '',                                         // V status (recruiter fills)
      '',                                         // W recruiter_notes (recruiter fills)
      now,                                        // X synced_at
    ];

    await appendRecruiterRow(row);

    // Email the recruiter (same inbox Recruiter_Bot uses). Never fails the
    // request if email delivery is down — the sheet row is the source of truth.
    try {
      await sendNotificationEmail(recordId, {
        name,
        phone: (phone_number || '').trim(),
        specialization: (specialization || '').trim(),
        legal_status: (legal_status || '').trim(),
        car_and_tools: (car_and_tools || '').trim(),
        location: (location || '').trim(),
        rate: (rate || '').trim(),
        languages: (languages || '').trim(),
        team_size: (team_size || '').trim(),
        availability: (availability || '').trim(),
        photoLinks,
      });
    } catch (emailErr: any) {
      console.error('[EMAIL] notification failed:', emailErr?.message);
    }

    return NextResponse.json({ success: true, recordId });
  } catch (error: any) {
    console.error('Subcontractor intake error:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration', details: error.message },
      { status: 500 },
    );
  }
}

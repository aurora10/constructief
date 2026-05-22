import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { insertRowWithId } from '@/lib/googleSheets';

const TRUSTED_TRADES = [
  'Metser', 'Bekister', 'Ijzervlechter', 'Lasser (TIG/MIG/MAG)',
  'Grondwerker', 'Kraanmachinist (Torenkraan)', 'Graafkraanmachinist',
  'Wegenwerker / Klinkerlegger', 'Stellingbouwer',
  'Dakwerker (Platte daken / EPDM)', 'Dakwerker (Hellende daken)',
  'Schilder', 'Stukadoor', 'Tegelzetter / Vloerder', 'Gyproc plaatser',
  'Schrijnwerker (Binnen)', 'Schrijnwerker (Buiten / Atelier)',
  'Monteur Ramen en Deuren', 'Elektricien (Residentieel)',
  'Elektricien (Industrieel)', 'Loodgieter / Sanitair',
  'HVAC Technieker', 'Ploegbaas', 'Werfleider', 'Handlanger'
];

export async function POST(request: NextRequest) {
  try {
    // 1. IP-based Rate Limiter to stop spammers
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      console.warn(`[RATE LIMIT] Blocked too many requests from IP: ${ip}`);
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const data = await request.json();
    const { name, trades, experience, phone, email, notes, turnstileToken, website } = data;

    // 2. Honeypot check (website field should be empty)
    if (website) {
      console.warn(`[HONEYPOT] Blocked bot submission from IP: ${ip}`);
      // Return 200 to fool the bot, but don't process it
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    // 3. Verify Turnstile Token
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'Failed CAPTCHA verification' }, { status: 403 });
    }

    // Validate required fields - trades should be an array with at least one item
    if (!name || !phone || !trades || !Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify all trades are within the trusted list
    const invalidTrades = trades.filter((t: string) => !TRUSTED_TRADES.includes(t));
    if (invalidTrades.length > 0) {
      return NextResponse.json(
        { error: 'Invalid trades provided' },
        { status: 400 }
      );
    }

    const now = new Date();
    const createdAt = `${String(now.getDate()).padStart(2, '0')} - ${String(now.getMonth() + 1).padStart(2, '0')} - ${now.getFullYear()}`;

    // Insert into Google Sheets "Candidates" tab at the top (row 2)
    // Column order: Id | Name | Trade | Experience | Status | Phone | Email | Recruiter Note | Created At
    const id = await insertRowWithId('Candidates', [
      name,
      trades.join(', '),
      Number(experience),
      'New',
      phone,
      email || '',
      notes || '',
      createdAt,
    ]);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Google Sheets Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}
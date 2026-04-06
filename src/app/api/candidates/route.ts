import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
  process.env.AIRTABLE_BASE_ID!
);

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

    // Verify all trades are within the trusted list to prevent Airtable API rejection errors
    const invalidTrades = trades.filter((t: string) => !TRUSTED_TRADES.includes(t));
    if (invalidTrades.length > 0) {
      return NextResponse.json(
        { error: 'Invalid trades provided' },
        { status: 400 }
      );
    }

    // For Airtable Multiple Select fields, pass the array directly
    const record = await base('Candidates').create([
      {
        fields: {
          Name: name,
          Trade: trades, // Airtable Multiple Select expects an array
          Experience: Number(experience),
          Status: 'New',
          Phone: phone,
          Email: email,
          'Recruiter Note': notes || '',
        },
      },
    ]);

    return NextResponse.json({ success: true, id: record[0].id });
  } catch (error: any) {
    console.error('Airtable Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}

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
        const { companyName, contactPerson, email, city, trades, url, phone, amount, projectType, description, startDate, turnstileToken, website } = data;

        // 2. Honeypot check (website field should be empty)
        if (website) {
            console.warn(`[HONEYPOT] Blocked bot submission from IP: ${ip}`);
            return NextResponse.json({ success: true, message: 'Message received' });
        }

        // 3. Verify Turnstile Token
        const isHuman = await verifyTurnstileToken(turnstileToken);
        if (!isHuman) {
            return NextResponse.json({ error: 'Failed CAPTCHA verification' }, { status: 403 });
        }
        if (!companyName || !email || !trades || !Array.isArray(trades) || trades.length === 0 || !description) {
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

        const record = await base('Employers').create([
            {
                fields: {
                    'Company Name': companyName,
                    'Contact Person': contactPerson,
                    'Email': email,
                    'City': city,
                    'Trade': trades, // trades is now an array
                    'URL': url,
                    'Phone': phone,
                    'Count': Number(amount),
                    'Project Type': projectType,
                    'Description': description,
                    'StartDate': startDate,
                },
            },
        ]);

        return NextResponse.json({ success: true, id: record[0].id });
    } catch (error: any) {
        console.error('Airtable Error:', error);
        return NextResponse.json(
            { error: 'Failed to submit request', details: error.message },
            { status: 500 }
        );
    }
}

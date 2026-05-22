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

        // Insert into Google Sheets "Employers" tab at the top (row 2)
        // Column order: Id | Company Name | Contact Person | Email | City | Trade | URL | Phone | Count | Project Type | Description | StartDate | Created At
        const id = await insertRowWithId('Employers', [
            companyName,
            contactPerson || '',
            email,
            city || '',
            trades.join(', '),
            url || '',
            phone || '',
            Number(amount) || 0,
            projectType || '',
            description,
            startDate || '',
            createdAt,
        ]);

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error('Google Sheets Error:', error);
        return NextResponse.json(
            { error: 'Failed to submit request', details: error.message },
            { status: 500 }
        );
    }
}
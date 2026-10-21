
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { getTransporter, getFromHeader, getMailUser, isMailerConfigured } from '@/lib/mailer';
import {
    CONTACT_LIMITS,
    trimContactValues,
    validateContact,
    type ContactIssue,
} from '@/lib/contactValidation';

/** Human-readable reason for the 400 response (the form maps the field itself). */
function reasonMessage(issue: ContactIssue): string {
    if (issue.reason === 'required') return `Missing required field: ${issue.field}`;
    if (issue.reason === 'too_long') {
        return `Field ${issue.field} too long (max ${CONTACT_LIMITS[issue.field]})`;
    }
    return 'Invalid email address';
}

export async function POST(request: NextRequest) {
    try {
        // 1. IP-based rate limiter to stop spammers
        const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
        const isAllowed = await checkRateLimit(ip);
        if (!isAllowed) {
            console.warn(`[RATE LIMIT] Blocked too many requests (Contact Form) from IP: ${ip}`);
            return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
        }

        const body = await request.json();
        const { turnstileToken, website, locale } = body;

        // 2. Honeypot: the hidden "website" field must stay empty
        if (website) {
            console.warn(`[HONEYPOT] Blocked bot submission from IP: ${ip}`);
            return NextResponse.json({ success: true, message: 'Message received' });
        }

        // 3. Turnstile human check
        const isHuman = await verifyTurnstileToken(turnstileToken);
        if (!isHuman) {
            return NextResponse.json({ error: 'Failed CAPTCHA verification' }, { status: 403 });
        }

        // 4. Validate with the same rules the form uses (trimmed, so a field
        //    holding only spaces is rejected as empty).
        const values = trimContactValues(body);
        const issues = validateContact(values);
        if (issues.length > 0) {
            const first = issues[0];
            return NextResponse.json(
                { error: reasonMessage(first), field: first.field },
                { status: 400 },
            );
        }

        if (!isMailerConfigured()) {
            console.error('[CONTACT] GMAIL_USER / GMAIL_PASS not configured');
            return NextResponse.json({ error: 'Mail is not configured' }, { status: 503 });
        }

        // Subject is optional; clamp it rather than dropping a whole enquiry over
        // a pasted-in long subject line.
        const safeSubject = values.subject.slice(0, CONTACT_LIMITS.subject);

        const text = [
            'Nieuwe contactaanvraag via de website',
            '',
            `Naam: ${values.name}`,
            `E-mail: ${values.email}`,
            `Onderwerp: ${safeSubject || '(geen onderwerp)'}`,
            `Taal van de pagina: ${typeof locale === 'string' && locale ? locale : '(onbekend)'}`,
            '',
            'Bericht:',
            values.message,
        ].join('\n');

        await getTransporter().sendMail({
            from: getFromHeader(),
            to: getMailUser(),
            replyTo: values.email,
            subject: `Constructief: ${safeSubject || 'Nieuw bericht'}`,
            text,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[CONTACT] send failed:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

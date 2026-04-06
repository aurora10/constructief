
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: NextRequest) {
    try {
        // 1. IP-based Rate Limiter to stop spammers
        const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
        const isAllowed = await checkRateLimit(ip);
        if (!isAllowed) {
            console.warn(`[RATE LIMIT] Blocked too many requests (Contact Form) from IP: ${ip}`);
            return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
        }

        const { name, email, subject, message, turnstileToken, website } = await request.json();

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

        // Validate fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Sending to yourself
            subject: `Constructief: ${subject || 'Nieuw bericht'}`,
            text: `
                Name: ${name}
                Email: ${email}
                Subject: ${subject}
                
                Message:
                ${message}
            `,
            replyTo: email,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Email Error:', error);
        return NextResponse.json(
            { error: 'Failed to send message', details: error.message },
            { status: 500 }
        );
    }
}

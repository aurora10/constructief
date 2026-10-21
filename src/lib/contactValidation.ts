/**
 * Single source of truth for contact-form validation, shared by the client form
 * (src/app/[locale]/contact/page.tsx) and the API route
 * (src/app/api/contact/route.ts) so both sides can never disagree about what
 * counts as a valid submission.
 *
 * Everything is trimmed first: a field holding only spaces is empty, which is
 * what HTML's `required` attribute silently lets through.
 */

// Kept in sync with the maxLength attributes on the form inputs.
export const CONTACT_LIMITS = {
    name: 100,
    email: 254,
    subject: 150,
    message: 5000,
} as const;

/** Pragmatic shape check: something@domain.tld with no whitespace. */
export const CONTACT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export type ContactField = 'name' | 'email' | 'message';
export type ContactReason = 'required' | 'too_long' | 'invalid_email';

export interface ContactIssue {
    field: ContactField;
    reason: ContactReason;
}

export interface ContactValues {
    name: string;
    email: string;
    subject: string;
    message: string;
}

function asString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

/** Normalises raw (untrusted) input into trimmed strings. */
export function trimContactValues(input: {
    name?: unknown;
    email?: unknown;
    subject?: unknown;
    message?: unknown;
}): ContactValues {
    return {
        name: asString(input.name),
        email: asString(input.email),
        subject: asString(input.subject),
        message: asString(input.message),
    };
}

/**
 * Returns every problem found, in field order. An empty array means valid.
 * `subject` is optional by design, so it is only length-clamped, never required.
 */
export function validateContact(values: ContactValues): ContactIssue[] {
    const issues: ContactIssue[] = [];

    if (!values.name) issues.push({ field: 'name', reason: 'required' });
    else if (values.name.length > CONTACT_LIMITS.name) {
        issues.push({ field: 'name', reason: 'too_long' });
    }

    if (!values.email) issues.push({ field: 'email', reason: 'required' });
    else if (values.email.length > CONTACT_LIMITS.email || !CONTACT_EMAIL_RE.test(values.email)) {
        issues.push({ field: 'email', reason: 'invalid_email' });
    }

    if (!values.message) issues.push({ field: 'message', reason: 'required' });
    else if (values.message.length > CONTACT_LIMITS.message) {
        issues.push({ field: 'message', reason: 'too_long' });
    }

    return issues;
}

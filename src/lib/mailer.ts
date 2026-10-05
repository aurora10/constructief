import nodemailer, { type Transporter } from 'nodemailer';
import { BRAND } from '@/lib/brand';

/**
 * Single source of truth for the Gmail SMTP transport (GMAIL_USER / GMAIL_PASS
 * in .env.local). Both the internal notifications and the sub-contractor
 * confirmation emails go through this transporter.
 */

let cachedTransporter: Transporter | null = null;
let cachedKey = '';

/**
 * Google shows app passwords grouped in blocks of four ("abcd efgh ijkl mnop")
 * but the actual secret has no spaces. Accept both forms.
 */
function normalizedPassword(): string {
  return (process.env.GMAIL_PASS || '').replace(/\s+/g, '');
}

export function getMailUser(): string {
  return (process.env.GMAIL_USER || '').trim();
}

export function isMailerConfigured(): boolean {
  return Boolean(getMailUser() && normalizedPassword());
}

export function getTransporter(): Transporter {
  const user = getMailUser();
  const pass = normalizedPassword();
  const key = `${user}:${pass.length}`;

  if (cachedTransporter && cachedKey === key) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  cachedKey = key;
  return cachedTransporter;
}

/**
 * Branded From header. The mailbox itself is the Gmail account, but the display
 * name keeps the confirmation recognisable for the sub-contractor.
 * Set MAIL_FROM once a branded sender alias (e.g. noreply@constructief.be) is
 * verified in the Gmail account.
 */
export function getFromHeader(): string {
  return process.env.MAIL_FROM || `"${BRAND.name}" <${getMailUser()}>`;
}

/**
 * The confirmation is a no-reply transactional message: no Reply-To is set, so
 * the header falls back to From and the recipient is told not to answer.
 * Override with CONFIRMATION_REPLY_TO only if replies should reach a real
 * monitored mailbox.
 */
export function getConfirmationReplyTo(): string | undefined {
  const configured = (process.env.CONFIRMATION_REPLY_TO || '').trim();
  return configured || undefined;
}

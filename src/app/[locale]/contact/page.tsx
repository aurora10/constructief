"use client";

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import {
    CONTACT_LIMITS,
    trimContactValues,
    validateContact,
    type ContactField,
    type ContactIssue,
    type ContactValues,
} from '@/lib/contactValidation';

// Local Turnstile would demand a real challenge on localhost, so skip it in dev
// (same bypass the sub-contractor intake form uses).
const DEV_BYPASS = process.env.NODE_ENV === 'development' ? 'dev-bypass' : '';

type Errors = Partial<Record<ContactField, string>>;

const inputCls = 'w-full p-2 border rounded-md';
const inputErrCls = 'w-full p-2 border rounded-md border-red-500 focus:border-red-500 outline-none';

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className="mt-1 text-sm text-red-600">
            {message}
        </p>
    );
}

export default function ContactPage() {
    const t = useTranslations('ContactPage');
    const locale = useLocale();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Errors>({});
    const [turnstileToken, setTurnstileToken] = useState<string>(DEV_BYPASS);
    const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

    function clearError(field: ContactField) {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }

    function messageFor(issue: ContactIssue): string {
        if (issue.field === 'name') {
            return issue.reason === 'required' ? t('err_name_required') : t('err_name_long');
        }
        if (issue.field === 'email') {
            return issue.reason === 'required' ? t('err_email_required') : t('err_email_invalid');
        }
        return issue.reason === 'required' ? t('err_message_required') : t('err_message_long');
    }

    /** Same rules the API enforces; only the messages are localised here. */
    function validate(values: ContactValues): Errors {
        const next: Errors = {};
        for (const issue of validateContact(values)) {
            if (!next[issue.field]) next[issue.field] = messageFor(issue);
        }
        return next;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;

        const form = e.currentTarget;
        const formData = new FormData(form);
        const values = trimContactValues({
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        });

        // Block empty / whitespace-only submissions before hitting the network.
        const found = validate(values);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            setStatus('idle');
            return;
        }

        setErrors({});
        setLoading(true);
        setStatus('idle');

        const data = {
            ...values,
            website: formData.get('website'), // Honeypot field
            turnstileToken,
            locale,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                // The API reports which field failed so we can point at it.
                const payload = await res.json().catch(() => null);
                const field = payload?.field as ContactField | undefined;
                if (field && ['name', 'email', 'message'].includes(field)) {
                    setErrors({ [field]: t('err_invalid_field') });
                }
                throw new Error('Submission failed');
            }

            setStatus('success');
            setErrors({});
            setTurnstileToken(DEV_BYPASS);
            // Turnstile tokens are single-use: reset the widget so a second
            // message can be sent without reloading the page.
            turnstileRef.current?.reset();
            form.reset();
        } catch {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    const submitDisabled = loading || !turnstileToken;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-20 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold">{t('info_title')}</h2>
                            <p className="text-neutral-600">{t('info_description')}</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t('phone')}</p>
                                        <a href="tel:+32465811031" className="text-neutral-600 hover:text-primary transition-colors">
                                            +32 465 811031
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold">WhatsApp</p>
                                        <a href="https://wa.me/32465811031" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-[#25D366] transition-colors">
                                            +32 465 811 031
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t('email')}</p>
                                        <p className="text-neutral-600">info@constructief.be</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t('address')}</p>
                                        <p className="text-neutral-600">{t('address_value')}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">{t('social')}</p>
                                    <div className="flex gap-2 mt-2">
                                        <a
                                            href="https://www.instagram.com/constructief_bouw/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            title="Instagram"
                                            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                                        >
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                        <a
                                            href="https://www.facebook.com/profile.php?id=61591572760518"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook"
                                            title="Facebook"
                                            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                                        >
                                            <Facebook className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-neutral-50 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-1">{t('form_title')}</h2>
                            <p className="text-sm text-neutral-500 mb-6">{t('required_hint')}</p>
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
                                            {t('form_name')} <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            required
                                            type="text"
                                            maxLength={CONTACT_LIMITS.name}
                                            autoComplete="name"
                                            className={errors.name ? inputErrCls : inputCls}
                                            aria-invalid={Boolean(errors.name)}
                                            aria-describedby={errors.name ? 'contact-name-error' : undefined}
                                            onInput={() => clearError('name')}
                                        />
                                        <FieldError id="contact-name-error" message={errors.name} />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
                                            {t('form_email')} <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            required
                                            type="email"
                                            maxLength={CONTACT_LIMITS.email}
                                            autoComplete="email"
                                            inputMode="email"
                                            className={errors.email ? inputErrCls : inputCls}
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={errors.email ? 'contact-email-error' : undefined}
                                            onInput={() => clearError('email')}
                                        />
                                        <FieldError id="contact-email-error" message={errors.email} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="contact-subject" className="block text-sm font-medium mb-1">
                                        {t('form_subject')}
                                    </label>
                                    <input
                                        id="contact-subject"
                                        name="subject"
                                        type="text"
                                        maxLength={CONTACT_LIMITS.subject}
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
                                        {t('form_message')} <span className="text-red-600">*</span>
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={4}
                                        maxLength={CONTACT_LIMITS.message}
                                        className={errors.message ? inputErrCls : inputCls}
                                        aria-invalid={Boolean(errors.message)}
                                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                                        onInput={() => clearError('message')}
                                    />
                                    <FieldError id="contact-message-error" message={errors.message} />
                                </div>

                                {/* Honeypot field (hidden from users) */}
                                <div className="hidden" aria-hidden="true">
                                    <input
                                        name="website"
                                        type="text"
                                        autoComplete="off"
                                        tabIndex={-1}
                                    />
                                </div>

                                {process.env.NODE_ENV !== 'development' && (
                                    <div className="flex justify-center py-2">
                                        <Turnstile
                                            ref={turnstileRef}
                                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                                            onSuccess={(token) => setTurnstileToken(token)}
                                            onExpire={() => setTurnstileToken('')}
                                            onError={() => setTurnstileToken('')}
                                        />
                                    </div>
                                )}

                                <Button type="submit" disabled={submitDisabled} className="w-full">
                                    {loading ? t('form_submit') + '...' : t('form_submit')}
                                </Button>

                                {status === 'success' && (
                                    <p role="status" className="mt-4 text-green-600 text-center font-medium">
                                        {t('success')}
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p role="alert" className="mt-4 text-red-600 text-center font-medium">
                                        {t('error')}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

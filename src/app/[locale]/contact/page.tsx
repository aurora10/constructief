"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

export default function ContactPage() {
    const t = useTranslations('ContactPage');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [turnstileToken, setTurnstileToken] = useState<string>('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            website: formData.get('website'), // Honeypot field
            turnstileToken,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error('Submission failed');

            setStatus('success');
            setTurnstileToken(''); // Clear token on success
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

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
                                        <p className="text-neutral-600">Antwerp, Belgium</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-neutral-50 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-6">{t('form_title')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('form_name')}</label>
                                        <input name="name" required type="text" className="w-full p-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('form_email')}</label>
                                        <input name="email" required type="email" className="w-full p-2 border rounded-md" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('form_subject')}</label>
                                    <input name="subject" type="text" className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('form_message')}</label>
                                    <textarea name="message" required rows={4} className="w-full p-2 border rounded-md" />
                                </div>

                                {/* Honeypot field (hidden from users) */}
                                <div className="hidden">
                                    <input
                                        name="website"
                                        type="text"
                                        autoComplete="off"
                                        tabIndex={-1}
                                    />
                                </div>

                                <div className="flex justify-center py-2">
                                    <Turnstile
                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                                        onSuccess={(token) => setTurnstileToken(token)}
                                        onExpire={() => setTurnstileToken('')}
                                        onError={() => setTurnstileToken('')}
                                    />
                                </div>

                                <Button type="submit" disabled={loading || !turnstileToken} className="w-full">
                                    {loading ? t('form_submit') + '...' : t('form_submit')}
                                </Button>

                                {status === 'success' && (
                                    <p className="mt-4 text-green-600 text-center font-medium">
                                        {t('success')}
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p className="mt-4 text-red-600 text-center font-medium">
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

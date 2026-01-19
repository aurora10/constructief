"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    const t = useTranslations('ContactPage');

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
                                        <p className="text-neutral-600">+32 123 45 67 89</p>
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
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('form_name')}</label>
                                        <input type="text" className="w-full p-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('form_email')}</label>
                                        <input type="email" className="w-full p-2 border rounded-md" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('form_subject')}</label>
                                    <input type="text" className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('form_message')}</label>
                                    <textarea rows={4} className="w-full p-2 border rounded-md" />
                                </div>
                                <Button type="submit" className="w-full">{t('form_submit')}</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

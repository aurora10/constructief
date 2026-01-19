"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';

export default function PrivacyPage() {
    const t = useTranslations('PrivacyPage');

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
            />

            <section className="py-20 bg-white">
                <div className="container max-w-3xl">
                    <div className="prose prose-neutral lg:prose-lg">
                        <p>{t('content')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

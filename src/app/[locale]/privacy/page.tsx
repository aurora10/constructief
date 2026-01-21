"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';

export default function PrivacyPage() {
    const t = useTranslations('PrivacyPage');

    const sections = ['collection', 'usage', 'sharing', 'security', 'rights'];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
            />

            <section className="py-20 bg-white">
                <div className="container max-w-4xl">
                    <div className="prose prose-neutral lg:prose-lg max-w-none">
                        <p className="text-muted-foreground mb-8">
                            {t('last_updated')}
                        </p>
                        <p className="lead mb-12">
                            {t('intro')}
                        </p>

                        <div className="space-y-12">
                            {sections.map((section) => (
                                <div key={section} className="scroll-mt-20">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {t(`sections.${section}.title`)}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {t(`sections.${section}.content`)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Team } from '@/components/sections/Team';
import { Values } from '@/components/sections/Values';

import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: pageAlternates(locale, '/over-ons') };
}

export default function AboutPage() {
    const t = useTranslations('AboutPage');

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-20 bg-white">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-lg text-neutral-600 space-y-6">
                        <p>{t('story_p1')}</p>
                        <p>{t('story_p2')}</p>
                    </div>
                </div>
            </section>

            <Values />
            <Team />
        </div>
    );
}

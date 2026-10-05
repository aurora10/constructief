import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedJobs } from '@/components/sections/FeaturedJobs';
import { TradeJobLinks } from '@/components/sections/TradeJobLinks';
import { CandidateForm } from '@/components/forms/CandidateForm';
import { WorkerFaqSection } from '@/components/sections/WorkerFaqSection';
import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/seo';

// Self-referencing canonical; RU worker cluster gets x-default → self (standalone),
// never collapsed into the B2B Dutch pages.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: pageAlternates(locale, '/kandidaten') };
}

export default async function CandidatesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'CandidatesPage' });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />
            <CandidateForm />
            <HowItWorks />
            <WorkerFaqSection />
            <FeaturedJobs />
            <TradeJobLinks locale={locale} />
        </div>
    );
}

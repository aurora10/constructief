import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedJobs } from '@/components/sections/FeaturedJobs';
import { CandidateForm } from '@/components/forms/CandidateForm';
import { WorkerFaqSection } from '@/components/sections/WorkerFaqSection';
import type { Metadata } from 'next';

// Self-referencing canonical; RU worker cluster gets x-default → self (standalone),
// never collapsed into the B2B Dutch pages.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const canonical = `https://constructief-bouw.be/${locale}/kandidaten`;
    const alternates: Metadata['alternates'] = { canonical };
    if (locale === 'ru') {
        alternates.languages = { 'x-default': canonical };
    }
    return { alternates };
}

export default function CandidatesPage() {
    const t = useTranslations('CandidatesPage');

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
        </div>
    );
}

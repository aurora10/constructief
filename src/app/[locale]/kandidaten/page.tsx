import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedJobs } from '@/components/sections/FeaturedJobs';
import { CandidateForm } from '@/components/forms/CandidateForm';

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
            <FeaturedJobs />
        </div>
    );
}

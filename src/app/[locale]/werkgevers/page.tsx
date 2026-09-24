import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmployerUSP } from '@/components/sections/EmployerUSP';
import { Services } from '@/components/sections/Services';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { Testimonials } from '@/components/sections/Testimonials';
import { EmployerForm } from '@/components/forms/EmployerForm';

import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: pageAlternates(locale, '/werkgevers') };
}

export default function EmployersPage() {
    const t = useTranslations('EmployersPage');

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />
            <EmployerUSP />
            <EmployerForm />
            <Services />
            <TrustSignals />
            <Testimonials />
        </div>
    );
}

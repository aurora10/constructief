import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmployerUSP } from '@/components/sections/EmployerUSP';
import { Services } from '@/components/sections/Services';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { Testimonials } from '@/components/sections/Testimonials';
import { EmployerForm } from '@/components/forms/EmployerForm';

const BASE_URL = 'https://constructief-bouw.be';

// Only the French version exists (it targets the FR "sous-traitance bâtiment"
// query); other locales 404 instead of serving a duplicate-language page.
export function generateStaticParams() {
    return [{ locale: 'fr' }];
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    if (locale !== 'fr') {
        return { robots: { index: false, follow: false } };
    }
    const t = await getTranslations({ locale, namespace: 'SousTraitance' });
    return {
        title: t('title'),
        description: t('subtitle'),
        alternates: {
            canonical: `${BASE_URL}/fr/sous-traitance-batiment`,
        },
    };
}

export default async function SousTraitancePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    if (locale !== 'fr') {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'SousTraitance' });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title={t('title')} subtitle={t('subtitle')} />
            <EmployerUSP />
            <EmployerForm />
            <Services />
            <TrustSignals />
            <Testimonials />
        </div>
    );
}

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { SubcontractorForm } from '@/components/forms/SubcontractorForm';

// Intake page sent directly to sub-contractors. One URL per locale:
// /nl/onderaannemer-inschrijven, /fr/onderaannemer-inschrijven,
// /ru/onderaannemer-inschrijven
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SubcontractorForm' });
    const canonical = `https://constructief-bouw.be/${locale}/onderaannemer-inschrijven`;
    return {
        title: `${t('page_title')} | Constructief`,
        description: t('page_subtitle'),
        alternates: { canonical },
    };
}

export default async function SubcontractorIntakePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'SubcontractorForm' });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title={t('page_title')} subtitle={t('page_subtitle')} />
            <section className="py-14 px-4 md:px-8 bg-white dark:bg-neutral-950">
                <div className="container">
                    <SubcontractorForm />
                </div>
            </section>
        </div>
    );
}

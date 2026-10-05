import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { VacancyList } from '@/components/vacancies/VacancyList';
import { dutchOnlyAlternates } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });

    return {
        title: `${t('title')} | Constructief`,
        description: t('subtitle'),
        alternates: dutchOnlyAlternates(locale, '/vacatures'),
        // The vacancy list holds Dutch-only copy: the fr/ru versions would be
        // near-duplicates, so only the nl listing is offered for indexing.
        robots: locale === 'nl' ? { index: true, follow: true } : { index: false, follow: true },
        openGraph: {
            title: `${t('title')} | Constructief`,
            description: t('subtitle'),
            type: 'website',
            siteName: 'Constructief',
        },
    };
}

export default async function VacanciesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title={t('title')} subtitle={t('subtitle')} />

            <section className="py-12 bg-white">
                <div className="container">
                    <VacancyList />
                </div>
            </section>
        </div>
    );
}

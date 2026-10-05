import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { VacancyList } from '@/components/vacancies/VacancyList';
import { dutchOnlyAlternates } from '@/lib/seo';
import { Link } from '@/i18n/routing';
import { jobsByTrade } from '@/data/vacancies';
import { jobTradePages } from '@/data/vacancyTrades';

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

                    {/* Trade landing pages: real internal links (not JS-only) so both
                        visitors and crawlers find /vacatures/{trade} from here. */}
                    <div className="mt-16 pt-10 border-t">
                        <h2 className="text-2xl font-bold mb-2">Vacatures per vakgebied</h2>
                        <p className="text-neutral-600 mb-6 max-w-2xl">
                            Zoek je werk in een specifiek vak? Op de vakpagina vind je wat het werk
                            inhoudt, welke attesten gevraagd worden en welke opdrachten openstaan.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jobTradePages.map((trade) => (
                                <Link
                                    key={trade.slug}
                                    href={`/vacatures/${trade.slug}`}
                                    className="group border rounded-lg p-5 hover:shadow-md hover:border-primary transition-all"
                                >
                                    <span className="font-semibold block mb-1 group-hover:text-primary">
                                        Vacatures {trade.linkLabel.toLowerCase()}
                                    </span>
                                    <span className="text-sm text-neutral-500">
                                        {jobsByTrade(trade.jobTradeSlug).length > 0
                                            ? `${jobsByTrade(trade.jobTradeSlug).length} openstaande opdracht(en)`
                                            : 'Doorlopend opdrachten in heel België'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

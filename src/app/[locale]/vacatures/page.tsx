import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/layout/PageHeader';
import { VacancyList } from '@/components/vacancies/VacancyList';
import { vacancyAlternates } from '@/lib/seo';
import { Link } from '@/i18n/routing';
import { jobsByTrade } from '@/data/vacancies';
import { jobTradePages, tradeLinkLabel } from '@/data/vacancyTrades';
import { BRAND } from '@/lib/brand';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });

    return {
        title: `${t('title')} | ${BRAND.name}`,
        description: t('subtitle'),
        alternates: vacancyAlternates(locale, '/vacatures'),
        // Indexed for nl (Belgian job market) and ru (the crews we recruit in
        // Eastern Europe, who read Russian). fr has no vacancy audience and only
        // duplicates the Dutch copy, so it stays out of the index.
        robots: locale === 'fr' ? { index: false, follow: true } : { index: true, follow: true },
        openGraph: {
            title: `${t('title')} | ${BRAND.name}`,
            description: t('subtitle'),
            type: 'website',
            siteName: BRAND.name,
        },
    };
}

export default async function VacanciesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });
    const tUi = await getTranslations({ locale, namespace: 'VacancyUI' });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title={t('title')} subtitle={t('subtitle')} />

            <section className="py-12 bg-white">
                <div className="container">
                    <VacancyList />

                    {/* Trade landing pages: real internal links (not JS-only) so both
                        visitors and crawlers find /vacatures/{trade} from here. */}
                    <div className="mt-16 pt-10 border-t">
                        <h2 className="text-2xl font-bold mb-2">{tUi('trade_pages_title')}</h2>
                        <p className="text-neutral-600 mb-6 max-w-2xl">{tUi('trade_pages_text')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jobTradePages.map((trade) => {
                                const openCount = jobsByTrade(trade.jobTradeSlug).length;
                                return (
                                    <Link
                                        key={trade.slug}
                                        href={`/vacatures/${trade.slug}`}
                                        className="group border rounded-lg p-5 hover:shadow-md hover:border-primary transition-all"
                                    >
                                        <span className="font-semibold block mb-1 group-hover:text-primary">
                                            {tradeLinkLabel(trade, locale)}
                                        </span>
                                        <span className="text-sm text-neutral-500">
                                            {openCount > 0
                                                ? tUi('openings_count', { count: openCount })
                                                : tUi('continuous_work')}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

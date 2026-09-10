import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getArticles } from '@/content/nieuws';

const BASE_URL = 'https://constructief-bouw.be';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'NewsPage' });
    const canonical = `${BASE_URL}/${locale}/nieuws`;
    const isWorkerCluster = locale === 'ru';

    return {
        title: `${t('title')} | Constructief`,
        description: t('subtitle'),
        alternates: {
            canonical,
            languages: isWorkerCluster
                ? { 'x-default': canonical }
                : { nl: `${BASE_URL}/nl/nieuws`, fr: `${BASE_URL}/fr/nieuws`, 'x-default': `${BASE_URL}/nl/nieuws` },
        },
    };
}

function imageFor(slug: string, legacyIds?: string[]): string | null {
    const numeric = legacyIds?.[0];
    return numeric ? `/images/news/article-${numeric}.png` : null;
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getUTCFullYear()}`;
}

export default async function NewsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'NewsPage' });
    const articles = getArticles(locale);

    const listJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: articles.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${BASE_URL}/${locale}/nieuws/${a.slug}`,
            name: a.title,
        })),
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />

            <PageHeader title={t('title')} subtitle={t('subtitle')} />

            <section className="py-12 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {articles.map((article) => {
                            const image = imageFor(article.slug, article.legacyIds);
                            return (
                                <div key={article.slug} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    {image ? (
                                        <div className="h-48 bg-neutral-200 overflow-hidden">
                                            <img src={image} alt={article.title} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-[#0a0f1a] via-[#10233f] to-[#1d4ed8] flex items-center justify-center">
                                            <span className="text-white/80 font-semibold tracking-wide uppercase text-xs px-6 text-center">
                                                {article.category}
                                            </span>
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-4">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                                                {article.category}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(article.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{article.readingMinutes} {t('min_read')}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                                        <p className="text-neutral-600 mb-4 flex-1">{article.description}</p>
                                        <Button asChild variant="link" className="p-0 justify-start">
                                            <Link href={`/nieuws/${article.slug}`} className="inline-flex items-center gap-1">
                                                {t('read_more')}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

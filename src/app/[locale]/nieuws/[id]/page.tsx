import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Share2, Clock, ChevronRight, Home, ArrowRight } from 'lucide-react';
import { getArticle, getArticles, findSlugByLegacyId } from '@/content/nieuws';
import { ArticleImage } from '@/components/news/ArticleImage';
import type { ArticleBlock } from '@/content/nieuws';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

const BASE_URL = 'https://constructief-bouw.be';

/** Fallback image for the migrated posts (article-1/2/3.png). */
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

export function generateStaticParams() {
    const params: { locale: string; id: string }[] = [];
    for (const locale of routing.locales) {
        for (const article of getArticles(locale)) {
            params.push({ locale, id: article.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const article = getArticle(locale, id);
    if (!article) return { title: 'Not Found', robots: { index: false, follow: false } };

    const canonical = `${BASE_URL}/${locale}/nieuws/${article.slug}`;
    const isWorkerCluster = locale === 'ru';

    // ru is a separate (worker) cluster → never an alternate of the nl/fr pages.
    const languages: Record<string, string> = isWorkerCluster
        ? { 'x-default': canonical }
        : {
              nl: `${BASE_URL}/nl/nieuws/${article.slug}`,
              'x-default': `${BASE_URL}/nl/nieuws/${article.slug}`,
          };
    if (!isWorkerCluster && getArticle('fr', article.slug)) {
        languages.fr = `${BASE_URL}/fr/nieuws/${article.slug}`;
    }

    const image = article.image ?? imageFor(article.slug, article.legacyIds);

    return {
        title: `${article.title} | Constructief`,
        description: article.description,
        keywords: article.keywords,
        alternates: { canonical, languages },
        openGraph: {
            type: 'article',
            title: article.title,
            description: article.description,
            url: canonical,
            locale,
            siteName: 'Constructief',
            publishedTime: article.date,
            modifiedTime: article.updated || article.date,
            authors: [article.author],
            ...(image ? { images: [{ url: `${BASE_URL}${image}` }] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.description,
        },
    };
}

function Block({ block }: { block: ArticleBlock }) {
    switch (block.type) {
        case 'h2':
            return <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">{block.text}</h2>;
        case 'ul':
            return (
                <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                    {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            );
        case 'quote':
            return (
                <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 text-xl font-medium text-neutral-900 italic">
                    {block.text}
                </blockquote>
            );
        default:
            return <p>{block.text}</p>;
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const article = getArticle(locale, id);
    if (!article) {
        // Legacy numeric URL (/nieuws/1) → permanent redirect to the slug
        const legacySlug = findSlugByLegacyId(id);
        if (legacySlug) permanentRedirect(`/${locale}/nieuws/${legacySlug}`);
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'NewsPage' });
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });

    const canonical = `${BASE_URL}/${locale}/nieuws/${article.slug}`;
    const image = article.image ?? imageFor(article.slug, article.legacyIds);

    const blogPostingJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.updated || article.date,
        inLanguage: locale,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        author: article.authorIsOrganization
            ? { '@type': 'Organization', name: article.author }
            : { '@type': 'Person', name: article.author },
        publisher: {
            '@type': 'Organization',
            name: 'Constructief',
            url: BASE_URL,
        },
        ...(image ? { image: [`${BASE_URL}${image}`] } : {}),
        ...(article.keywords ? { keywords: article.keywords.join(', ') } : {}),
        articleSection: article.category,
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: tNav('home'), item: `${BASE_URL}/${locale}` },
            { '@type': 'ListItem', position: 2, name: tNav('news'), item: `${BASE_URL}/${locale}/nieuws` },
            { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
        ],
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            {/* Breadcrumb */}
            <nav aria-label={tNav('home')} className="container py-4 text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1.5">
                    <li>
                        <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
                            <Home className="w-3.5 h-3.5" />
                            {tNav('home')}
                        </Link>
                    </li>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                    <li>
                        <Link href="/nieuws" className="hover:text-primary">{tNav('news')}</Link>
                    </li>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                    <li className="font-medium text-neutral-900" aria-current="page">{article.title}</li>
                </ol>
            </nav>

            <section className="py-12 bg-white">
                <div className="container max-w-3xl">
                    <Button asChild variant="ghost" className="mb-8">
                        <Link href="/nieuws" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('back_to_news')}
                        </Link>
                    </Button>

                    <article className="max-w-none">
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-neutral-500 mb-8 border-b pb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(article.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{article.readingMinutes} {t('min_read')}</span>
                            </div>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{article.category}</span>
                            {article.updated && (
                                <span className="text-neutral-400">{t('updated_label')} {formatDate(article.updated)}</span>
                            )}
                        </div>

                        <ArticleImage src={image} alt={article.title} category={article.category} variant="hero" />

                        <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                            {article.blocks.map((block, i) => (
                                <Block key={i} block={block} />
                            ))}
                        </div>

                        {/* Related internal links */}
                        {article.related && article.related.length > 0 && (
                            <div className="mt-14 pt-8 border-t">
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
                                    {t('related_title')}
                                </h2>
                                <ul className="space-y-2">
                                    {article.related.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-10 pt-8 border-t flex justify-between items-center">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Share2 className="h-4 w-4" />
                                {t('share')}
                            </Button>
                        </div>
                    </article>
                </div>
            </section>

            {/* CTA */}
            {article.cta && (
                <section className="py-20 px-4 md:px-8 bg-primary text-white text-center">
                    <div className="container max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{article.cta.title}</h2>
                        <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">{article.cta.text}</p>
                        <Button
                            asChild
                            size="lg"
                            variant="secondary"
                            className="text-lg px-8 py-6 rounded-full bg-white text-neutral-900 hover:bg-blue-50"
                        >
                            <Link href={article.cta.href}>
                                {article.cta.label}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
}

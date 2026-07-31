import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { articleIds } from '@/data/news';
import { routing } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
    const params: { locale: string; id: string }[] = [];
    for (const locale of routing.locales) {
        for (const id of articleIds) {
            params.push({ locale, id });
        }
    }
    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const t = await getTranslations({ locale, namespace: 'NewsPage' });

    if (!articleIds.includes(id)) return { title: 'Not Found' };

    return {
        title: `${t(`articles.${id}.title`)} | Constructief`,
        description: t(`articles.${id}.content_p1`),
    };
}

export default async function NewsDetailPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'NewsPage' });

    // Validate article exists
    if (!articleIds.includes(id)) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t(`articles.${id}.title`)}
                subtitle={t('subtitle')}
            />

            <section className="py-12 bg-white">
                <div className="container max-w-3xl">
                    <Button asChild variant="ghost" className="mb-8">
                        <Link href="/nieuws" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('back_to_news')}
                        </Link>
                    </Button>

                    <article className="prose prose-neutral max-w-none">
                        <div className="flex items-center gap-6 text-sm text-neutral-500 mb-8 border-b pb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{t(`articles.${id}.date`)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{t(`articles.${id}.author`)}</span>
                            </div>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                                {t(`articles.${id}.category`)}
                            </span>
                        </div>

                        <div className="h-64 bg-neutral-200 rounded-xl mb-12 overflow-hidden">
                            <img
                                src={`/images/news/article-${id}.png`}
                                alt={t(`articles.${id}.title`)}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                            <p>{t(`articles.${id}.content_p1`)}</p>
                            <p>{t(`articles.${id}.content_p2`)}</p>

                            <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">
                                {t(`articles.${id}.content_h2`)}
                            </h2>

                            <p>{t(`articles.${id}.content_p3`)}</p>
                            <p>{t(`articles.${id}.content_p4`)}</p>
                            <p>{t(`articles.${id}.content_p5`)}</p>
                        </div>

                        <div className="mt-12 pt-8 border-t flex justify-between items-center">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Share2 className="h-4 w-4" />
                                {t('share')}
                            </Button>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}
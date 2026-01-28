"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Calendar, User } from "lucide-react";
import { articleIds as articleIdsData } from "@/data/news";

export default function NewsPage() {
    const t = useTranslations('NewsPage');

    const articleIds = articleIdsData;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-12 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {articleIds.map((id) => (
                            <div key={id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-48 bg-neutral-200 overflow-hidden">
                                    <img
                                        src={`/images/news/article-${id}.png`}
                                        alt={t(`articles.${id}.title`)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                                            {t(`articles.${id}.category`)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{t(`articles.${id}.date`)}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{t(`articles.${id}.title`)}</h3>
                                    <p className="text-neutral-600 mb-4">{t(`articles.${id}.excerpt`)}</p>
                                    <Button asChild variant="link" className="p-0">
                                        <Link href={`/nieuws/${id}`}>{t('read_more')}</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

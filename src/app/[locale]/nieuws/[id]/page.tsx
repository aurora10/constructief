"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

export default function NewsDetailPage() {
    const t = useTranslations('NewsPage');
    const params = useParams();
    const id = params.id;

    // Placeholder article data
    const article = {
        title: "De toekomst van duurzaam bouwen",
        date: "15 Jan 2026",
        author: "Jan Janssens",
        category: "Innovatie",
        content: `
            <p className="mb-4">De bouwsector staat voor enorme uitdagingen én kansen op het gebied van duurzaamheid. Nu we richting 2026 en verder gaan, zien we een versnelling in de adoptie van groene technologieën en circulaire bouwmethoden.</p>
            <p className="mb-4">Van modulaire houtbouw tot CO2-negatief beton, de innovaties volgen elkaar in ijltempo op. In dit artikel duiken we dieper in de belangrijkste trends die de sector de komende jaren zullen vormgeven.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Circulaire Economie</h2>
            <p className="mb-4">Het hergebruik van materialen is niet langer een optie, maar een noodzaak geworden. Ontwerpen voor demontage wordt de nieuwe standaard, waarbij gebouwen worden gezien als opslagplaatsen van waardevolle grondstoffen voor de toekomst.</p>
        `
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={article.title}
                subtitle={`${t('subtitle')} - ID: ${id}`}
            />

            <section className="py-12 bg-white">
                <div className="container max-w-3xl">
                    <Button asChild variant="ghost" className="mb-8">
                        <Link href="/nieuws" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('back_to_news' || 'Terug naar nieuws')}
                        </Link>
                    </Button>

                    <article className="prose prose-neutral max-w-none">
                        <div className="flex items-center gap-6 text-sm text-neutral-500 mb-8 border-b pb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{article.author}</span>
                            </div>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{article.category}</span>
                        </div>

                        <div className="h-64 bg-neutral-200 rounded-xl mb-12 flex items-center justify-center text-neutral-400">
                            [Afbeeldings placeholder]
                        </div>

                        <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                            <p>De bouwsector staat voor enorme uitdagingen én kansen op het gebied van duurzaamheid. Nu we richting 2026 en verder gaan, zien we een versnelling in de adoptie van groene technologieën en circulaire bouwmethoden.</p>
                            <p>Van modulaire houtbouw tot CO2-negatief beton, de innovaties volgen elkaar in ijltempo op. In dit artikel duiken we dieper in de belangrijkste trends die de sector de komende jaren zullen vormgeven.</p>
                            <h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-6">Circulaire Economie</h2>
                            <p>Het hergebruik van materialen is niet langer een optie, maar een noodzaak geworden. Ontwerpen voor demontage wordt de nieuwe standaard, waarbij gebouwen worden gezien als opslagplaatsen van waardevolle grondstoffen voor de toekomst.</p>
                        </div>

                        <div className="mt-12 pt-8 border-t flex justify-between items-center">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Share2 className="h-4 w-4" />
                                Delen
                            </Button>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

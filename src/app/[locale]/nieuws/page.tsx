"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Calendar, User } from "lucide-react";

export default function NewsPage() {
    const t = useTranslations('NewsPage');

    const news = [
        {
            id: 1,
            title: "De toekomst van duurzaam bouwen",
            date: "15 Jan 2026",
            author: "Jan Janssens",
            category: "Innovatie",
            excerpt: "Ontdek de nieuwste trends en technologieën die de bouwsector transformeren.",
        },
        {
            id: 2,
            title: "Veiligheid op de werf: tips & tricks",
            date: "10 Jan 2026",
            author: "Marie Peeters",
            category: "Veiligheid",
            excerpt: "Praktische tips om de veiligheid op de bouwwerf te garanderen.",
        },
        {
            id: 3,
            title: "Nieuwe regelgeving 2026",
            date: "05 Jan 2026",
            author: "Peter Maes",
            category: "Wetgeving",
            excerpt: "Een overzicht van de belangrijkste wetswijzigingen voor de bouwsector.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-12 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-48 bg-neutral-200" />
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">{item.category}</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-neutral-600 mb-4">{item.excerpt}</p>
                                    <Button asChild variant="link" className="p-0">
                                        <Link href={`/nieuws/${item.id}`}>{t('read_more')}</Link>
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

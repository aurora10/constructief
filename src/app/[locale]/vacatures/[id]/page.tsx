"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Euro } from "lucide-react";

export default function VacancyDetailPage() {
    const t = useTranslations('VacanciesPage');
    const params = useParams();
    const id = params.id;

    // In a real app, you would fetch the job data based on the ID
    // For now, we use placeholder data
    const job = {
        title: "Projectleider Bouw",
        location: "Antwerpen",
        type: "Fulltime",
        salary: "€4000 - €5500",
        description: "Wij zoeken een ervaren projectleider voor grote utiliteitsbouwprojecten. Als projectleider ben je verantwoordelijk for de algehele leiding over diverse bouwprojecten vanaf de voorbereidingsfase tot de oplevering.",
        requirements: [
            "Bachelor of Master in de Bouwkunde",
            "Minimaal 5 jaar ervaring in een soortgelijke functie",
            "Uitstekende organisatorische en communicatieve vaardigheden",
            "Vloeiend in het Nederlands"
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "validThrough": "2026-04-20",
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
            "@type": "Organization",
            "name": "Constructief",
            "sameAs": "https://constructief-bouw.be"
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressRegion": "Antwerpen",
                "addressCountry": "BE"
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "EUR",
            "value": {
                "@type": "QuantitativeValue",
                "minValue": 4000,
                "maxValue": 5500,
                "unitText": "MONTH"
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PageHeader
                title={job.title}
                subtitle={`${t('subtitle')} - ID: ${id}`}
            />

            <section className="py-12 bg-white">
                <div className="container max-w-4xl">
                    <Button asChild variant="ghost" className="mb-8">
                        <Link href="/vacatures" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('view_all')}
                        </Link>
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Functieomschrijving</h2>
                                <p className="text-neutral-600 leading-relaxed">
                                    {job.description}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">Vereisten</h2>
                                <ul className="list-disc list-inside space-y-2 text-neutral-600">
                                    {job.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-8">
                                <Button size="lg" className="w-full md:w-auto">
                                    {t('FeaturedJobs.apply')}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border rounded-lg bg-neutral-50 sticky top-24">
                                <h3 className="font-bold mb-4">Job Details</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <span>{job.type}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <Euro className="h-5 w-5 text-primary" />
                                        <span>{job.salary}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

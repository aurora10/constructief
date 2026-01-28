"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useParams, notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Euro } from "lucide-react";
import { jobs } from '@/data/vacancies';

export default function VacancyDetailPage() {
    const t = useTranslations('VacanciesPage');
    const params = useParams();
    const id = Number(params.id);

    const job = jobs.find(j => j.id === id);

    if (!job) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "validThrough": "2026-04-20",
        "employmentType": job.type === "Fulltime" ? "FULL_TIME" : "TEMPORARY",
        "hiringOrganization": {
            "@type": "Organization",
            "name": "Constructief",
            "sameAs": "https://constructief-bouw.be"
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location, // Assuming city for now
                "addressCountry": "BE"
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "EUR",
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salary, // This might need parsing if strict schema is needed, but for now passing string
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
                subtitle={t('subtitle')}
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

                            {job.requirements && job.requirements.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Vereisten</h2>
                                    <ul className="list-disc list-inside space-y-2 text-neutral-600">
                                        {job.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-8">
                                <Button asChild size="lg" className="w-full md:w-auto">
                                    <Link href="/kandidaten">
                                        {t('apply')}
                                    </Link>
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

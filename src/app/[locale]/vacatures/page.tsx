"use client";

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { MapPin, Clock, Euro, Search, Filter } from "lucide-react";
import { jobs as jobsData } from "@/data/vacancies";

export default function VacanciesPage() {
    const t = useTranslations('VacanciesPage');

    const jobs = jobsData;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-12 bg-white">
                <div className="container">
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-12">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            {t('filter')}
                        </Button>
                    </div>

                    {/* Job List */}
                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map((job) => (
                            <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                    <p className="text-neutral-600 mb-4 max-w-2xl">{job.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{job.type}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Euro className="h-4 w-4" />
                                            <span>{job.salary}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button asChild>
                                    <Link href={`/vacatures/${job.id}`}>{t('view_details')}</Link>
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="mt-12 flex justify-center gap-2">
                        <Button variant="outline" disabled>&lt;</Button>
                        <Button variant="default">1</Button>
                        <Button variant="outline">2</Button>
                        <Button variant="outline">3</Button>
                        <Button variant="outline">&gt;</Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

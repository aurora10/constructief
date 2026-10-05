"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { MapPin, Clock, Euro } from "lucide-react";
import { jobs as allJobs } from "@/data/vacancies";

export function FeaturedJobs() {
    const t = useTranslations("FeaturedJobs");

    // Source of truth is src/data/vacancies.ts: this block used to carry its own
    // hardcoded copy of the first three jobs, which would silently drift from the
    // real listings. Newest first, three of them.
    const jobs = [...allJobs]
        .sort((a, b) => b.datePosted.localeCompare(a.datePosted))
        .slice(0, 3);

    return (
        <section className="py-20 bg-white">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
                            {t("title")}
                        </h2>
                        <p className="mt-4 text-lg text-neutral-600">
                            {t("subtitle")}
                        </p>
                    </div>
                    <Button asChild variant="outline" className="mt-4 md:mt-0">
                        <Link href="/vacatures">{t("view_all")}</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4">{job.title}</h3>
                            <div className="space-y-3 text-neutral-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{job.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Euro className="h-4 w-4" />
                                    <span>{job.salary}</span>
                                </div>
                            </div>
                            <Button asChild className="w-full">
                                <Link href={`/vacatures/${job.id}`}>{t("apply")}</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

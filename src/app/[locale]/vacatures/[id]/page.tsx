import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft, MapPin, Clock, Euro } from "lucide-react";
import { jobs } from '@/data/vacancies';
import { routing } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
    const params: { locale: string; id: string }[] = [];
    for (const locale of routing.locales) {
        for (const job of jobs) {
            params.push({ locale, id: String(job.id) });
        }
    }
    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const job = jobs.find(j => j.id === Number(id));

    if (!job) return { title: 'Not Found' };

    return {
        title: `${job.title} | Constructief`,
        description: job.description,
    };
}

export default async function VacancyDetailPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });

    const job = jobs.find(j => j.id === Number(id));

    if (!job) {
        notFound();
    }

    // Parse the salary ("€4000 - €5500" monthly, "€17 - €19 / uur" hourly) into a
    // numeric MonetaryAmount range so the JobPosting markup is valid.
    const salaryNumbers = (job.salary.match(/[\d.,]+/g) ?? [])
        .map((n) => parseFloat(n.replace(',', '.')))
        .filter((n) => !Number.isNaN(n));
    const isHourly = /\/\s*uur/i.test(job.salary);
    const baseMin = salaryNumbers[0];
    const baseMax = salaryNumbers.length > 1 ? salaryNumbers[1] : salaryNumbers[0];

    const employmentType =
        job.type === 'Fulltime'
            ? 'FULL_TIME'
            : job.type === 'Parttime'
              ? 'PART_TIME'
              : job.type === 'Interim'
                ? 'TEMPORARY'
                : 'OTHER';

    // Best-effort postal address used in the JobPosting markup. Where the data
    // only names a province ("Limburg", "West-Vlaanderen") there is no single
    // postcode, so we omit that field rather than invent one.
    const addressByLocation: Record<string, { addressRegion: string; postalCode?: string }> = {
        Antwerpen: { addressRegion: 'Antwerpen', postalCode: '2000' },
        Gent: { addressRegion: 'Oost-Vlaanderen', postalCode: '9000' },
        Brussel: { addressRegion: 'Brussels Hoofdstedelijk Gewest', postalCode: '1000' },
        Limburg: { addressRegion: 'Limburg' },
        'West-Vlaanderen': { addressRegion: 'West-Vlaanderen' },
    };
    const loc = addressByLocation[job.location] ?? {};

    // A future expiry (datePosted + 60 days) so the posting isn't treated as expired.
    const posted = new Date(job.datePosted + 'T00:00:00Z');
    posted.setDate(posted.getDate() + 60);
    const validThrough = posted.toISOString().slice(0, 10);

    const jsonLd = {
        '@context': 'https://schema.org/',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        datePosted: job.datePosted,
        validThrough,
        employmentType,
        hiringOrganization: {
            '@type': 'Organization',
            name: 'Constructief',
            sameAs: 'https://constructief-bouw.be',
            logo: 'https://constructief-bouw.be/icon',
        },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
                ...(loc.addressRegion ? { addressRegion: loc.addressRegion } : {}),
                ...(loc.postalCode ? { postalCode: loc.postalCode } : {}),
                addressCountry: 'BE',
            },
        },
        baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: {
                '@type': 'QuantitativeValue',
                ...(baseMin !== undefined ? { minValue: baseMin } : {}),
                ...(baseMax !== undefined ? { maxValue: baseMax } : {}),
                unitText: isHourly ? 'HOUR' : 'MONTH',
            },
        },
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
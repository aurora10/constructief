import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft, MapPin, Clock, Euro, Home, ChevronRight, CalendarDays, Check } from "lucide-react";
import { jobs } from '@/data/vacancies';
import { routing } from '@/i18n/routing';
import { dutchOnlyAlternates } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

const BASE = 'https://constructief-bouw.be';

/**
 * The vacancy copy is Dutch only (it targets the nl job-seeker queries). The
 * fr/ru routes keep working but are noindexed, so we never publish the same
 * Dutch text a second and third time under /fr and /ru URLs — that was one of
 * the "duplicate, Google chose different canonical" sources.
 */
function isIndexable(locale: string) {
    return locale === 'nl';
}

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
        title: `${job.title} — ${job.location} | Constructief`,
        description: job.description,
        // Dutch-only cluster: self-canonical, no fr alternate (see helper).
        alternates: dutchOnlyAlternates(locale, `/vacatures/${id}`),
        robots: isIndexable(locale)
            ? { index: true, follow: true }
            : { index: false, follow: true },
    };
}

/** JobPosting.description wants the full posting, not just the teaser. */
function jobPostingHtml(job: (typeof jobs)[number]) {
    const block = (heading: string, items: string[]) =>
        items.length === 0
            ? ''
            : `<h3>${heading}</h3><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

    return [
        ...job.intro.map((p) => `<p>${p}</p>`),
        block('Wat ga je doen', job.tasks),
        block('Wie zoeken wij', job.requirements),
        block('Wat bieden wij', job.offer),
    ]
        .filter(Boolean)
        .join('');
}

export default async function VacancyDetailPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });

    const job = jobs.find(j => j.id === Number(id));

    if (!job) {
        notFound();
    }

    const canonical = `${BASE}/${locale}/vacatures/${id}`;

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
        description: jobPostingHtml(job),
        datePosted: job.datePosted,
        validThrough,
        employmentType,
        url: canonical,
        // Forms on this site post straight into our own pipeline — Google can
        // label the result "Direct apply" in the jobs experience.
        directApply: true,
        industry: 'Bouw',
        hiringOrganization: {
            '@type': 'Organization',
            '@id': `${BASE}/#organization`,
            name: 'Constructief',
            sameAs: BASE,
            logo: `${BASE}/icon`,
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

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
            { '@type': 'ListItem', position: 2, name: t('title'), item: `${BASE}/${locale}/vacatures` },
            { '@type': 'ListItem', position: 3, name: job.title, item: canonical },
        ],
    };

    const publishedLabel = new Date(job.datePosted + 'T00:00:00Z').toLocaleDateString('nl-BE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <PageHeader
                title={job.title}
                subtitle={`${job.location} · ${job.type} · ${job.salary}`}
            />

            <nav aria-label="Breadcrumb" className="container py-4 text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1.5">
                    <li>
                        <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
                            <Home className="w-3.5 h-3.5" />
                            Home
                        </Link>
                    </li>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                    <li>
                        <Link href="/vacatures" className="hover:text-primary">
                            {t('title')}
                        </Link>
                    </li>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                    <li className="text-foreground font-medium">{job.title}</li>
                </ol>
            </nav>

            <section className="pb-12 bg-white">
                <div className="container max-w-4xl">
                    <Button asChild variant="ghost" className="mb-8">
                        <Link href="/vacatures" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('view_all')}
                        </Link>
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <div className="space-y-4">
                                {job.intro.map((paragraph, index) => (
                                    <p key={index} className="text-neutral-600 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {job.tasks.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Wat ga je doen</h2>
                                    <ul className="space-y-2 text-neutral-600">
                                        {job.tasks.map((task, index) => (
                                            <li key={index} className="flex gap-3">
                                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span>{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {job.requirements.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Wie zoeken wij</h2>
                                    <ul className="space-y-2 text-neutral-600">
                                        {job.requirements.map((req, index) => (
                                            <li key={index} className="flex gap-3">
                                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {job.offer.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Wat bieden wij</h2>
                                    <ul className="space-y-2 text-neutral-600">
                                        {job.offer.map((item, index) => (
                                            <li key={index} className="flex gap-3">
                                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="p-6 border rounded-lg bg-neutral-50">
                                <h2 className="text-xl font-bold mb-2">Solliciteren op deze functie</h2>
                                <p className="text-neutral-600 mb-4">
                                    Vul je gegevens in via het kandidaatformulier. We nemen contact op
                                    zodra we je profiel bekeken hebben — meestal binnen twee werkdagen.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button asChild size="lg">
                                        <Link href="/kandidaten">{t('apply')}</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/vacatures">Alle vacatures</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border rounded-lg bg-neutral-50 md:sticky md:top-24">
                                <h3 className="font-bold mb-4">Over deze functie</h3>
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
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                        <span>
                                            <span className="sr-only">Gepubliceerd op </span>
                                            {publishedLabel}
                                        </span>
                                    </div>
                                </div>

                                <Button asChild className="w-full mt-6">
                                    <Link href="/kandidaten">{t('apply')}</Link>
                                </Button>

                                <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
                                    Constructief is een Belgische aannemer van bouwploegen. Wij werven,
                                    screenen en begeleiden vakmensen voor werven in heel België.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

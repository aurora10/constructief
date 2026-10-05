import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs } from '@/data/vacancies';
import { jobTradePages, getJobTradePage } from '@/data/vacancyTrades';
import { routing } from '@/i18n/routing';
import { dutchOnlyAlternates } from '@/lib/seo';
import { JobDetail } from '@/components/vacancies/JobDetail';
import { TradeJobsLanding } from '@/components/vacancies/TradeJobsLanding';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

const BASE = 'https://constructief-bouw.be';

/**
 * This route serves two page types under one flat URL space:
 *   /vacatures/3           → a single vacancy (numeric id)
 *   /vacatures/metselaar   → the trade job landing page (slug)
 *
 * The flat URL matters for the trade pages: "vacatures metselaar" is the query
 * people type, so the slug sits directly under /vacatures instead of one level
 * deeper. Both cases are Dutch-only copy, so fr/ru resolve but are noindexed.
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
        for (const trade of jobTradePages) {
            params.push({ locale, id: trade.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const robots = isIndexable(locale)
        ? { index: true, follow: true }
        : { index: false, follow: true };

    // Trade landing page (/vacatures/metselaar)
    const trade = getJobTradePage(id);
    if (trade) {
        return {
            title: trade.metaTitle,
            description: trade.metaDescription,
            alternates: dutchOnlyAlternates(locale, `/vacatures/${trade.slug}`),
            robots,
            openGraph: {
                title: trade.metaTitle,
                description: trade.metaDescription,
                type: 'website',
                siteName: 'Constructief',
            },
        };
    }

    // Single vacancy (/vacatures/3)
    const job = jobs.find(j => j.id === Number(id));
    if (!job) return { title: 'Not Found' };

    return {
        title: `${job.title} — ${job.location} | Constructief`,
        description: job.description,
        alternates: dutchOnlyAlternates(locale, `/vacatures/${id}`),
        robots,
        openGraph: {
            title: `${job.title} — ${job.location} | Constructief`,
            description: job.description,
            type: 'article',
            siteName: 'Constructief',
        },
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

export default async function VacancyOrTradePage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    // ---------------------------------------------------------------- trade page
    const trade = getJobTradePage(id);
    if (trade) {
        const canonical = `${BASE}/${locale}/vacatures/${trade.slug}`;
        const t = await getTranslations({ locale, namespace: 'VacanciesPage' });

        const pageJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: trade.h1,
            description: trade.metaDescription,
            url: canonical,
            inLanguage: 'nl-BE',
            isPartOf: { '@type': 'WebSite', name: 'Constructief', url: BASE },
        };

        const breadcrumbJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
                { '@type': 'ListItem', position: 2, name: t('title'), item: `${BASE}/${locale}/vacatures` },
                { '@type': 'ListItem', position: 3, name: trade.linkLabel, item: canonical },
            ],
        };

        // Only the questions we actually answer on the page — Google rejects FAQ
        // markup whose answers are not visible to the reader.
        const faqJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: trade.faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
        };

        const openJobs = jobs.filter((job) => job.tradeSlug === trade.jobTradeSlug);
        const itemListJsonLd =
            openJobs.length > 0
                ? {
                      '@context': 'https://schema.org',
                      '@type': 'ItemList',
                      name: `Openstaande vacatures ${trade.linkLabel}`,
                      numberOfItems: openJobs.length,
                      itemListElement: openJobs.map((job, index) => ({
                          '@type': 'ListItem',
                          position: index + 1,
                          name: job.title,
                          url: `${BASE}/${locale}/vacatures/${job.id}`,
                      })),
                  }
                : null;

        return (
            <div className="flex flex-col min-h-screen">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
                {itemListJsonLd && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
                    />
                )}
                <TradeJobsLanding trade={trade} />
            </div>
        );
    }

    // ------------------------------------------------------------- vacancy page
    const job = jobs.find(j => j.id === Number(id));

    if (!job) {
        notFound();
    }

    const canonical = `${BASE}/${locale}/vacatures/${id}`;
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });

    // Parse "€ 4.000 - € 5.500 per maand" / "€ 17 - € 19 per uur" into a numeric
    // MonetaryAmount range so the JobPosting markup is valid. Belgian number
    // formatting: "." groups thousands and "," is the decimal separator, so the
    // grouping dots have to go before parsing ("4.000" is four thousand, not 4).
    const salaryNumbers = (job.salary.match(/\d[\d.,]*/g) ?? [])
        .map((n) => parseFloat(n.replace(/\./g, '').replace(',', '.')))
        .filter((n) => !Number.isNaN(n));
    const isHourly = /\bper\s+uur\b|\/\s*uur/i.test(job.salary);
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
            <JobDetail job={job} locale={locale} />
        </div>
    );
}

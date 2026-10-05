import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/layout/PageHeader';
import {
    ArrowRight,
    Check,
    ChevronRight,
    ClipboardCheck,
    Euro,
    FileCheck,
    Home,
    MapPin,
    Briefcase,
} from 'lucide-react';
import { jobsByTrade, jobCopy, jobLocation, jobType, jobSalary } from '@/data/vacancies';
import { tradeCopy, tradeLinkLabel, type JobTradePage } from '@/data/vacancyTrades';
import { flagshipTrades } from '@/data/cityContent';

/**
 * Trade job landing page: /{locale}/vacatures/{slug}.
 *
 * Structure is deliberate: the search query, the day to day of the job, what
 * contractors expect, what we arrange, the live openings for that trade, then the
 * questions people actually ask before applying. The FAQ text is also emitted as
 * FAQPage structured data by the route.
 *
 * Content is per-locale (the Russian pages are a full translation, because most of
 * the people we recruit speak Russian) and the section headings come from the
 * VacancyUI namespace rather than being hardcoded here.
 */
export async function TradeJobsLanding({ trade, locale }: { trade: JobTradePage; locale: string }) {
    const t = await getTranslations({ locale, namespace: 'VacancyUI' });
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });

    const copy = tradeCopy(trade, locale);
    const role = tradeLinkLabel(trade, locale);
    const roleLower = role.toLocaleLowerCase(locale === 'ru' ? 'ru' : 'nl-BE');
    const openJobs = jobsByTrade(trade.jobTradeSlug);
    const hasServicePage = trade.serviceTradeSlug && flagshipTrades.includes(trade.serviceTradeSlug);
    const processSteps = t.raw('process_steps') as string[];

    return (
        <>
            <nav aria-label="Breadcrumb" className="container py-4 text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1.5">
                    <li>
                        <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
                            <Home className="w-3.5 h-3.5" />
                            {tNav('home')}
                        </Link>
                    </li>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                    <li>
                        <Link href="/vacatures" className="hover:text-primary">
                            {tNav('vacancies')}
                        </Link>
                    </li>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                    <li className="text-foreground font-medium">{role}</li>
                </ol>
            </nav>

            <PageHeader title={copy.h1} subtitle={t('trade_header_subtitle')} />

            <section className="py-12 bg-white">
                <div className="container max-w-4xl">
                    <div className="space-y-4 mb-12">
                        {copy.intro.map((paragraph, index) => (
                            <p key={index} className="text-neutral-600 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{t('what_you_do')}</h2>
                            <ul className="space-y-2 text-neutral-600">
                                {copy.tasks.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">{t('what_contractors_expect')}</h2>
                            <ul className="space-y-2 text-neutral-600">
                                {copy.requirements.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">{t('certificates_title')}</h2>
                        <ul className="space-y-2 text-neutral-600">
                            {copy.certificates.map((item, index) => (
                                <li key={index} className="flex gap-3">
                                    <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 md:p-8 border rounded-lg bg-neutral-50 mb-12">
                        <h2 className="text-2xl font-bold mb-4">{t('what_you_get')}</h2>
                        <ul className="space-y-3 text-neutral-700">
                            {copy.offer.map((item, index) => (
                                <li key={index} className="flex gap-3">
                                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap gap-3 mt-6">
                            <Button asChild size="lg">
                                <Link href={`/kandidaten?vak=${trade.jobTradeSlug}`}>
                                    {t('register_as', { role: roleLower })}
                                </Link>
                            </Button>
                            {hasServicePage && (
                                <Button asChild size="lg" variant="outline">
                                    <Link href={`/diensten/onderaannemer-${trade.serviceTradeSlug}`}>
                                        {locale === 'nl'
                                            ? trade.serviceLinkLabel ?? t('service_trade_link')
                                            : t('service_trade_link')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Live openings for this trade. When there is none, the page stays
                        useful instead of dead-ending — it routes to the registration. */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-2">
                            {t('open_vacancies_title', { role: roleLower })}
                        </h2>
                        {openJobs.length > 0 ? (
                            <>
                                <p className="text-neutral-600 mb-6">
                                    {openJobs.length === 1
                                        ? t('one_opening')
                                        : t('n_openings', { count: openJobs.length })}
                                </p>
                                <div className="grid grid-cols-1 gap-4">
                                    {openJobs.map((job) => {
                                        const jobText = jobCopy(job, locale);
                                        return (
                                            <div
                                                key={job.id}
                                                className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                                            >
                                                <div>
                                                    <h3 className="text-lg font-bold mb-1">{jobText.title}</h3>
                                                    <p className="text-neutral-600 mb-3 max-w-2xl text-sm">
                                                        {jobText.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            {jobLocation(job, locale)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="h-4 w-4" />
                                                            {jobType(job, locale)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Euro className="h-4 w-4" />
                                                            {jobSalary(job, locale)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button asChild>
                                                    <Link href={`/vacatures/${job.id}`}>{t('view_vacancy')}</Link>
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="border rounded-lg p-8 bg-neutral-50">
                                <p className="text-neutral-600 mb-4">{t('no_openings')}</p>
                                <Button asChild>
                                    <Link href={`/kandidaten?vak=${trade.jobTradeSlug}`}>
                                        {t('leave_details')}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">{t('faq_title', { role: roleLower })}</h2>
                        <div className="space-y-6">
                            {copy.faq.map((item, index) => (
                                <div key={index}>
                                    <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                                    <p className="text-neutral-600 leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Process: same on every trade page, because it is the same process. */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">{t('process_title')}</h2>
                        <ol className="space-y-4">
                            {processSteps.map((step, index) => (
                                <li key={index} className="flex gap-4">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
                                        {index + 1}
                                    </span>
                                    <span className="text-neutral-600 leading-relaxed pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="p-6 md:p-8 border-l-4 border-blue-600 rounded-lg bg-neutral-50">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-blue-600" />
                            {t('ready_title')}
                        </h2>
                        <p className="text-neutral-600 mb-4">{t('ready_text')}</p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg">
                                <Link href={`/kandidaten?vak=${trade.jobTradeSlug}`}>
                                    {t('register_candidate')}
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/vacatures">
                                    {t('all_vacancies')}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { ArrowLeft, MapPin, Clock, Euro, Home, ChevronRight, CalendarDays, Check, ArrowRight } from 'lucide-react';
import { jobCopy, jobLocation, jobType, jobSalary, type Job } from '@/data/vacancies';
import { getJobTradePageByJobTrade, tradeLinkLabel } from '@/data/vacancyTrades';
import { applyHref } from '@/lib/applyRoute';

/**
 * One vacancy, rendered in the reader's language.
 *
 * Kept as its own component because the route ([locale]/vacatures/[id]) serves both
 * vacancies and trade job landing pages; the route file resolves the URL and this
 * renders the vacancy case.
 */
export async function JobDetail({ job, locale }: { job: Job; locale: string }) {
    const t = await getTranslations({ locale, namespace: 'VacancyUI' });
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });
    const tVacancies = await getTranslations({ locale, namespace: 'VacanciesPage' });

    const copy = jobCopy(job, locale);
    const tradePage = getJobTradePageByJobTrade(job.tradeSlug);

    const publishedLabel = new Date(job.datePosted + 'T00:00:00Z').toLocaleDateString(
        locale === 'ru' ? 'ru-RU' : locale === 'fr' ? 'fr-BE' : 'nl-BE',
        { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
    );

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
                    <li className="text-foreground font-medium">{copy.title}</li>
                </ol>
            </nav>

            <section className="pb-12 bg-white">
                <div className="container max-w-4xl">
                    <Button asChild variant="ghost" className="mb-8">
                        <Link href="/vacatures" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('all_vacancies')}
                        </Link>
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <div className="space-y-4">
                                {copy.intro.map((paragraph, index) => (
                                    <p key={index} className="text-neutral-600 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {copy.tasks.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">{t('job_tasks')}</h2>
                                    <ul className="space-y-2 text-neutral-600">
                                        {copy.tasks.map((item, index) => (
                                            <li key={index} className="flex gap-3">
                                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {copy.requirements.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">{t('job_requirements')}</h2>
                                    <ul className="space-y-2 text-neutral-600">
                                        {copy.requirements.map((item, index) => (
                                            <li key={index} className="flex gap-3">
                                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {copy.offer.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">{t('job_offer')}</h2>
                                    <ul className="space-y-2 text-neutral-600">
                                        {copy.offer.map((item, index) => (
                                            <li key={index} className="flex gap-3">
                                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Contextual link up to the trade page: one page for the
                                trade, not one page per opening. */}
                            {tradePage && (
                                <div className="pt-2">
                                    <Link
                                        href={`/vacatures/${tradePage.slug}`}
                                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                                    >
                                        {t('more_jobs_for', {
                                            role: tradeLinkLabel(tradePage, locale).toLocaleLowerCase(
                                                locale === 'ru' ? 'ru' : 'nl-BE'
                                            ),
                                        })}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}

                            <div className="p-6 border rounded-lg bg-neutral-50">
                                <h2 className="text-xl font-bold mb-2">{t('apply_title')}</h2>
                                <p className="text-neutral-600 mb-4">{t('apply_text')}</p>
                                <div className="flex flex-wrap gap-3">
                                    <Button asChild size="lg">
                                        <Link href={applyHref(locale, { vacature: job.id })}>{tVacancies('apply')}</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/vacatures">{t('all_vacancies')}</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border rounded-lg bg-neutral-50 md:sticky md:top-24">
                                <h3 className="font-bold mb-4">{t('about_role')}</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <span>{jobLocation(job, locale)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <span>{jobType(job, locale)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <Euro className="h-5 w-5 text-primary" />
                                        <span>{jobSalary(job, locale)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                        <span>
                                            <span className="sr-only">{t('published_on')} </span>
                                            {publishedLabel}
                                        </span>
                                    </div>
                                </div>

                                <Button asChild className="w-full mt-6">
                                    <Link href={applyHref(locale, { vacature: job.id })}>{tVacancies('apply')}</Link>
                                </Button>

                                <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
                                    {t('company_note')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

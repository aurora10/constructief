import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { ArrowLeft, MapPin, Clock, Euro, Home, ChevronRight, CalendarDays, Check, ArrowRight } from 'lucide-react';
import type { Job } from '@/data/vacancies';
import { getJobTradePageByJobTrade } from '@/data/vacancyTrades';

/**
 * One vacancy, rendered. Kept as its own component because the route
 * ([locale]/vacatures/[id]) serves both vacancies and trade job landing pages;
 * the route file resolves the URL and this renders the vacancy case.
 */
export async function JobDetail({ job, locale }: { job: Job; locale: string }) {
    const t = await getTranslations({ locale, namespace: 'VacanciesPage' });
    const tradePage = getJobTradePageByJobTrade(job.tradeSlug);

    const publishedLabel = new Date(job.datePosted + 'T00:00:00Z').toLocaleDateString('nl-BE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });

    return (
        <>
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

                            {/* Contextual link up to the trade page: one page for the
                                trade, not one page per opening. */}
                            {tradePage && (
                                <div className="pt-2">
                                    <Link
                                        href={`/vacatures/${tradePage.slug}`}
                                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                                    >
                                        Meer vacatures en info voor {tradePage.linkLabel.toLowerCase()}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
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
        </>
    );
}

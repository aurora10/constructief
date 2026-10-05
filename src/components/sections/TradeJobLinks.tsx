import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { jobTradePages } from '@/data/vacancyTrades';
import { jobsByTrade } from '@/data/vacancies';

/**
 * Links the worker hub (/kandidaten) to the trade job pages, so the job cluster is
 * reachable from the page about working with us instead of only from /vacatures.
 *
 * Rendered for nl only: the vacancy copy is not translated yet and the fr/ru job
 * pages are noindexed, so pointing French or Russian visitors at Dutch job text
 * would only confuse them. Once the job copy is translated this can be enabled for
 * the other locales as well.
 */
export function TradeJobLinks({ locale }: { locale: string }) {
    if (locale !== 'nl') return null;

    return (
        <section className="py-16 bg-neutral-50 border-t">
            <div className="container">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
                    Vacatures per vakgebied
                </h2>
                <p className="mt-4 text-lg text-neutral-600 max-w-3xl">
                    Zoek je werk in een bepaald vak? Bekijk per vakgebied wat het werk inhoudt,
                    welke attesten gevraagd worden en welke opdrachten op dit moment openstaan.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobTradePages.map((trade) => {
                        const openCount = jobsByTrade(trade.jobTradeSlug).length;
                        return (
                            <Link
                                key={trade.slug}
                                href={`/vacatures/${trade.slug}`}
                                className="group flex items-center justify-between gap-3 border rounded-lg bg-white p-5 hover:shadow-md hover:border-primary transition-all"
                            >
                                <span>
                                    <span className="font-semibold block group-hover:text-primary">
                                        {trade.linkLabel}
                                    </span>
                                    <span className="text-sm text-neutral-500">
                                        {openCount > 0
                                            ? `${openCount} openstaande opdracht${openCount === 1 ? '' : 'en'}`
                                            : 'Doorlopend opdrachten in heel België'}
                                    </span>
                                </span>
                                <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary shrink-0" />
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-8">
                    <Link
                        href="/vacatures"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        Alle openstaande vacatures bekijken
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

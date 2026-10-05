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
import { jobsByTrade } from '@/data/vacancies';
import type { JobTradePage } from '@/data/vacancyTrades';
import { flagshipTrades } from '@/data/cityContent';

/**
 * Trade job landing page: /nl/vacatures/{slug}.
 *
 * Structure is deliberate: the search query ("vacature metselaar"), the day to day
 * of the job, what contractors expect, what we arrange, the live openings for that
 * trade, then the questions people actually ask before applying. The FAQ text is
 * also emitted as FAQPage structured data by the route.
 */
export function TradeJobsLanding({ trade }: { trade: JobTradePage }) {
    const openJobs = jobsByTrade(trade.jobTradeSlug);
    const hasServicePage = trade.serviceTradeSlug && flagshipTrades.includes(trade.serviceTradeSlug);

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
                            Vacatures
                        </Link>
                    </li>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                    <li className="text-foreground font-medium">{trade.linkLabel}</li>
                </ol>
            </nav>

            <PageHeader
                title={trade.h1}
                subtitle="Constructief werft vakmensen aan voor aannemers in heel België. Inschrijven is gratis, je krijgt één vast aanspreekpunt en we spreken loon en startdatum af vóór je begint."
            />

            <section className="py-12 bg-white">
                <div className="container max-w-4xl">
                    <div className="space-y-4 mb-12">
                        {trade.intro.map((paragraph, index) => (
                            <p key={index} className="text-neutral-600 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Wat doe je op de werf</h2>
                            <ul className="space-y-2 text-neutral-600">
                                {trade.tasks.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Wat aannemers verwachten</h2>
                            <ul className="space-y-2 text-neutral-600">
                                {trade.requirements.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Diploma&apos;s, attesten en documenten</h2>
                        <ul className="space-y-2 text-neutral-600">
                            {trade.certificates.map((item, index) => (
                                <li key={index} className="flex gap-3">
                                    <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 md:p-8 border rounded-lg bg-neutral-50 mb-12">
                        <h2 className="text-2xl font-bold mb-4">Wat je bij Constructief krijgt</h2>
                        <ul className="space-y-3 text-neutral-700">
                            {trade.offer.map((item, index) => (
                                <li key={index} className="flex gap-3">
                                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap gap-3 mt-6">
                            <Button asChild size="lg">
                                <Link href={`/kandidaten?vak=${trade.jobTradeSlug}`}>{`Gratis inschrijven als ${trade.linkLabel.toLowerCase()}`}</Link>
                            </Button>
                            {hasServicePage && (
                                <Button asChild size="lg" variant="outline">
                                    <Link href={`/diensten/onderaannemer-${trade.serviceTradeSlug}`}>
                                        {trade.serviceLinkLabel ?? 'Meer over dit vakgebied'}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Live openings for this trade. When there is none, the page stays
                        useful instead of dead-ending — it routes to the registration. */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-2">
                            {`Openstaande vacatures ${trade.linkLabel.toLowerCase()}`}
                        </h2>
                        {openJobs.length > 0 ? (
                            <>
                                <p className="text-neutral-600 mb-6">
                                    {openJobs.length === 1
                                        ? 'Op dit moment staat er één opdracht open voor deze functie.'
                                        : `Op dit moment staan er ${openJobs.length} opdrachten open voor deze functie.`}
                                </p>
                                <div className="grid grid-cols-1 gap-4">
                                    {openJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                                        >
                                            <div>
                                                <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                                                <p className="text-neutral-600 mb-3 max-w-2xl text-sm">
                                                    {job.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="h-4 w-4" />
                                                        {job.type}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Euro className="h-4 w-4" />
                                                        {job.salary}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button asChild>
                                                <Link href={`/vacatures/${job.id}`}>Bekijk vacature</Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="border rounded-lg p-8 bg-neutral-50">
                                <p className="text-neutral-600 mb-4">
                                    Er staat vandaag geen opdracht voor deze functie open, maar wij
                                    plaatsen doorlopend voor aannemers in heel België. Schrijf je in,
                                    dan nemen we contact op zodra er een werf bij je profiel past.
                                </p>
                                <Button asChild>
                                    <Link href={`/kandidaten?vak=${trade.jobTradeSlug}`}>Gegevens achterlaten</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">
                            {`Veelgestelde vragen over het beroep ${trade.linkLabel.toLowerCase()}`}
                        </h2>
                        <div className="space-y-6">
                            {trade.faq.map((item, index) => (
                                <div key={index}>
                                    <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                                    <p className="text-neutral-600 leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Process: same on every trade page, because it is the same process. */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Zo verloopt je inschrijving</h2>
                        <ol className="space-y-4">
                            {[
                                'Je vult het kandidaatformulier in: ervaring, attesten, regio en beschikbaarheid. Gratis, zonder account.',
                                'Wij bellen je voor een korte screening en overlopen wat je zoekt en welke documenten je hebt.',
                                'We stellen je voor aan een aannemer die past — niet aan tien partijen tegelijk.',
                                'Loon, uren en startdatum worden afgesproken vóór je eerste werkdag.',
                                'Documenten zoals A1, Limosa en Checkinatwork regelen we vooraf, zodat je kan starten.',
                            ].map((step, index) => (
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
                            Klaar om te solliciteren?
                        </h2>
                        <p className="text-neutral-600 mb-4">
                            Laat je gegevens achter via het kandidaatformulier. Wij nemen contact op zodra
                            we je profiel bekeken hebben — meestal binnen twee werkdagen.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg">
                                <Link href={`/kandidaten?vak=${trade.jobTradeSlug}`}>Inschrijven als kandidaat</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/vacatures">
                                    Alle vacatures
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

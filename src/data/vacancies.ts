import type { JobCopy } from './vacancyTypes';
import { jobRu } from './vacancies.ru';

/**
 * Vacancy data — Dutch source text.
 *
 * Two audiences, two languages (see jobCopy() below):
 *  - nl: people searching "vacature metselaar" in Belgium and the Netherlands.
 *  - ru: the crews we recruit in Eastern Europe. Most of them speak Russian, so
 *    the Russian copy in vacancies.ru.ts is the recruiting side of this cluster
 *    and those pages are indexed (see src/app/[locale]/vacatures/[id]/page.tsx).
 *  - fr: no vacancy audience; falls back to Dutch and stays noindexed.
 *
 * `tradeSlug` groups vacancies by trade — used by the trade job landing pages.
 */
export interface Job {
    id: number;
    title: string;
    /** Groups vacancies per trade (matches the trade keys used on the trade pages). */
    tradeSlug: string;
    location: string;
    type: string;
    salary: string;
    /** Short summary: list card + meta description. */
    description: string;
    /** Full opening paragraphs (why this role, what the project looks like). */
    intro: string[];
    /** Wat ga je doen */
    tasks: string[];
    /** Wie zoeken wij */
    requirements: string[];
    /** Wat bieden wij — only claims that hold for every placement. */
    offer: string[];
    /** ISO 8601 (YYYY-MM-DD) publication date — required by JobPosting. */
    datePosted: string;
}

export const jobs: Job[] = [
    {
        id: 1,
        tradeSlug: 'werfleider',
        datePosted: '2026-08-06',
        title: 'Projectleider Bouw',
        location: 'Antwerpen',
        type: 'Fulltime',
        salary: '€ 4.000 - € 5.500 per maand',
        description:
            'Ervaren projectleider voor grote utiliteitsbouwprojecten in de regio Antwerpen. Je leidt meerdere werven van voorbereiding tot oplevering.',
        intro: [
            'Voor een vaste opdrachtgever in de regio Antwerpen zoeken wij een projectleider voor grote utiliteitsbouwprojecten: kantoren, zorggebouwen en logistieke sites. Je bent de schakel tussen bouwheer, architect, studiebureau en de ploegen op de werf.',
            'Je krijgt meerdere werven onder je hoede, van de voorbereidingsfase tot de oplevering. Wie graag structuur brengt in complexe projecten en zelfstandig beslissingen neemt, zit hier op zijn plaats.',
        ],
        tasks: [
            'Leiding over meerdere bouwwerven, van voorbereiding tot oplevering',
            'Opvolging van planning, budget en kwaliteit',
            'Coördinatie van onderaannemers en leveranciers',
            'Overleg met bouwheer, architect en studiebureau',
            'Opvolging van veiligheid en werfadministratie',
        ],
        requirements: [
            'Bachelor of master in de bouwkunde',
            'Minimaal 5 jaar ervaring in een soortgelijke functie',
            'Uitstekende organisatorische en communicatieve vaardigheden',
            'Vloeiend Nederlands',
        ],
        offer: [
            'Duidelijke afspraken over loon, uren en startdatum vóór je begint',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
            'Werk in je eigen regio, geen onnodige verplaatsingen',
            'Alle documenten en administratie worden vooraf in orde gebracht',
        ],
    },
    {
        id: 2,
        tradeSlug: 'werfleider',
        datePosted: '2026-08-08',
        title: 'Werfleider',
        location: 'Gent',
        type: 'Fulltime',
        salary: '€ 3.500 - € 4.500 per maand',
        description:
            'Werfleider voor nieuwbouw- en renovatieprojecten in Gent en omgeving. Je stuurt de ploegen aan en bewaakt planning en kwaliteit.',
        intro: [
            'In Gent en de ruime omgeving zoeken wij een werfleider voor nieuwbouw- en renovatieprojecten. Je staat dagelijks tussen de ploegen en zorgt dat het werk vlot, veilig en volgens plan verloopt.',
            'Je bent het eerste aanspreekpunt op de werf: je stuurt bij waar nodig, meldt problemen tijdig en houdt de werfadministratie bij.',
        ],
        tasks: [
            'Dagelijkse aansturing van de ploegen op de werf',
            'Opvolging van planning en dagelijkse voortgang',
            'Bewaking van kwaliteit en veiligheid',
            'Korte lijnen met de projectleider en de bouwheer',
            'Opvolging van leveringen en materieel',
        ],
        requirements: [
            'Ervaring als werfleider in de bouw',
            'Leidinggevende capaciteiten',
            'Kennis van veiligheidsvoorschriften',
        ],
        offer: [
            'Duidelijke afspraken over loon, uren en startdatum vóór je begint',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
            'Werk in je eigen regio, geen onnodige verplaatsingen',
            'Alle documenten en administratie worden vooraf in orde gebracht',
        ],
    },
    {
        id: 3,
        tradeSlug: 'bekister',
        datePosted: '2026-08-10',
        title: 'Bekister',
        location: 'Brussel',
        type: 'Interim',
        salary: '€ 17 - € 19 per uur',
        description:
            'Bekister voor diverse betonprojecten in Brussel. Ervaring met traditionele bekisting is vereist; systeembekisting is een pluspunt.',
        intro: [
            'Voor betonprojecten in Brussel zoeken wij ervaren bekisters. Je werkt met traditionele en systeembekisting op uiteenlopende werven, van funderingen tot wanden en kolommen.',
            'Je leest plannen zelfstandig, werkt nauwkeurig en houdt de bekisting maatvast. Ervaring met verschillende systemen is een voordeel, geen must.',
        ],
        tasks: [
            'Plaatsen, stellen en ontkisten van bekisting',
            'Bekisting maatvast opbouwen volgens plan',
            'Samenwerken met de ijzervlechters en de betonploeg',
            'Materieel netjes en veilig gebruiken',
        ],
        requirements: [
            'Ervaring met traditionele en systeembekisting',
            'Plannen kunnen lezen',
            'Nauwkeurig werken',
        ],
        offer: [
            'Correcte, transparante betaling volgens afspraak',
            'Voor buitenlandse kandidaten: A1, Limosa en werfregistratie worden vooraf geregeld',
            'Begeleiding bij verblijf dicht bij de werf',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
        ],
    },
    {
        id: 4,
        tradeSlug: 'kraanmachinist',
        datePosted: '2026-08-11',
        title: 'Kraanmachinist',
        location: 'Limburg',
        type: 'Fulltime',
        salary: '€ 18 - € 20 per uur',
        description:
            'Torenkraanmachinist met geldig attest voor projecten in Limburg. Veilig en nauwkeurig werken staat voorop.',
        intro: [
            'In Limburg zoeken wij een torenkraanmachinist met een geldig attest. Je bedient de kraan op grotere bouwwerven en werkt nauw samen met de ploegen op de grond.',
            'Veiligheid en overzicht zijn belangrijker dan snelheid: je werkt volgens de hijsplannen en houdt rekening met de hele werf.',
        ],
        tasks: [
            'Bedienen van de torenkraan volgens hijsplan',
            'Op- en afbouw van de kraan mee opvolgen',
            'Dagelijkse controle van de kraan en de veiligheidssystemen',
            'Afstemming met de ploegbaas en de ploegen op de grond',
        ],
        requirements: [
            'Geldig attest torenkraan',
            'Ervaring is een pluspunt',
            'Veiligheidsbewust',
        ],
        offer: [
            'Correcte, transparante betaling volgens afspraak',
            'Voor buitenlandse kandidaten: A1, Limosa en werfregistratie worden vooraf geregeld',
            'Begeleiding bij verblijf dicht bij de werf',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
        ],
    },
    {
        id: 5,
        tradeSlug: 'metser',
        datePosted: '2026-08-12',
        title: 'Metser',
        location: 'West-Vlaanderen',
        type: 'Fulltime',
        salary: '€ 16 - € 18 per uur',
        description:
            'Metselaar voor nieuwbouw en renovatie in West-Vlaanderen. Zelfstandig werken en oog voor kwaliteit.',
        intro: [
            'In West-Vlaanderen zoeken wij metselaars voor nieuwbouw- en renovatiewerven. Je werkt in een ploeg, maar kunt ook zelfstandig een deel van het werk opnemen.',
            'Kwaliteit van het metselwerk en netjes werken zijn belangrijker dan tempo: het resultaat moet in het zicht blijven.',
        ],
        tasks: [
            'Metselwerk uitvoeren in nieuwbouw en renovatie',
            'Voegen en afwerken van metselwerk',
            'Werken volgens plan en op aanwijzing van de ploegbaas',
            'Werf netjes en veilig achterlaten',
        ],
        requirements: [
            'Ervaring met metselwerk',
            'Zelfstandig kunnen werken',
            'Fysiek in orde',
        ],
        offer: [
            'Correcte, transparante betaling volgens afspraak',
            'Voor buitenlandse kandidaten: A1, Limosa en werfregistratie worden vooraf geregeld',
            'Begeleiding bij verblijf dicht bij de werf',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
        ],
    },
    {
        id: 6,
        tradeSlug: 'elektricien_ind',
        datePosted: '2026-08-13',
        title: 'Elektricien',
        location: 'Antwerpen',
        type: 'Fulltime',
        salary: '€ 17 - € 19 per uur',
        description:
            'Industrieel elektricien voor onderhoudswerken in de Antwerpse havenregio. Kennis van PLC is een plus.',
        intro: [
            'In de Antwerpse havenregio zoeken wij een industrieel elektricien voor onderhoudswerken. Je werkt aan installaties waar stilstand geld kost, dus je werkt gestructureerd en denkt vooruit.',
            'Je zoekt storingen, herstelt ze en zorgt dat de installatie veilig opnieuw in dienst kan. Kennis van PLC is een plus, geen voorwaarde.',
        ],
        tasks: [
            'Preventief en correctief onderhoud van industriële installaties',
            'Opsporen en verhelpen van storingen',
            'Aansluiten en controleren van schakelkasten',
            'Veilig vrijschakelen en documenteren van interventies',
        ],
        requirements: [
            'Diploma elektriciteit',
            'Ervaring in de industrie',
            'Kennis van PLC is een plus',
        ],
        offer: [
            'Correcte, transparante betaling volgens afspraak',
            'Voor buitenlandse kandidaten: A1, Limosa en werfregistratie worden vooraf geregeld',
            'Begeleiding bij verblijf dicht bij de werf',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
        ],
    },
];

/** Jobs for one trade (used by trade-based job landing pages). */
export function jobsByTrade(tradeSlug: string): Job[] {
    return jobs.filter((job) => job.tradeSlug === tradeSlug);
}

/**
 * Language policy for this cluster: nl for the Belgian/Dutch market, ru for the
 * crews we recruit in Eastern Europe (the large majority speak Russian — see
 * vacancies.ru.ts). fr has no vacancy audience, so it falls back to the Dutch copy
 * and its pages stay noindexed.
 */
export function isRussian(locale: string): boolean {
    return locale === 'ru';
}

/** The vacancy text in the reader's language (falls back to Dutch). */
export function jobCopy(job: Job, locale: string): JobCopy {
    const ru = jobRu[job.id];
    if (isRussian(locale) && ru) {
        return {
            title: ru.title,
            description: ru.description,
            intro: ru.intro,
            tasks: ru.tasks,
            requirements: ru.requirements,
            offer: ru.offer,
        };
    }
    return {
        title: job.title,
        description: job.description,
        intro: job.intro,
        tasks: job.tasks,
        requirements: job.requirements,
        offer: job.offer,
    };
}

/** Place name for display. JSON-LD keeps the Dutch form (job.location). */
export function jobLocation(job: Job, locale: string): string {
    const ru = jobRu[job.id];
    return isRussian(locale) && ru ? ru.location : job.location;
}

export function jobType(job: Job, locale: string): string {
    const ru = jobRu[job.id];
    return isRussian(locale) && ru ? ru.type : job.type;
}

export function jobSalary(job: Job, locale: string): string {
    const ru = jobRu[job.id];
    return isRussian(locale) && ru ? ru.salary : job.salary;
}

/**
 * Display name per trade slug, so the listing filter reads naturally in all three
 * locales even though the vacancy copy itself is still Dutch-only.
 */
export const tradeLabels: Record<string, { nl: string; fr: string; ru: string }> = {
    werfleider: { nl: 'Werfleiding & projectleiding', fr: 'Conduite de chantier', ru: 'Прораб' },
    bekister: { nl: 'Bekister', fr: 'Coffreur', ru: 'Опалубщик' },
    kraanmachinist: { nl: 'Kraanmachinist', fr: 'Grutier', ru: 'Машинист башенного крана' },
    metser: { nl: 'Metselaar', fr: 'Maçon', ru: 'Каменщик' },
    elektricien_ind: { nl: 'Industrieel elektricien', fr: 'Électricien industriel', ru: 'Промышленный электрик' },
};

export function tradeLabel(tradeSlug: string, locale: string): string {
    const labels = tradeLabels[tradeSlug];
    if (!labels) return tradeSlug;
    return labels[locale as keyof typeof labels] ?? labels.nl;
}

/**
 * Bridges a vacancy's tradeSlug to the exact option label used by the trade
 * checkboxes in CandidateForm. When someone applies from a vacancy or trade page
 * we preselect this option for them, so the trade is never left blank and the
 * candidate does not have to hunt through five collapsed clusters.
 */
export const candidateFormTrade: Record<string, string> = {
    werfleider: 'Werfleider',
    bekister: 'Bekister',
    kraanmachinist: 'Kraanmachinist (Torenkraan)',
    metser: 'Metser',
    elektricien_ind: 'Elektricien (Industrieel)',
};

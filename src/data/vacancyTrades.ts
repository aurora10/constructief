import type { JobTradeCopy, JobTradeFaq } from './vacancyTypes';
import { jobTradeRu } from './vacancyTrades.ru';
import { BRAND } from '@/lib/brand';

/** The trade page content in the reader's language (ru translated, fr falls back to nl). */
export function tradeCopy(trade: JobTradePage, locale: string): JobTradeCopy {
    const ru = jobTradeRu[trade.slug];
    if (locale === 'ru' && ru) {
        return {
            h1: ru.h1,
            metaTitle: ru.metaTitle,
            metaDescription: ru.metaDescription,
            intro: ru.intro,
            tasks: ru.tasks,
            requirements: ru.requirements,
            certificates: ru.certificates,
            offer: ru.offer,
            faq: ru.faq,
        };
    }
    return {
        h1: trade.h1,
        metaTitle: trade.metaTitle,
        metaDescription: trade.metaDescription,
        intro: trade.intro,
        tasks: trade.tasks,
        requirements: trade.requirements,
        certificates: trade.certificates,
        offer: trade.offer,
        faq: trade.faq,
    };
}

/** Short trade name for headings and links, in the reader's language. */
export function tradeLinkLabel(trade: JobTradePage, locale: string): string {
    const ru = jobTradeRu[trade.slug];
    return locale === 'ru' && ru ? ru.linkLabel : trade.linkLabel;
}

/**
 * Trade job landing pages: /nl/vacatures/{slug}
 *
 * Why these exist: the site's own Search Console data shows the B2B queries
 * ("detachering bouwpersoneel") have almost no volume, while job-seeker queries
 * carry the real demand at poor positions. These pages target those queries with
 * one page per trade instead of one page per opening.
 *
 * Language: the Dutch text below is the source for the nl market. The Russian
 * version in vacancyTrades.ru.ts serves the crews we recruit in Eastern Europe —
 * most of them speak Russian — and is the indexed version for /ru.
 *
 * Rules followed here:
 *  - The slug is the word people actually search ("metselaar"), while
 *    `jobTradeSlug` links it to the vacancies in src/data/vacancies.ts.
 *  - No wage figures are invented. We do not quote Belgian wage scales: the crew
 *    agrees its rate with the contractor before the start, and our invoice follows
 *    only after the 14-day trial has been passed. The FAQ says exactly that.
 *  - Every trade page keeps working when it has no open vacancy: the live list
 *    falls back to the registration call to action.
 */

export type { JobTradeFaq, JobTradeCopy };

export interface JobTradePage {
    /** URL segment under /vacatures. */
    slug: string;
    /** Matches Job.tradeSlug so we can list the real openings for this trade. */
    jobTradeSlug: string;
    /** Short label for internal links. */
    linkLabel: string;
    h1: string;
    metaTitle: string;
    metaDescription: string;
    /** Lead paragraphs. */
    intro: string[];
    /** Wat doe je als ... */
    tasks: string[];
    /** Wat verwachten aannemers */
    requirements: string[];
    /** Diploma's, attesten en documenten — kept apart because it drives the FAQ. */
    certificates: string[];
    /** Wat krijg je via Constructief */
    offer: string[];
    faq: JobTradeFaq[];
    /** Matching B2B page on /diensten (flagship trade slug), when one exists. */
    serviceTradeSlug?: string;
    serviceLinkLabel?: string;
}

export const jobTradePages: JobTradePage[] = [
    {
        slug: 'metselaar',
        jobTradeSlug: 'metser',
        linkLabel: 'Metselaar / metser',
        h1: 'Vacatures metselaar in België',
        metaTitle: `Vacatures metselaar in België | ${BRAND.name}`,
        metaDescription:
            'Vacatures voor metselaars en metsers in heel België. Wij plaatsen je bij aannemers, spreken loon en startdatum vooraf af en regelen A1, Limosa en Checkinatwork.',
        intro: [
            'Constructief plaatst metselaars en metsers bij aannemers in heel België: ruwbouw, nieuwbouw, renovatie en gevelwerk. Je komt terecht in een bestaande ploeg of als versterking van een ploeg die wij zelf samenstellen.',
            'Metselaar of metser — in Vlaanderen zegt men vaker metser, in Nederland metselaar. Het werk is hetzelfde. Wij zoeken mensen die zelfstandig kunnen doorwerken, plan kunnen lezen en kwaliteit leveren die in het zicht blijft.',
        ],
        tasks: [
            'Metselwerk uitvoeren in snelbouw, lijmblokken en gevelsteen',
            'Voegen, afwerken en bijwerken van metselwerk',
            'Werken volgens plan en volgens de aanwijzingen van de ploegbaas',
            'Werkvoorbereiding: stellingen, materiaal en hulpmiddelen klaarzetten',
            'Werf netjes en veilig achterlaten, ook voor de volgende ploeg',
        ],
        requirements: [
            'Ervaring met metselwerk op bouwwerven (nieuwbouw of renovatie)',
            'Zelfstandig kunnen werken, ook zonder constante aansturing',
            'Fysiek in orde — metselen is een fysiek vak, in weer en wind',
            'Bereid om in ploeg te werken en de planning van de werf te volgen',
        ],
        certificates: [
            'VCA wordt op de meeste Belgische werven gevraagd, meestal als eis van de hoofdaannemer; heb je het niet, dan zeggen we welke opleiding je nodig hebt',
            'Een attest voor werken op hoogte is een pluspunt, geen must',
            'Eigen basisgereedschap is handig, groot materieel komt van de werf',
        ],
        offer: [
            'Duidelijke afspraken over brutoloon, uren en startdatum vóór je begint',
            'Je tarief spreek je af met de aannemer vóór de start — geen verrassingen achteraf',
            'Eén vast aanspreekpunt dat je dossier opvolgt, ook als je al aan het werk bent',
            'Voor buitenlandse vakmensen: A1, Limosa en werfregistratie (Checkinatwork) worden vooraf geregeld',
            'Hulp bij het vinden van onderdak dicht bij de werf',
        ],
        faq: [
            {
                q: 'Wat verdient een metselaar in België?',
                a: 'Je werkt als zelfstandige of met je eigen ploeg en spreekt het tarief rechtstreeks met de aannemer af. Wat jij en je mensen daaraan verdienen, is jullie afspraak: wij stellen geen tarief vast en nemen geen percentage van je tarief. Onze vergoeding is een vindersloon dat de aannemer betaalt. De afspraken leggen we schriftelijk vast vóór de start.'
            },
            {
                q: 'Wat is het verschil tussen metselaar en metser?',
                a: 'Geen verschil in werk: "metser" is de Vlaamse benaming, "metselaar" de Nederlandse. In vacatures zie je beide door elkaar staan. Wij plaatsen je voor hetzelfde beroep, of je nu metser of metselaar genoemd wordt.',
            },
            {
                q: 'Heb ik een VCA-attest nodig om te metselen in België?',
                a: 'Op de meeste Belgische werven wordt een VCA-attest (basisveiligheid) gevraagd, en vaak ook een werfgebonden veiligheidsinstructie. Heb je nog geen VCA, dan laten we je weten welke opleiding nodig is en hoe lang die duurt; wij laten kandidaten daar niet op vastlopen als de rest van het profiel klopt.',
            },
            {
                q: 'Kan ik als buitenlandse metselaar in België werken?',
                a: 'Ja, als je de juiste documenten hebt. Werk je in België voor een buitenlandse werkgever of als zelfstandige, dan zijn een A1-verklaring (sociale zekerheid in je thuisland), een Limosa-melding en de registratie in Checkinatwork op de werf verplicht. Wij regelen die drie zaken vóór je start, zodat je niet aan de poort wordt teruggestuurd.',
            },
            {
                q: 'Is er ook werk als metselaar in de winter?',
                a: 'Buitenwerk vertraagt in de winter. Dat is een realiteit in de sector. Waar het kan plannen we renovatiewerk of binnenafwerking, of we spreken een latere startdatum af. We beloven geen werk dat er niet is: we zeggen vooraf welke periode de opdracht dekt.',
            },
        ],
        serviceTradeSlug: 'ruwbouw',
        serviceLinkLabel: 'Ruwbouw en metselwerk voor aannemers',
    },
    {
        slug: 'bekister',
        jobTradeSlug: 'bekister',
        linkLabel: 'Bekister',
        h1: 'Vacatures bekister in België',
        metaTitle: `Vacatures bekister (bekisting) in België | ${BRAND.name}`,
        metaDescription:
            'Vacatures voor bekisters in België: systeembekisting en traditionele bekisting op betonwerven. Wij plaatsen je bij aannemers en regelen documenten, loon en verblijf vooraf.',
        intro: [
            'Wij plaatsen bekisters op betonwerven in heel België: funderingen, wanden, kolommen, vloerplaten en tunnels. Je werkt met systeembekisting of traditionele bekisting, altijd samen met de ijzervlechters en de betonploeg.',
            'Bekisten is maatwerk: een paar millimeter afwijking plant zich door in de hele constructie. Daarom zoeken wij mensen die plannen kunnen lezen, maatvast stellen en niet verder werken op een fout.',
        ],
        tasks: [
            'Plaatsen, stellen en ontkisten van bekisting (systeem en traditioneel)',
            'Bekisting maatvast opbouwen volgens plan en wapeningstekening',
            'Samenwerken met ijzervlechters en de betonploeg',
            'Materieel en bekistingsdelen netjes en veilig gebruiken',
            'Controleren van de bekisting voor het betonstorten',
        ],
        requirements: [
            'Ervaring met traditionele en/of systeembekisting op betonwerven',
            'Plan kunnen lezen en maten kunnen overzetten',
            'Nauwkeurig werken en oog hebben voor detail',
            'Bereid om in ploeg te werken met vaste werkvolgorde',
        ],
        certificates: [
            'VCA wordt op betonwerven bijna altijd gevraagd, meestal als eis van de hoofdaannemer',
            'Attest werken op hoogte is een pluspunt bij wanden en kolommen',
            'Ervaring met systemen zoals Doka, Peri of Meva is een voordeel, geen voorwaarde',
        ],
        offer: [
            'Duidelijke afspraken over brutoloon, uren en startdatum vóór je begint',
            'Correcte, transparante betaling volgens afspraak, met loonfiches',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
            'Voor buitenlandse bekisters: A1, Limosa en werfregistratie worden vooraf geregeld',
            'Hulp bij het vinden van onderdak dicht bij de werf',
        ],
        faq: [
            {
                q: 'Wat verdient een bekister in België?',
                a: 'Je werkt met je ploeg of als zelfstandige en spreekt het tarief rechtstreeks met de aannemer af. Wij stellen geen tarief vast en nemen er geen percentage van: onze vergoeding is een vindersloon, betaald door de aannemer. Tarief en uren spreken jullie zelf af; wij leggen de afspraken schriftelijk vast voor de start.'
            },
            {
                q: 'Moet ik met systeembekisting kunnen werken?',
                a: 'Het is een pluspunt, geen voorwaarde. Ervaring met traditionele bekisting volstaat als je plan kunt lezen en maatvast kunt stellen; de specifieke systemen (Doka, Peri, Meva, Ischebeck) leer je op de werf zelf. Zeg bij je inschrijving eerlijk met welke systemen je al werkte, dan koppelen we je aan de juiste werf.',
            },
            {
                q: 'Kan ik als buitenlandse bekister in België werken?',
                a: 'Ja. Voor werk in België heb je een A1-verklaring nodig (als je onder de sociale zekerheid van je thuisland blijft), een Limosa-melding en, op de werf zelf, de registratie in Checkinatwork. Wij regelen die documenten vóór je eerste werkdag en bezorgen je de bevestigingen.',
            },
            {
                q: 'Hoe snel kan ik beginnen als bekister?',
                a: 'Eerst een korte screening: je ervaring, welke systemen je kent, je beschikbaarheid en je documenten. Daarna stellen we je voor aan een aannemer die past, meestal binnen enkele dagen. De startdatum hangt af van de werfplanning en van hoe snel de documenten in orde zijn.',
            },
        ],
        serviceTradeSlug: 'beton',
        serviceLinkLabel: 'Betonwerk en bekisting voor aannemers',
    },
    {
        slug: 'kraanmachinist',
        jobTradeSlug: 'kraanmachinist',
        linkLabel: 'Kraanmachinist',
        h1: 'Vacatures kraanmachinist (torenkraan) in België',
        metaTitle: `Vacatures kraanmachinist torenkraan België | ${BRAND.name}`,
        metaDescription:
            'Vacatures voor torenkraanmachinisten in België. Geldig attest vereist. Wij plaatsen je bij aannemers op grote werven en regelen loon, documenten en verblijf vooraf.',
        intro: [
            'Wij zoeken torenkraanmachinisten voor grotere bouwwerven in België: appartementsbouw, utiliteitsbouw en logistieke sites waar de kraan de hele dag draait en de ploegen op haar rekenen.',
            'Op zo\'n werf ben je de ogen van boven. Veiligheid en overzicht gaan voor snelheid: je werkt volgens het hijsplan, je communiceert met de ploeg op de grond en je stopt liever even dan dat je een risico neemt.',
        ],
        tasks: [
            'Bedienen van de torenkraan volgens hijsplan en werfafspraken',
            'Op- en afbouw van de kraan mee opvolgen, samen met de kraanmonteur',
            'Dagelijkse controle van de kraan en de veiligheidssystemen',
            'Afstemming met de ploegbaas, de signaalgever en de ploegen op de grond',
            'Lasten correct aanslaan en controleren voor het hijsen',
        ],
        requirements: [
            'Geldig attest voor het bedienen van een torenkraan',
            'Ervaring op bouwwerven met wisselende lasten en beperkte ruimte',
            'Medisch geschikt en geen hoogtevrees',
            'Nauwkeurig en veiligheidsbewust werken, ook onder tijdsdruk',
        ],
        certificates: [
            'Attest torenkraan is verplicht — zonder geldig attest kun je wettelijk niet bedienen. De aannemer controleert dat attest; wij controleren of beoordelen geen certificaten',
            'VCA wordt op de werven gevraagd, vaak als eis van de hoofdaannemer',
            'Attest voor het aanslaan van lasten (hijstechnieken) is een pluspunt',
        ],
        offer: [
            'Duidelijke afspraken over brutoloon, uren en startdatum vóór je begint',
            'Je tarief spreek je vóór de start af met de aannemer',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
            'Voor buitenlandse machinisten: A1, Limosa en werfregistratie worden vooraf geregeld',
            'Hulp bij het vinden van onderdak dicht bij de werf',
        ],
        faq: [
            {
                q: 'Welk attest heb ik nodig om een torenkraan te bedienen in België?',
                a: 'Je hebt een geldig attest van vakbekwaamheid voor het bedienen van een torenkraan nodig. Zonder dat attest mag je wettelijk niet op een werf bedienen, ook niet met jarenlange ervaring. Stuur bij je inschrijving een foto of scan mee van je attest en van de geldigheidsdatum, dan controleren wij of het in België aanvaard wordt.',
            },
            {
                q: 'Wat verdient een kraanmachinist in België?',
                a: 'Je factureert de aannemer als zelfstandige of met je ploeg; het tarief is jullie afspraak. Wij stellen het niet vast en nemen er geen percentage van — onze vergoeding is een vindersloon van de aannemer. De lonen binnen je ploeg bepaal je zelf.'
            },
            {
                q: 'Werken kraanmachinisten in ploegen?',
                a: 'Op grote werven wordt vaak in twee ploegen gewerkt, zeker wanneer de kraan de bottleneck is. Dat betekent vroege of late uren, met ploegenpremie. We zeggen bij de vacature welke shiftregeling geldt, zodat je niet voor verrassingen komt te staan.',
            },
            {
                q: 'Ik heb ervaring met een mobiele kraan of verreiker — kom ik in aanmerking?',
                a: 'Ervaring met hijswerktuigen helpt, maar voor een torenkraan op een Belgische werf blijft het attest torenkraan de voorwaarde. Werk je met een mobiele kraan (met attest), dan zijn er ook opdrachten waarbij je op de grond aanslaat en de mobiele kraan bedient. Zeg bij je inschrijving precies welke attesten je hebt.',
            },
        ],
        serviceTradeSlug: 'beton',
        serviceLinkLabel: 'Betonwerk en kraanwerk voor aannemers',
    },
    {
        slug: 'werfleider',
        jobTradeSlug: 'werfleider',
        linkLabel: 'Werfleider / uitvoerder',
        h1: 'Vacatures werfleider en uitvoerder in België',
        metaTitle: `Vacatures werfleider & uitvoerder België | ${BRAND.name}`,
        metaDescription:
            'Vacatures voor werfleiders, uitvoerders en projectleiders in de bouw in België. Nieuwbouw, renovatie en utiliteitsbouw. Wij zoeken de werf die bij je past en regelen loon en administratie.',
        intro: [
            'Wij plaatsen werfleiders, uitvoerders en projectleiders bij aannemers in België: nieuwbouw, renovatie en utiliteitsbouw. Het gaat om functies waar je de ploegen aanstuurt en de werf dagelijks opvolgt, met korte lijnen naar de projectleider en de bouwheer.',
            'In Vlaanderen spreekt men van werfleider, in Nederland van uitvoerder, bij grotere projecten van projectleider. De kern is hetzelfde: je zorgt dat het werk vlot, veilig en volgens plan verloopt en dat problemen gemeld worden vóór ze geld kosten.',
        ],
        tasks: [
            'Dagelijkse aansturing van de ploegen en van onderaannemers op de werf',
            'Opvolging van planning, voortgang, budget en kwaliteit',
            'Bewaking van veiligheid en van de werfadministratie',
            'Overleg met bouwheer, architect, studiebureau en leveranciers',
            'Opvolging van leveringen, materieel en keuringen',
        ],
        requirements: [
            'Ervaring als werfleider, uitvoerder of in een vergelijkbare rol in de bouw',
            'Bachelor of master bouwkunde, of gelijkwaardig door ervaring',
            'Leidinggevende capaciteiten en goede communicatieve vaardigheden',
            'Vloeiend Nederlands; Frans is een pluspunt op werven in Brussel en Wallonië',
            'Plan kunnen lezen; kennis van planningssoftware is een voordeel',
        ],
        certificates: [
            'VCA of een gelijkwaardige veiligheidsopleiding; op grotere werven wordt dit standaard gevraagd',
            'Diploma bouwkunde of bouwtechnische opleiding, of aantoonbare ervaring',
            'Rijbewijs B is nodig: je verplaatst je tussen werven',
        ],
        offer: [
            'Duidelijke afspraken over brutoloon, uren, wagen en startdatum vóór je begint',
            'Functies met verantwoordelijkheid; je tarief spreek je vóór de start af',
            'Eén vast aanspreekpunt dat je dossier opvolgt, ook na je start',
            'Sollicitatie verloopt vertrouwelijk: je huidige werkgever hoort niets voor je ja zegt',
            'Voor buitenlandse kandidaten: A1, Limosa en werfregistratie worden vooraf geregeld',
        ],
        faq: [
            {
                q: 'Wat verdient een werfleider in België?',
                a: 'Je werkt als zelfstandige of met je ploeg en spreekt het tarief rechtstreeks met de aannemer af. Wij stellen geen tarief vast en nemen geen percentage — de aannemer betaalt ons een vindersloon. De voorwaarden noteren we vóór de ondertekening.'
            },
            {
                q: 'Wat is het verschil tussen werfleider, uitvoerder en projectleider?',
                a: 'De uitvoerder of werfleider staat dagelijks op de werf en stuurt de ploegen aan. De projectleider volgt meerdere werven op, van voorbereiding tot oplevering, en zit meer op planning en budget. In kleinere bedrijven doet één persoon beide. Zeg bij je inschrijving welke rol je zoekt, dan zoeken we daarop verder.',
            },
            {
                q: 'Verloopt een sollicitatie vertrouwelijk?',
                a: 'Ja. Je cv gaat niet naar je huidige werkgever en wij bellen je niet op de werf. We bespreken eerst met jou welke aannemers interessant zijn en pas daarna gaat je profiel — met jouw akkoord — naar die ene partij.',
            },
            {
                q: 'Heb ik een diploma bouwkunde nodig om werfleider te worden?',
                a: 'Een bachelor of master bouwkunde helpt, maar aantoonbare ervaring op de werf weegt bij veel aannemers even zwaar. Wie jaren als ploegbaas of als ervaren vakman werkte en plannen kan lezen, komt ook in aanmerking. Wat telt is of je ploegen kan aansturen en de werf administratief kan opvolgen.',
            },
        ],
        serviceTradeSlug: 'renovatie',
        serviceLinkLabel: 'Renovatieprojecten voor aannemers',
    },
    {
        slug: 'industrieel-elektricien',
        jobTradeSlug: 'elektricien_ind',
        linkLabel: 'Industrieel elektricien',
        h1: 'Vacatures industrieel elektricien in België',
        metaTitle: `Vacatures industrieel elektricien België | ${BRAND.name}`,
        metaDescription:
            'Vacatures voor industriële elektriciens in België: onderhoud, storingen en schakelkasten in de industrie en op werven. Wij plaatsen je en regelen documenten en loon vooraf.',
        intro: [
            'Wij zoeken industriële elektriciens voor onderhoud en installatiewerk in België, onder meer in de Antwerpse havenregio en in de industriezones rond Gent en in Limburg. Je werkt aan installaties waar stilstand geld kost, dus gestructureerd werken en vooruitdenken zijn belangrijker dan tempo.',
            'Het werk gaat van het opsporen van storingen en het herstellen van installaties tot het aansluiten en controleren van schakelkasten, met veilig vrijschakelen als vaste gewoonte.',
        ],
        tasks: [
            'Preventief en correctief onderhoud van industriële installaties',
            'Opsporen en verhelpen van storingen, ook onder tijdsdruk',
            'Aansluiten, bekabelen en controleren van schakelkasten',
            'Lezen en interpreteren van elektrische schema\'s en tekeningen',
            'Veilig vrijschakelen en interventies documenteren',
        ],
        requirements: [
            'Diploma of opleiding elektriciteit / elektromechanica',
            'Ervaring in een industriële omgeving of op industriële werven',
            'Zelfstandig storingen kunnen opsporen, niet alleen uitvoeren',
            'Kennis van PLC is een pluspunt, geen voorwaarde',
            'Bereid om in een onderhoudsploeg of in shiften te werken',
        ],
        certificates: [
            'BA4 en/of BA5 zijn op veel industriële sites vereist voor het werken aan elektrische installaties',
            'VCA-attest voor werk op werven',
            'AREI-kennis (algemeen reglement op de elektrische installaties) wordt verwacht',
        ],
        offer: [
            'Duidelijke afspraken over brutoloon, uren, shiften en startdatum vóór je begint',
            'Je tarief spreek je vóór de start af; bij shiftenwerk gelden de afspraken van de opdracht',
            'Eén vast aanspreekpunt dat je dossier opvolgt',
            'Voor buitenlandse elektriciens: A1, Limosa en werfregistratie worden vooraf geregeld',
            'Hulp bij het vinden van onderdak dicht bij de werf',
        ],
        faq: [
            {
                q: 'Wat verdient een industrieel elektricien in België?',
                a: 'Je factureert de aannemer als zelfstandige of met je ploeg; tarief en shiftregeling zijn jullie afspraak. Wij stellen het tarief niet vast en nemen er geen percentage van — onze vergoeding is een vindersloon van de aannemer.'
            },
            {
                q: 'Wat betekenen BA4 en BA5?',
                a: 'BA4 en BA5 zijn Belgische attesten voor het veilig werken aan elektrische installaties: BA4 voor laagspanning, BA5 voor hoogspanning. Op industriële sites wordt er vaak naar gevraagd en zonder geldig attest mag je bepaalde werken niet uitvoeren. Heb je ze niet, dan bekijken we welke opdrachten wel kunnen en welke opleiding je kan volgen.',
            },
            {
                q: 'Is kennis van PLC verplicht?',
                a: 'Niet voor alle opdrachten. Voor onderhoudswerk waar storingen in de sturing moeten worden opgespoord, is het een duidelijk voordeel en soms een vereiste. Werk je vooral in installatie en bekabeling, dan is PLC niet nodig. Zeg bij je inschrijving welke merken en systemen je kent.',
            },
            {
                q: 'Kan ik als buitenlandse elektricien in België werken?',
                a: 'Ja, met de juiste documenten: een A1-verklaring voor de sociale zekerheid, een Limosa-melding en de registratie in Checkinatwork op de werf. Wij regelen die voor je start. Voor industriële sites komt daar soms een toegangsprocedure van het bedrijf zelf bij, bijvoorbeeld een veiligheidsopleiding ter plaatse.',
            },
        ],
    },
];

/** Look up a trade landing page by its URL slug. */
export function getJobTradePage(slug: string): JobTradePage | undefined {
    return jobTradePages.find((trade) => trade.slug === slug);
}

/** Look up the trade landing page that belongs to a vacancy's tradeSlug. */
export function getJobTradePageByJobTrade(jobTradeSlug: string): JobTradePage | undefined {
    return jobTradePages.find((trade) => trade.jobTradeSlug === jobTradeSlug);
}

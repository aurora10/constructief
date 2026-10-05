/**
 * Shared shapes for the vacancy cluster.
 *
 * Why a separate file: the Dutch content lives in vacancies.ts / vacancyTrades.ts
 * and the Russian content in vacancies.ru.ts / vacancyTrades.ru.ts. Keeping the
 * types here means those four modules never import each other at runtime, so there
 * is no import cycle to reason about.
 *
 * Language policy for this cluster (differs from the B2B pages on purpose):
 *  - nl is the Belgian/Dutch market: people searching "vacature metselaar".
 *  - ru is the recruitment market we actually hire from — Eastern European crews,
 *    most of whom speak Russian. These pages are INDEXED and translated in full.
 *  - fr has no vacancy audience; the fr routes stay noindexed and fall back to the
 *    Dutch copy.
 */

/** The text of one vacancy, in one language. */
export interface JobCopy {
    title: string;
    description: string;
    intro: string[];
    tasks: string[];
    requirements: string[];
    offer: string[];
}

/** Display values that differ per language (JSON-LD always keeps the Dutch form). */
export interface JobLocalized {
    /** Human readable place name, e.g. "Западная Фландрия". */
    location: string;
    /** "Fulltime" / "Полная занятость". */
    type: string;
    /** "€ 17 - € 19 per uur" / "€ 17 - € 19 в час". */
    salary: string;
}

export interface JobRu extends JobLocalized, JobCopy {}

export interface JobTradeFaq {
    q: string;
    a: string;
}

/** The content of one trade job landing page, in one language. */
export interface JobTradeCopy {
    h1: string;
    metaTitle: string;
    metaDescription: string;
    intro: string[];
    tasks: string[];
    requirements: string[];
    certificates: string[];
    offer: string[];
    faq: JobTradeFaq[];
}

export interface JobTradeRu extends JobTradeCopy {
    /** Short name used in links and headings, e.g. "Каменщик". */
    linkLabel: string;
}

/**
 * Content model for the Nieuws (insights) section.
 *
 * Articles live as typed data files under src/content/nieuws/{locale}/ so that
 * messages/*.json stay a UI-translation layer (they were never meant to hold
 * long-form content). This gives us structured blocks, per-post internal links,
 * keywords and authorship for JSON-LD.
 */

export type ArticleBlock =
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'ul'; items: string[] }
    | { type: 'quote'; text: string };

export interface ArticleLink {
    label: string;
    /** locale-relative path, e.g. "/werkgevers" or "/diensten/onderaannemer-gevel-antwerpen" */
    href: string;
}

export interface ArticleCta {
    title: string;
    text: string;
    label: string;
    href: string;
}

export interface Article {
    /** URL slug: /{locale}/nieuws/{slug} */
    slug: string;
    title: string;
    /** Meta description + list-page excerpt */
    description: string;
    /** ISO date (publication) */
    date: string;
    /** ISO date (last meaningful update) */
    updated?: string;
    author: string;
    /** Use 'Constructief' for organization-authored posts */
    authorIsOrganization?: boolean;
    category: string;
    keywords?: string[];
    readingMinutes: number;
    blocks: ArticleBlock[];
    /** Internal links to money pages / related articles */
    related?: ArticleLink[];
    cta?: ArticleCta;
    /** Old numeric ids that must 301 to this slug (migration from /nieuws/1..3) */
    legacyIds?: string[];
}

import type { Metadata } from 'next';

const BASE = 'https://constructief-bouw.be';

/**
 * Single source of truth for canonical + hreflang on ordinary pages.
 *
 * Rules (consistent site-wide):
 *  - Every page declares a self-referencing canonical (never omitted, otherwise
 *    Google picks its own → "Duplicate, Google chose different canonical than user").
 *  - nl ⇄ fr are true language alternates; x-default points at the nl version.
 *  - ru is a separate (worker) cluster and is NEVER an alternate of nl/fr; it gets
 *    x-default → itself so it stands alone instead of being collapsed.
 */
export function pageAlternates(locale: string, path: string): Metadata['alternates'] {
    const normalized = path === '/' ? '' : path;
    const canonical = `${BASE}/${locale}${normalized}`;

    if (locale === 'ru') {
        return { canonical, languages: { 'x-default': canonical } };
    }

    return {
        canonical,
        languages: {
            nl: `${BASE}/nl${normalized}`,
            fr: `${BASE}/fr${normalized}`,
            'x-default': `${BASE}/nl${normalized}`,
        },
    };
}

/**
 * Canonical + hreflang for pages whose content exists in Dutch only
 * (vacancies today).
 *
 * fr/ru still resolve — they render the same Dutch text — but they are
 * noindexed, so they must NOT be advertised as alternates of the Dutch page:
 * pointing hreflang at a noindex URL is a contradiction Google resolves by
 * ignoring the annotation (and it invites the "different canonical" report).
 * The nl page therefore declares itself as both `nl` and `x-default`.
 */
export function dutchOnlyAlternates(locale: string, path: string): Metadata['alternates'] {
    const normalized = path === '/' ? '' : path;
    const canonical = `${BASE}/${locale}${normalized}`;

    return {
        canonical,
        languages:
            locale === 'nl'
                ? { nl: canonical, 'x-default': canonical }
                : { 'x-default': canonical },
    };
}

/** Canonical URL only (useful for fr-only pages). */
export function selfCanonicalWithDefault(locale: string, path: string): Metadata['alternates'] {
    const normalized = path === '/' ? '' : path;
    const canonical = `${BASE}/${locale}${normalized}`;
    return { canonical, languages: { 'x-default': canonical } };
}

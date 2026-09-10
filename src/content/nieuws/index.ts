import type { Article } from './types';

import { articles as nl } from './nl';
import { articles as fr } from './fr';
import { articles as ru } from './ru';

export type { Article, ArticleBlock, ArticleLink, ArticleCta } from './types';

const byLocale: Record<string, Article[]> = { nl, fr, ru };

/** All articles for a locale (newest first as authored in the locale index). */
export function getArticles(locale: string): Article[] {
    return byLocale[locale] ?? nl;
}

/** Single article by slug, or null when it does not exist in this locale. */
export function getArticle(locale: string, slug: string): Article | null {
    return getArticles(locale).find((a) => a.slug === slug) ?? null;
}

/** Slugs to pre-render for a locale. */
export function getArticleSlugs(locale: string): string[] {
    return getArticles(locale).map((a) => a.slug);
}

/**
 * Migration helper: maps an old numeric id (/nieuws/1) to the new slug,
 * searching every locale so legacy URLs redirect regardless of locale.
 */
export function findSlugByLegacyId(id: string): string | null {
    for (const list of Object.values(byLocale)) {
        const hit = list.find((a) => a.legacyIds?.includes(id));
        if (hit) return hit.slug;
    }
    return null;
}

import type { Article } from './types';

/**
 * Image conventions for Nieuws articles.
 *
 * Each article ships two files with the same basename:
 *   /images/news/{base}.webp  → hero image (small, modern browsers)
 *   /images/news/{base}.jpg   → social/OG image (universally supported)
 *
 * Newer articles set `image` explicitly (the .webp path); the migrated posts
 * fall back to article-{legacyId}.webp.
 */
export function heroImage(article: Article): string | null {
    if (article.image) return article.image;
    const numeric = article.legacyIds?.[0];
    return numeric ? `/images/news/article-${numeric}.webp` : null;
}

/** JPEG counterpart of the hero image, used for og:image / Twitter cards. */
export function ogImage(article: Article): string | null {
    const hero = heroImage(article);
    if (!hero) return null;
    return hero.replace(/\.webp$/i, '.jpg');
}

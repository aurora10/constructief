import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { jobs } from '@/data/vacancies';
import { getArticles } from '@/content/nieuws';
import { citiesData, flagshipCitySlugs, indexedCitySlugs } from '@/data/cities';
import { flagshipTrades } from '@/data/cityContent';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://constructief-bouw.be';
    const locales = routing.locales;

    /** Never let one malformed date break the whole sitemap. */
    const safeDate = (value?: string): Date => {
        const d = value ? new Date(value) : new Date();
        return Number.isNaN(d.getTime()) ? new Date() : d;
    };

    const staticPages = [
        '',
        '/kandidaten',
        '/werkgevers',
        '/vacatures',
        '/over-ons',
        '/nieuws',
        '/contact',
        '/privacy',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        // Static pages
        for (const page of staticPages) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: page === '' ? 1 : 0.8,
            });
        }

        // City landing pages (onderaannemer-{city}).
        // Strategy: advertise the Belgian flagship cities (Antwerpen/Gent/Leuven/
        // Brussel) plus the Dutch-market cities (Amsterdam/Rotterdam/Den Haag/
        // Utrecht) that already show search demand. The ru city pages are noindexed,
        // and the remaining thin city URLs are de-emphasised (kept out of the
        // sitemap) rather than being mass-generated.
        for (const city of citiesData) {
            if (locale === 'ru') continue;
            if (!indexedCitySlugs.includes(city.slug)) continue;
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/diensten/onderaannemer-${city.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        }

        // Trade+city pages (onderaannemer-{trade}-{city}) — only for the trades we
        // actually deliver, across the flagship cities, and not for ru.
        if (locale !== 'ru') {
            for (const city of flagshipCitySlugs) {
                for (const trade of flagshipTrades) {
                    sitemapEntries.push({
                        url: `${baseUrl}/${locale}/diensten/onderaannemer-${trade}-${city}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.9,
                    });
                }
            }
            // Base (nation-wide) trade pages (onderaannemer-{trade}) — the
            // country-level landing per trade, target for non-city trade queries.
            for (const trade of flagshipTrades) {
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}/diensten/onderaannemer-${trade}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.9,
                });
            }
        }

        // FR "sous-traitance bâtiment" opportunity page (fr only)
        if (locale === 'fr') {
            sitemapEntries.push({
                url: `${baseUrl}/fr/sous-traitance-batiment`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }

        // Vacancy detail pages
        for (const job of jobs) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/vacatures/${job.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }

        // News / insights articles (slug URLs, real lastmod per article)
        for (const article of getArticles(locale)) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/nieuws/${article.slug}`,
                lastModified: safeDate(article.updated || article.date),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        }
    }

    return sitemapEntries;
}

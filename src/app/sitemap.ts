import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { jobs } from '@/data/vacancies';
import { jobTradePages } from '@/data/vacancyTrades';
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
        '/onderaannemer-inschrijven',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        // Static pages.
        // /vacatures is Dutch-only: the vacancy copy is not translated yet, so the
        // fr/ru listings are noindexed (see app/[locale]/vacatures/page.tsx) and must
        // not be advertised here.
        for (const page of staticPages) {
            if (page === '/vacatures' && locale !== 'nl') continue;
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

        // Trade pages: trade+city (onderaannemer-{trade}-{city}) and base trade
        // (onderaannemer-{trade}) for nl/fr only. ru is not advertised because
        // those pages are noindexed — the Russian audience is the worker
        // cluster, not the B2B trade pages (see the diensten/[slug] rule).
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

        // Vacancy detail pages — nl only for the same reason as /vacatures, and with
        // the real datePosted as lastmod so Google sees a fresh posting per job.
        if (locale === 'nl') {
            for (const job of jobs) {
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}/vacatures/${job.id}`,
                    lastModified: safeDate(job.datePosted),
                    changeFrequency: 'weekly',
                    priority: 0.9,
                });
            }

            // Trade job landing pages: one page per trade, targeting the job-seeker
            // queries ("vacature metselaar") that actually carry search demand.
            for (const trade of jobTradePages) {
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}/vacatures/${trade.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.9,
                });
            }
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

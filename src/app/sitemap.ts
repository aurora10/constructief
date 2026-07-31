import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { jobs } from '@/data/vacancies';
import { articleIds } from '@/data/news';
import { citiesData } from '@/data/cities';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://constructief-bouw.be';
    const locales = routing.locales;

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

        // City landing pages (onderaannemer-{city})
        for (const city of citiesData) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/diensten/onderaannemer-${city.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
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

        // News article pages
        for (const articleId of articleIds) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/nieuws/${articleId}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }
    }

    return sitemapEntries;
}

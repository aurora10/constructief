import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { jobs } from '@/data/vacancies';
import { articleIds } from '@/data/news';

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
        for (const page of staticPages) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: page === '' ? 1 : 0.8,
            });
        }

        for (const job of jobs) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/vacatures/${job.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        }

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

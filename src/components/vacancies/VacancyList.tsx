"use client";

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { MapPin, Clock, Euro, Search } from 'lucide-react';
import { jobs, tradeLabel } from '@/data/vacancies';

/**
 * Client side of the vacancy listing: working search + trade filter.
 * The copy on the cards is Dutch (the vacancy cluster is Dutch-only), but the
 * surrounding UI follows the active locale.
 */
export function VacancyList() {
    const t = useTranslations('VacanciesPage');
    const locale = useLocale();
    const [query, setQuery] = useState('');
    const [trade, setTrade] = useState('all');

    // Only trades that actually have open vacancies appear in the filter.
    const tradeOptions = useMemo(
        () => Array.from(new Set(jobs.map((job) => job.tradeSlug))),
        []
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return jobs.filter((job) => {
            if (trade !== 'all' && job.tradeSlug !== trade) return false;
            if (!q) return true;
            return [job.title, job.description, job.location, job.type, tradeLabel(job.tradeSlug, locale)]
                .join(' ')
                .toLowerCase()
                .includes(q);
        });
    }, [query, trade, locale]);

    return (
        <>
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t('search_placeholder')}
                        aria-label={t('search_placeholder')}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="md:w-72">
                    <label htmlFor="trade-filter" className="sr-only">
                        {t('filter')}
                    </label>
                    <select
                        id="trade-filter"
                        value={trade}
                        onChange={(event) => setTrade(event.target.value)}
                        className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">{t('filter_all')}</option>
                        {tradeOptions.map((slug) => (
                            <option key={slug} value={slug}>
                                {tradeLabel(slug, locale)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="text-sm text-neutral-500 mb-8" aria-live="polite">
                {t('results_count', { count: filtered.length })}
            </p>

            {/* Job list */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filtered.map((job) => (
                        <div
                            key={job.id}
                            className="border rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                <p className="text-neutral-600 mb-4 max-w-2xl">{job.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{job.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Euro className="h-4 w-4" />
                                        <span>{job.salary}</span>
                                    </div>
                                </div>
                            </div>
                            <Button asChild>
                                <Link href={`/vacatures/${job.id}`}>{t('view_details')}</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border rounded-lg p-8 bg-neutral-50 text-center">
                    <p className="text-neutral-600 mb-6">{t('no_results')}</p>
                    <Button asChild>
                        <Link href="/kandidaten">{t('apply')}</Link>
                    </Button>
                </div>
            )}

            <p className="text-sm text-neutral-500 mt-8">{t('spontaneous')}</p>
        </>
    );
}

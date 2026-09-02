import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

/**
 * A contextual internal link that pushes crawl/link equity from the programmatic
 * city/trade pages to the commercial flagship /werkgevers page. One descriptive
 * link per page, placed near the final CTA.
 */
export async function WerkgeversLink({ locale }: { locale: string }) {
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'CitySeoUi' });

    return (
        <section className="py-10 px-4 md:px-8 bg-neutral-50 dark:bg-neutral-900/40">
            <div className="container max-w-3xl text-center">
                <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed">
                    {t('werkgevers_link_lead')}
                    <Link
                        href="/werkgevers"
                        className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                        {t('werkgevers_link_anchor')}
                        <ArrowRight className="w-4 h-4 inline" />
                    </Link>
                    {t('werkgevers_link_tail')}
                </p>
            </div>
        </section>
    );
}

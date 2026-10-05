import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { citiesData, formatCityName } from '@/data/cities';
import { flagshipTrades } from '@/data/cityContent';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/seo';
import { Hero } from '@/components/sections/Hero';
import { ValueProps } from '@/components/sections/ValueProps';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedJobs } from '@/components/sections/FeaturedJobs';
import { Testimonials } from '@/components/sections/Testimonials';
import { TrustSignals } from '@/components/sections/TrustSignals';

// Self-referencing canonical. For the RU worker cluster, x-default points at the
// RU page itself (standalone), NOT at /nl — so Google never collapses the
// worker-intent RU pages into the B2B Dutch pages.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: pageAlternates(locale, '') };
}

// A curated subset of the highest-value city pages. Linking to them from the
// homepage (the page with the most internal authority) helps Google discover
// and prioritize the programmatic city pages instead of leaving them in a
// "discovered, not indexed" state.
const heroCities = [
  'antwerpen',
  'brussel',
  'gent',
  'leuven',
  'mechelen',
  'amsterdam',
  'rotterdam',
  'den-haag',
  'utrecht',
  'eindhoven',
];

export default function Home() {
  const t = useTranslations('HomePage');
  const tFooter = useTranslations('Footer');
  const tTrades = useTranslations('Trades');
  const tCluster = useTranslations('TradeCluster');
  const featured = citiesData.filter((c) => heroCities.includes(c.slug));

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ValueProps />
      <HowItWorks />
      <FeaturedJobs />
      <Testimonials />
      <TrustSignals />

      {/* Popular regions — internal links to the city landing pages */}
      <section className="py-20 px-4 md:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
              {tFooter('regions')}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured.map((city) => (
              <Link
                key={city.slug}
                href={`/diensten/onderaannemer-${city.slug}`}
                className="group bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary hover:shadow-md transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {formatCityName(city.slug)}
                  </h3>
                  <p className="text-sm text-muted-foreground">{city.province}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/diensten"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {tFooter('view_all_regions')}
            </Link>
          </div>
        </div>
      </section>

      {/* Trade teams — internal links to the nationwide trade landing pages */}
      <section className="py-20 px-4 md:px-8 bg-white dark:bg-neutral-950">
        <div className="container max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
              {tCluster('homepage_title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {tCluster('homepage_subtitle')}
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-6"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {flagshipTrades.map((tr) => (
              <Link
                key={tr}
                href={`/diensten/onderaannemer-${tr}`}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 py-3 font-semibold text-neutral-800 dark:text-neutral-200 hover:border-primary hover:text-primary transition-colors"
              >
                {tTrades(`${tr}.label`)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

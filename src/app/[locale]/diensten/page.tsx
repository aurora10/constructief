import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { citiesData } from '@/data/cities';
import { flagshipTrades } from '@/data/cityContent';
import { MapPin, ArrowRight, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  
  return {
    title: `${t('regions')} | Constructief`,
    description: "Vind betrouwbare onderaannemers en bouwpersoneel in uw regio.",
    alternates: {
      canonical: `https://constructief-bouw.be/${locale}/diensten`,
      languages: {
        nl: `https://constructief-bouw.be/nl/diensten`,
        fr: `https://constructief-bouw.be/fr/diensten`,
        ru: `https://constructief-bouw.be/ru/diensten`,
      },
    },
  };
}

export default async function RegionsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const tFooter = await getTranslations({ locale, namespace: 'Footer' });
  const tTrades = await getTranslations({ locale, namespace: 'Trades' });

  const tradesHeading =
    locale === 'fr' ? 'Nos spécialités' : locale === 'ru' ? 'Наши специализации' : 'Onze specialisaties';

  // Group cities by country
  const beCities = citiesData.filter(c => c.country === 'BE');
  const nlCities = citiesData.filter(c => c.country === 'NL');

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t('regions')}
        subtitle={tFooter('regions')}
      />

      {/* Trades (specialisations) — base trade landing pages. Internal links here
          give Google a crawl path to the trade pages (and, from them, the
          trade+city pages) so they get discovered/indexed. */}
      <section className="py-16 px-4 md:px-8 bg-white dark:bg-neutral-900">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Wrench className="text-primary w-8 h-8" />
            {tradesHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {flagshipTrades.map((trade) => (
              <Link
                key={trade}
                href={`/diensten/onderaannemer-${trade}`}
                className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border hover:border-primary hover:shadow-md transition-all group flex items-center justify-between"
              >
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {tTrades(`${trade}.label`)}
                </h3>
                <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container max-w-6xl">
          
          {/* Belgium Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <MapPin className="text-primary w-8 h-8" />
              België
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {beCities.map((city) => (
                <Link 
                  key={city.slug}
                  href={`/diensten/onderaannemer-${city.slug}`}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-xl border hover:border-primary hover:shadow-md transition-all group flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">{city.province}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>

          {/* Netherlands Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <MapPin className="text-primary w-8 h-8" />
              Nederland
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nlCities.map((city) => (
                <Link 
                  key={city.slug}
                  href={`/diensten/onderaannemer-${city.slug}`}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-xl border hover:border-primary hover:shadow-md transition-all group flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">{city.province}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

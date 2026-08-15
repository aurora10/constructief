import { targetCities, citiesData } from '@/data/cities';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { jobs } from '@/data/vacancies';
import { 
  MapPin, 
  Wrench, 
  HardHat, 
  Truck, 
  Settings, 
  ChevronRight, 
  HelpCircle,
  Building2,
  Clock
} from 'lucide-react';

export async function generateStaticParams() {
  return targetCities.map((city) => ({
    slug: `onderaannemer-${city}`,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;

  const city = slug.replace('onderaannemer-', '');
  
  const cityData = citiesData.find(c => c.slug === city);
  if (!cityData) {
    return {};
  }
  
  const namespace = `CitySEO_var${cityData.variation}`;
  const t = await getTranslations({ locale, namespace });
  
  return {
    title: `${t('heading', { city: cityData.name })} | Constructief`,
    description: t('intro', { city: cityData.name }),
    alternates: {
      canonical: `https://constructief-bouw.be/${locale}/diensten/${slug}`,
      languages: {
        nl: `https://constructief-bouw.be/nl/diensten/${slug}`,
        fr: `https://constructief-bouw.be/fr/diensten/${slug}`,
        ru: `https://constructief-bouw.be/ru/diensten/${slug}`,
      },
    },
  };
}

export default async function CityLandingPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const city = slug.replace('onderaannemer-', '');
  
  const cityData = citiesData.find(c => c.slug === city);
  if (!cityData) {
    notFound();
  }

  const cityName = cityData.name;
  const province = cityData.province;
  const namespace = `CitySEO_var${cityData.variation}`;
  
  const t = await getTranslations({ locale, namespace });
  const tTrades = await getTranslations({ locale, namespace: 'CandidateForm' });
  const tSeo = await getTranslations({ locale, namespace: 'CitiesSeo' });
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });
  
  const uniqueDescription = tSeo(city);

  // Simple permutations based on city slug length to make DOM unique
  const permutations = [[1, 2, 3], [2, 3, 1], [3, 1, 2], [1, 3, 2], [2, 1, 3]];
  const pIndex = city.length % permutations.length;
  const order = permutations[pIndex];
  
  // Pick pseudo-random jobs to show
  const relatedJobs = [...jobs].sort((a, b) => (a.id * city.length) % 7 - (b.id * city.length) % 7).slice(0, 3);

  const getIconForTrade = (index: number) => {
    switch(index % 4) {
      case 0: return <Building2 className="w-10 h-10 text-primary mb-4" />;
      case 1: return <Wrench className="w-10 h-10 text-primary mb-4" />;
      case 2: return <Settings className="w-10 h-10 text-primary mb-4" />;
      case 3: return <Truck className="w-10 h-10 text-primary mb-4" />;
      default: return <Wrench className="w-10 h-10 text-primary mb-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section — styled to match main Hero.tsx */}
      <section className="relative overflow-hidden bg-neutral-900 py-32 md:py-40">
        {/* Deep background color */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0f1a]"></div>

          {/* Abstract geometric patterns/gradients */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent blur-[100px] opacity-30"></div>
          </div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          {/* Diagonal structural lines */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 100 M 0 0 L 100 100" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent"></div>
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
            {t('heading', { city: cityName }).split(cityName)[0]} 
            <span className="text-primary">{cityName}</span>
            {t('heading', { city: cityName }).split(cityName)[1] || ''}
          </h1>
          <p className="max-w-2xl text-lg text-neutral-200 mb-10 leading-relaxed">
            {t('intro', { city: cityName })}
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full bg-white text-neutral-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/10">
            <Link href="/werkgevers">
              {t('hero_cta')}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* 2. Available Trades */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
              {t('trades_title', { city: cityName })}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cityData.popularTrades.slice(0, 4).map((tradeKey, idx) => (
              <div key={tradeKey} className="bg-neutral-light/30 p-6 rounded-2xl border border-neutral-light/50 hover:shadow-md transition-shadow">
                {getIconForTrade(idx)}
                <h3 className="font-semibold text-lg mb-2 text-neutral-900">{tTrades(tradeKey)}</h3>
                <p className="text-neutral/70 text-sm">
                  {t('regional_text', { city: cityName, province: province }).substring(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Local Trust & Logistics */}
      <section className="py-20 px-4 md:px-8 bg-neutral-light/30">
        <div className="container max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-neutral-900">
            {t('trust_title', { city: cityName })}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {order.map((num) => {
              const icons: Record<number, React.ReactNode> = {
                1: <MapPin className="w-8 h-8" />,
                2: <HardHat className="w-8 h-8" />,
                3: <Clock className="w-8 h-8" />
              };
              return (
                <div key={`trust-${num}`} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                    {icons[num]}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-900">{t(`trust_${num}_title` as any, { city: cityName })}</h3>
                  <p className="text-neutral/80">{t(`trust_${num}_desc` as any, { city: cityName, province: province })}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Regional Breadcrumbs */}
      <section className="py-12 px-4 md:px-8 bg-neutral-dark text-white border-y border-white/10">
        <div className="container max-w-4xl text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <MapPin className="text-primary w-6 h-6 shrink-0" />
          <p className="text-lg text-neutral-light/90">
            {t('regional_text', { city: cityName, province: province })}
          </p>
        </div>
      </section>

      {/* 4.5 Local SEO Context */}
      {uniqueDescription && (
        <section className="py-16 px-4 md:px-8 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="container max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
              {cityName}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
              {uniqueDescription}
            </p>
          </div>
        </section>
      )}

      {/* 4.7 Local Vacancies */}
      <section className="py-20 px-4 md:px-8 bg-neutral-100 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
              {tNav("vacancies")} - {cityName}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedJobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all flex flex-col text-left">
                <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">{job.title}</h3>
                <div className="flex items-center gap-2 text-neutral-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location === 'Antwerpen' || job.location === 'Brussel' || job.location === 'Gent' ? job.location : cityName}</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 flex-1 text-sm">{job.description.substring(0, 100)}...</p>
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/vacatures">{tNav("vacancies")}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
              {t('faq_title', { city: cityName })}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            {order.map((num) => (
              <div key={`faq-${num}`} className="bg-neutral-light/30 p-6 rounded-2xl border border-neutral-light/50 text-left">
                <h3 className="text-lg font-bold mb-2 flex items-start gap-3 text-neutral-900">
                  <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  {t(`faq_${num}_q` as any, { city: cityName })}
                </h3>
                <p className="text-neutral/80 ml-9">{t(`faq_${num}_a` as any, { city: cityName })}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="py-24 px-4 md:px-8 bg-primary text-white text-center">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('final_cta_title', { city: cityName })}
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto text-white/90">
            {t('final_cta_desc', { city: cityName })}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6 rounded-full bg-white text-neutral-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/10 border-0">
            <Link href="/werkgevers">
              {t('final_cta_button')}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
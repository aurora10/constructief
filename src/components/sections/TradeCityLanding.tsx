import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { EmployerUSP } from '@/components/sections/EmployerUSP';
import { CheckCircle2, ChevronRight, Home, Layers, Wrench } from 'lucide-react';
import type { CityData } from '@/data/cities';

export async function TradeCityLanding({
  trade,
  city,
  locale,
}: {
  trade: string;
  city: CityData;
  locale: string;
}) {
  setRequestLocale(locale);

  const tT = await getTranslations({ locale, namespace: 'Trades' });
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });

  const label = tT(`${trade}.label`);
  const title = tT(`${trade}.title`, { city: city.name });
  const intro = tT(`${trade}.intro`, { city: city.name });
  const ctaTitle = tT(`${trade}.cta_title`, { city: city.name });
  const ctaDesc = tT(`${trade}.cta_desc`, { city: city.name });
  const ctaButton = tT(`${trade}.cta_button`);
  const features = (tT.raw(`${trade}.features`) as string[]) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <nav aria-label={tNav('home')} className="container py-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
              <Home className="w-3.5 h-3.5" />
              {tNav('home')}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li>
            <Link href="/diensten" className="hover:text-primary">
              {tNav('regions')}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li className="font-medium text-neutral-900" aria-current="page">
            {label} {city.name}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-900 py-28 md:py-36">
        <div className="absolute inset-0 z-0 bg-[#0a0f1a]"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent blur-[100px] opacity-30"></div>
        </div>
        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-primary mb-5">
            <Layers className="w-6 h-6" />
            <span className="uppercase tracking-wide font-semibold text-sm">{label}</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-neutral-200 mb-10 leading-relaxed">{intro}</p>
          <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full bg-white text-neutral-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/10">
            <Link href="/werkgevers">
              {ctaButton}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* What the team delivers */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <Wrench className="w-5 h-5" />
              <span className="font-semibold">{tNav('regions')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              {tT(`${trade}.section_title`, { city: city.name })}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex items-start gap-4"
              >
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-neutral-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / compliance / testweek / pay-for-result proof */}
      <EmployerUSP />

      {/* CTA */}
      <section className="py-24 px-4 md:px-8 bg-primary text-white text-center">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{ctaTitle}</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto text-white/90">{ctaDesc}</p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6 rounded-full bg-white text-neutral-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/10 border-0">
            <Link href="/contact">
              {ctaButton}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

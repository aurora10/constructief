import { useTranslations } from 'next-intl';
import { Hero } from '@/components/sections/Hero';
import { ValueProps } from '@/components/sections/ValueProps';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedJobs } from '@/components/sections/FeaturedJobs';
import { Testimonials } from '@/components/sections/Testimonials';
import { TrustSignals } from '@/components/sections/TrustSignals';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ValueProps />
      <HowItWorks />
      <FeaturedJobs />
      <Testimonials />
      <TrustSignals />
    </div>
  );
}

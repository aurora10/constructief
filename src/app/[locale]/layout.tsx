import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../../styles/globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlowFrame } from "@/components/layout/GlowFrame";
import { CookieBanner } from "@/components/layout/CookieBanner";

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EmploymentAgency", "Organization"],
    "name": "Constructief",
    "url": "https://constructief-bouw.be",
    "description": t('description'),
    "areaServed": {
      "@type": "Country",
      "name": "Belgium",
      "alternateName": "BE"
    },
    "knowsAbout": [
      "Construction Subcontractors",
      "General Contractors",
      "Bouwpersoneel",
      "Hoofdaannemers"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Aankoop en calculatieafdelingen van grote bouwbedrijven en hoofdaannemers"
    }
  };

  return (
    <html lang={locale}>
      <body className={`${manrope.variable} antialiased bg-background text-neutral flex flex-col min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <GlowFrame />
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

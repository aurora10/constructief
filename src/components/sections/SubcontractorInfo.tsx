import { getTranslations } from 'next-intl/server';
import { CheckCircle2, FileCheck2, ListChecks, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface Content {
  heading: string;
  intro: string;
  benefits_heading: string;
  benefits: string[];
  docs_heading: string;
  docs: string[];
  process_heading: string;
  process: string[];
  faq_heading: string;
  faq: FaqItem[];
}

/**
 * Rankable body copy + FAQ for the subcontractor signup page.
 * The page otherwise is a form only (thin) — this gives Google something to
 * rank and answers the questions workers actually search for. Includes
 * schema.org FAQPage (renders on the page itself, so Google can read it).
 */
export async function SubcontractorInfo({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'SubcontractorForm' });
  const c = t.raw('content') as Content;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-white dark:bg-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          {c.heading}
        </h2>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-10 leading-relaxed">
          {c.intro}
        </p>

        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          {c.benefits_heading}
        </h3>
        <ul className="space-y-2 mb-10">
          {c.benefits.map((b, i) => (
            <li key={i} className="flex gap-2 text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <FileCheck2 className="w-5 h-5 text-primary" />
          {c.docs_heading}
        </h3>
        <ul className="space-y-2 mb-10">
          {c.docs.map((d, i) => (
            <li key={i} className="flex gap-2 text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <ListChecks className="w-5 h-5 text-primary" />
          {c.process_heading}
        </h3>
        <ol className="space-y-2 mb-12 list-decimal pl-6">
          {c.process.map((s, i) => (
            <li key={i} className="text-neutral-700 dark:text-neutral-300">
              {s}
            </li>
          ))}
        </ol>

        <h3 className="text-xl font-semibold mb-5 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <HelpCircle className="w-5 h-5 text-primary" />
          {c.faq_heading}
        </h3>
        <div className="space-y-4">
          {c.faq.map((f, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{f.q}</h4>
              <p className="text-neutral-700 dark:text-neutral-300">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";

/**
 * Worker-facing FAQ block. Answers the practical questions workers have
 * (A1/Limosa documents, housing, payment) — a separate intent from the B2B
 * pages, kept on the candidate/worker routes.
 */
export function WorkerFaqSection() {
    const t = useTranslations("WorkerFaq");
    const items = (t.raw("items") as { q: string; a: string }[]) ?? [];

    return (
        <section className="py-20 px-4 md:px-8 bg-white">
            <div className="container max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
                        {t("title")}
                    </h2>
                    <p className="text-lg text-neutral-600">{t("subtitle")}</p>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-6"></div>
                </div>

                <div className="space-y-6">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="bg-neutral-light/30 p-6 rounded-2xl border border-neutral-light/50 text-left"
                        >
                            <h3 className="text-lg font-bold mb-2 flex items-start gap-3 text-neutral-900">
                                <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                                {item.q}
                            </h3>
                            <p className="text-neutral/80 ml-9">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

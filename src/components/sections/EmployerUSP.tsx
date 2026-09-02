"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileCheck2, Clock, BadgeEuro, Globe, ArrowRight } from "lucide-react";

const icons = [ShieldCheck, FileCheck2, Clock, BadgeEuro, Globe];

export function EmployerUSP() {
    const t = useTranslations("EmployersUsp");
    const features = (t.raw("features") as { title: string; desc: string }[]) ?? [];
    const featureCount = features.length;

    return (
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900/40">
            <div className="container max-w-6xl">
                <div className="text-center mb-14">
                    <p className="uppercase text-primary font-semibold tracking-wide text-sm mb-3">
                        {t("eyebrow")}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                        {t("intro")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: featureCount }).map((_, i) => {
                        const Icon = icons[i] ?? ShieldCheck;
                        return (
                            <div
                                key={i}
                                className="bg-white dark:bg-neutral-900 p-7 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white">
                                    {t(`features.${i}.title`)}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                                    {t(`features.${i}.desc`)}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-14 bg-primary text-white rounded-2xl p-10 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("cta_title")}</h2>
                    <p className="text-white/90 mb-8 max-w-2xl mx-auto">{t("cta_desc")}</p>
                    <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full">
                        <Link href="/contact">
                            {t("cta_button")}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

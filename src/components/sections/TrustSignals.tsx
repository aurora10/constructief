"use client";

import { useTranslations } from "next-intl";

export function TrustSignals() {
    const t = useTranslations("TrustSignals");

    const stats = [
        { key: "candidates" },
        { key: "companies" },
        { key: "placements" },
    ];

    return (
        <section className="py-20 bg-primary text-white">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat) => (
                        <div key={stat.key}>
                            <div className="text-primary-foreground/80 text-lg mb-2">{t(stat.key)}</div>
                            <div className="text-4xl md:text-5xl font-bold">{t(`${stat.key}_value`)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

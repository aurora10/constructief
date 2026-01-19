"use client";

import { useTranslations } from "next-intl";

export function TrustSignals() {
    const t = useTranslations("TrustSignals");

    const stats = [
        { key: "candidates", value: "500+" },
        { key: "companies", value: "50+" },
        { key: "placements", value: "1000+" },
    ];

    return (
        <section className="py-20 bg-primary text-white">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat) => (
                        <div key={stat.key}>
                            <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                            <div className="text-primary-foreground/80 text-lg">{t(stat.key)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useTranslations } from "next-intl";
import { HardHat, Briefcase, Clock } from "lucide-react";

export function Services() {
    const t = useTranslations("Services");

    const services = [
        { key: "temp", icon: Clock },
        { key: "perm", icon: Briefcase },
        { key: "project", icon: HardHat },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <div key={service.key} className="p-8 rounded-lg border bg-neutral-50 hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t(`items.${service.key}.title`)}</h3>
                                <p className="text-neutral-600">{t(`items.${service.key}.description`)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useTranslations } from "next-intl";
import { Heart, ShieldCheck, Zap } from "lucide-react";

export function Values() {
    const t = useTranslations("Values");

    const values = [
        { key: "integrity", icon: ShieldCheck },
        { key: "passion", icon: Heart },
        { key: "innovation", icon: Zap },
    ];

    return (
        <section className="py-20 bg-neutral-50">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
                        {t("title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value) => {
                        const Icon = value.icon;
                        return (
                            <div key={value.key} className="text-center p-6">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t(`items.${value.key}.title`)}</h3>
                                <p className="text-neutral-600">{t(`items.${value.key}.description`)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

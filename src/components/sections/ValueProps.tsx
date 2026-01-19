"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, Shield, Users, Zap } from "lucide-react";

const icons = {
    quality: Shield,
    speed: Zap,
    network: Users,
    reliability: CheckCircle,
};

export function ValueProps() {
    const t = useTranslations("ValueProps");

    const features = [
        { key: "quality", icon: icons.quality },
        { key: "speed", icon: icons.speed },
        { key: "network", icon: icons.network },
        { key: "reliability", icon: icons.reliability },
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center p-6 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t(`features.${feature.key}.title`)}</h3>
                                <p className="text-neutral-600">{t(`features.${feature.key}.description`)}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

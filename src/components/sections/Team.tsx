"use client";

import { useTranslations } from "next-intl";

export function Team() {
    const t = useTranslations("Team");

    const team = [
        {
            id: 1,
            name: "Robert Zimerman",
            role: "Founder & CEO",
        },
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

                <div className="max-w-xs mx-auto text-center">
                    {team.map((member) => (
                        <div key={member.id}>
                            <div className="h-48 w-48 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-6 flex items-center justify-center overflow-hidden relative group">
                                <div className="absolute inset-0 opacity-20">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <circle cx="20" cy="20" r="30" fill="currentColor" className="text-primary" />
                                        <rect x="50" y="50" width="40" height="40" transform="rotate(45 70 70)" fill="currentColor" className="text-primary" />
                                        <path d="M10,80 Q40,40 80,80" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" />
                                    </svg>
                                </div>
                                <div className="z-10 bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-primary">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900">{member.name}</h3>
                            <p className="text-lg text-neutral-600 font-medium">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

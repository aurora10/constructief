"use client";

import { useTranslations } from "next-intl";

export function Team() {
    const t = useTranslations("Team");

    const team = [
        {
            id: 1,
            name: "Jan Janssens",
            role: "CEO",
        },
        {
            id: 2,
            name: "Marie Peeters",
            role: "HR Manager",
        },
        {
            id: 3,
            name: "Peter Maes",
            role: "Recruiter",
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map((member) => (
                        <div key={member.id} className="text-center">
                            <div className="h-48 w-48 rounded-full bg-neutral-200 mx-auto mb-6" />
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-neutral-600">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

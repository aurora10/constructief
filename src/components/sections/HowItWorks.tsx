"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HowItWorks() {
    const t = useTranslations("HowItWorks");
    const containerRef = useRef(null);
    const candidatesColRef = useRef(null);
    const employersColRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(candidatesColRef.current,
            { x: -50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: candidatesColRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
            }
        );

        gsap.fromTo(employersColRef.current,
            { x: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: employersColRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.2,
                ease: "power3.out",
            }
        );
    }, { scope: containerRef });

    const candidateSteps = [1, 2, 3];
    const employerSteps = [1, 2, 3];

    return (
        <section className="py-20 bg-neutral-50" ref={containerRef}>
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-5xl mx-auto">
                    {/* Candidates Column */}
                    <div
                        ref={candidatesColRef}
                        className="space-y-8" // Start invisible for GSAP
                    >
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-primary mb-4">{t("candidates.title")}</h3>
                            <p className="text-neutral-600 mb-8">{t("candidates.description")}</p>
                        </div>

                        <div className="space-y-6">
                            {candidateSteps.map((step) => (
                                <div key={step} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                        {step}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">{t(`candidates.step${step}.title`)}</h4>
                                        <p className="text-neutral-600">{t(`candidates.step${step}.description`)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 text-center lg:text-left">
                            <Button asChild>
                                <Link href="/kandidaten">{t("candidates.cta")}</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Employers Column */}
                    <div
                        ref={employersColRef}
                        className="space-y-8" // Start invisible for GSAP
                    >
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-accent mb-4">{t("employers.title")}</h3>
                            <p className="text-neutral-600 mb-8">{t("employers.description")}</p>
                        </div>

                        <div className="space-y-6">
                            {employerSteps.map((step) => (
                                <div key={step} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                                        {step}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">{t(`employers.step${step}.title`)}</h4>
                                        <p className="text-neutral-600">{t(`employers.step${step}.description`)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 text-center lg:text-left">
                            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                                <Link href="/werkgevers">{t("employers.cta")}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

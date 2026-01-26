"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Hero() {
    const t = useTranslations("Hero");
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(titleRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
        })
            .from(subtitleRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
            }, "-=0.6")
            .from(ctaRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.6,
            }, "-=0.4");
    }, { scope: containerRef });

    return (
        <section className="relative overflow-hidden bg-neutral-900 py-32 md:py-48" ref={containerRef}>
            {/* Abstract CSS Background */}
            <div className="absolute inset-0 z-0">
                {/* Deep background color */}
                <div className="absolute inset-0 bg-[#0a0f1a]"></div>

                {/* Abstract geometric patterns/gradients */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]"></div>
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent blur-[100px] opacity-30"></div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* Diagonal structural lines */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                                <path d="M 100 0 L 0 100 M 0 0 L 100 100" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent"></div>
            </div>

            <div className="container relative z-10 flex flex-col items-center text-center">
                <h1
                    ref={titleRef}
                    className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-7xl"
                >
                    {t("title")}
                </h1>
                <p
                    ref={subtitleRef}
                    className="mt-6 max-w-2xl text-lg text-neutral-200"
                >
                    {t("subtitle")}
                </p>
                <div
                    ref={ctaRef}
                    className="mt-10 flex flex-col gap-4 sm:flex-row"
                >
                    <Button
                        asChild
                        size="lg"
                        className="text-lg px-8 h-14 min-w-[220px] bg-white text-neutral-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/10"
                    >
                        <Link href="/kandidaten">{t("cta_candidates")}</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 h-14 min-w-[220px] border-white/30 text-white bg-transparent backdrop-blur-sm hover:bg-accent hover:border-accent hover:scale-105 transition-all duration-300"
                    >
                        <Link href="/werkgevers">{t("cta_employers")}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

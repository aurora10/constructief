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
        <section className="relative overflow-hidden bg-neutral-50 py-20 md:py-32" ref={containerRef}>
            <div className="container relative z-10 flex flex-col items-center text-center">
                <h1
                    ref={titleRef}
                    className="max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl"
                >
                    {t("title")}
                </h1>
                <p
                    ref={subtitleRef}
                    className="mt-6 max-w-2xl text-lg text-neutral-600"
                >
                    {t("subtitle")}
                </p>
                <div
                    ref={ctaRef}
                    className="mt-10 flex flex-col gap-4 sm:flex-row"
                >
                    <Button asChild size="lg" className="text-lg">
                        <Link href="/kandidaten">{t("cta_candidates")}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg border-accent text-accent hover:bg-accent hover:text-white">
                        <Link href="/werkgevers">{t("cta_employers")}</Link>
                    </Button>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </section>
    );
}

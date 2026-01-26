"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
    const t = useTranslations("CookieBanner");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 z-[60] md:left-auto md:max-w-md"
                >
                    <div className="bg-white/95 backdrop-blur-md dark:bg-neutral-900/95 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-grow flex items-start gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Cookie className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    {t("message")}{" "}
                                    <Link href="/privacy" className="font-semibold text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
                                        {t("privacy")}
                                    </Link>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                onClick={acceptCookies}
                                size="sm"
                                className="flex-grow sm:flex-none font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                {t("accept")}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

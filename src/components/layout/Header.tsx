"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
    const t = useTranslations("Navigation");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Track scroll position for header styling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: t("home"), href: "/" },
        { label: t("candidates"), href: "/kandidaten" },
        { label: t("employers"), href: "/werkgevers" },
        { label: t("vacancies"), href: "/vacatures" },
        { label: t("about"), href: "/over-ons" },
        { label: t("news"), href: "/nieuws" },
        { label: t("contact"), href: "/contact" },
    ];

    const switchLocale = (locale: string) => {
        router.replace(pathname, { locale });
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-neutral-200 py-0"
                    : "bg-white/80 backdrop-blur-sm border-transparent py-2"
            )}
        >
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary tracking-tight">Constructief</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-[17px] font-semibold transition-all hover:text-primary relative group py-2",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-neutral-700 hover:opacity-100"
                            )}
                        >
                            {item.label}
                            <span className={cn(
                                "absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 scale-x-0 group-hover:scale-x-100",
                                pathname === item.href && "scale-x-100"
                            )}></span>
                        </Link>
                    ))}
                    <div className="flex items-center gap-1 pl-4 border-l border-neutral-200">
                        <Button variant="ghost" size="sm" className="font-bold text-xs" onClick={() => switchLocale("nl")}>
                            NL
                        </Button>
                        <span className="text-neutral-300 h-4 w-px bg-neutral-200"></span>
                        <Button variant="ghost" size="sm" className="font-bold text-xs" onClick={() => switchLocale("ru")}>
                            RU
                        </Button>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <nav className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-lg font-medium transition-colors hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex items-center space-x-4 pt-4 border-t">
                            <Button variant="outline" size="sm" onClick={() => switchLocale("nl")}>
                                NL
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => switchLocale("ru")}>
                                RU
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

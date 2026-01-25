"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
    const t = useTranslations("Navigation");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">Constructief</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-primary",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => switchLocale("nl")}>
                            NL
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => switchLocale("ru")}>
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

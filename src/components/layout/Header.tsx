"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
);

export function Header() {
    const t = useTranslations("Navigation");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

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
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-neutral-200 py-1"
                    : "bg-white/80 backdrop-blur-sm border-transparent py-3"
            )}
        >
            <div className="container flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-primary tracking-tight translate-y-1">Constructief Bouw</span>
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

                    <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-[#25D366] text-white hover:bg-[#22c55e] font-semibold transition-colors border-0"
                    >
                        <a href="https://wa.me/32465811031" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <WhatsAppIcon className="w-4 h-4" />
                            +32 465 811 031
                        </a>
                    </Button>

                    <div className="flex items-center gap-1.5 pl-4 border-l border-neutral-200">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "font-bold text-xs rounded-full px-3 transition-colors",
                                locale === "nl"
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "hover:bg-primary/15"
                            )}
                            onClick={() => switchLocale("nl")}
                        >
                            NL
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "font-bold text-xs rounded-full px-3 transition-colors",
                                locale === "fr"
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "hover:bg-primary/15"
                            )}
                            onClick={() => switchLocale("fr")}
                        >
                            FR
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "font-bold text-xs rounded-full px-3 transition-colors",
                                locale === "ru"
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "hover:bg-primary/15"
                            )}
                            onClick={() => switchLocale("ru")}
                        >
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
                        
                        <Button
                            asChild
                            size="lg"
                            className="w-full justify-center rounded-full bg-[#25D366] text-white hover:bg-[#22c55e] font-semibold border-0"
                        >
                            <a href="https://wa.me/32465811031" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <WhatsAppIcon className="w-5 h-5" />
                                +32 465 811 031
                            </a>
                        </Button>
                        <div className="flex items-center space-x-2 pt-4 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "rounded-full px-3 transition-colors font-bold text-xs",
                                    locale === "nl"
                                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                        : "hover:bg-primary/15"
                                )}
                                onClick={() => switchLocale("nl")}
                            >
                                NL
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "rounded-full px-3 transition-colors font-bold text-xs",
                                    locale === "fr"
                                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                        : "hover:bg-primary/15"
                                )}
                                onClick={() => switchLocale("fr")}
                            >
                                FR
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "rounded-full px-3 transition-colors font-bold text-xs",
                                    locale === "ru"
                                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                        : "hover:bg-primary/15"
                                )}
                                onClick={() => switchLocale("ru")}
                            >
                                RU
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
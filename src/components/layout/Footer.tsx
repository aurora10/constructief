import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { citiesData } from "@/data/cities";
import { Instagram, Facebook } from "lucide-react";

const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/constructief_bouw/", Icon: Instagram },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591572760518", Icon: Facebook },
];

export function Footer() {
    const t = useTranslations("Footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-neutral-50 dark:bg-neutral-900">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">Constructief</h3>
                        <p className="text-sm text-muted-foreground">
                            {t("tagline")}
                        </p>
                        <div>
                            <h4 className="font-semibold mb-3">{t("social")}</h4>
                            <div className="flex gap-2">
                                {socialLinks.map(({ label, href, Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        title={label}
                                        className="w-10 h-10 rounded-full inline-flex items-center justify-center border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-primary hover:border-primary transition-colors"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t("links")}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/kandidaten" className="hover:text-primary">{t("candidates")}</Link></li>
                            <li><Link href="/werkgevers" className="hover:text-primary">{t("employers")}</Link></li>
                            <li><Link href="/vacatures" className="hover:text-primary">{t("vacancies")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t("company")}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/over-ons" className="hover:text-primary">{t("about")}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">{t("contact")}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">{t("privacy")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t("contact")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="mailto:info@constructief.be" className="hover:text-primary transition-colors">
                                    info@constructief.be
                                </a>
                            </li>
                            <li>
                                <a href="tel:+32465811031" className="hover:text-primary transition-colors">
                                    +32 465 811031
                                </a>
                            </li>
                            <li>Antwerp, Belgium</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <h4 className="font-semibold mb-4 text-sm">{t("regions")}</h4>
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        {citiesData
                            .filter(city => ['antwerpen', 'brussel', 'gent', 'rotterdam', 'amsterdam'].includes(city.slug))
                            .map((city) => (
                            <li key={city.slug}>
                                <Link
                                    href={`/diensten/onderaannemer-${city.slug}`}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {city.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/diensten" className="font-semibold text-primary hover:underline transition-colors">
                                {t("view_all_regions")}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {currentYear} Constructief. {t("rights")}</p>
                </div>
            </div>
        </footer>
    );
}

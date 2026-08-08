import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { citiesData } from "@/data/cities";

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
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-x-4 gap-y-1 text-xs">
                        {citiesData.map((city) => (
                            <li key={city.slug}>
                                <Link
                                    href={`/diensten/onderaannemer-${city.slug}`}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {city.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {currentYear} Constructief. {t("rights")}</p>
                </div>
            </div>
        </footer>
    );
}

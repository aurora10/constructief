/**
 * The brand string, in one place.
 *
 * Why this file exists: "Constructief" is an ordinary Dutch adjective (and
 * "constructief ontslag" is a legal term), so on its own it carries no
 * distinctiveness — the site's own Search Console data shows ~1,100 impressions a
 * quarter on the bare word at 0.36% CTR. The only thing that fixes that is making
 * the *entity* consistent: the same two-word string in the structured data, the
 * page titles, the logo, the Google Business Profile, llms.txt and anywhere else
 * the company is named. Google builds one entity out of those signals, and a
 * string that drifts from surface to surface builds two weak ones.
 *
 * So: never write the name as a literal anywhere else. Import it.
 *
 * The name is deliberately NOT lengthened with a category word (Recruitment,
 * Uitzendbureau, Detachering). A category suffix is shared with hundreds of
 * competitors and adds no distinctiveness; the category is carried instead by the
 * localized descriptor under the logo (see the `Brand` namespace in the message
 * files), which can say something different in Dutch, French and Russian.
 */
export const BRAND = {
    /** The brand, as it appears in the logo, titles and structured data. */
    name: 'Constructief Bouw',
    /**
     * Shorter forms a searcher may still type. Declared as alternateName so Google
     * ties "Constructief" — and mis-spellings of the sector fund Constructiv — to
     * the same entity instead of splitting them.
     */
    alternateNames: ['Constructief', 'Constructief Bouw België'],
    url: 'https://constructief-bouw.be',
    /**
     * Canonical Google Business Profile link, emitted into Organization.sameAs.
     *
     * Empty until it can be verified. A share URL copied out of Google Search is
     * not usable (it is session-bound: sxsrf, ved, stick), and the CID can be
     * derived from that token but cannot be confirmed to point at this listing —
     * Google Maps answers 200 with a JavaScript shell for any CID, including wrong
     * ones. A wrong sameAs merges this entity with a different business, which is
     * worse than having no link at all, so it stays empty until the real URL is here.
     *
     * Where to copy it from: Google Business Profile → your profile → "Share" /
     * "Profiel delen". That yields a stable https://maps.app.goo.gl/... or
     * https://g.page/... link. The Maps address-bar URL of the listing also works.
     */
    googleBusinessProfile: '',
    socialProfiles: [
        'https://www.instagram.com/constructief_bouw/',
        'https://www.facebook.com/profile.php?id=61591572760518',
    ],
    /**
     * Registered legal name, for Organization.legalName. Left unset on purpose:
     * guessing it would put a wrong legal entity into the structured data. Fill it
     * in from the KBO/BTW registration and it will be emitted automatically.
     */
    legalName: '' as string,
} as const;

/** Marketing site origin, used for canonicals, sitemap and structured data. */
export const BASE_URL = BRAND.url;

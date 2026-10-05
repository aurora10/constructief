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
     * Google Business Profile, as handed out by Google's own "Share" button.
     *
     * Verified before being trusted: this short link redirects through
     * google.com/share.google to a Google Search URL carrying
     * `kgmid=/g/11n3b5wb3g` and `source=sh/x/loc/uni/...` — the /loc/ segment means
     * Google resolved it to a local listing, so it is this business's profile and not
     * a generic search result. The session parameters in that resolved URL (sxsrf,
     * ved, stick) are per-session and are deliberately not stored here.
     */
    googleBusinessProfile: 'https://share.google/5ho6ek4gkfJWMTVyP',
    /**
     * Google Knowledge Graph ID for this business (the `kgmid` above).
     *
     * This is the durable half: the share link is a shortener, but the MID is the
     * entity itself and does not change. Emitted as a schema.org identifier, which is
     * what helps Google merge the site, the social profiles and the Business Profile
     * into one entity instead of three weak ones. Sourced from Google, not invented.
     */
    googleKnowledgeGraphId: '/g/11n3b5wb3g',
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

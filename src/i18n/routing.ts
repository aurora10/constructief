import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported.
    // en is a full sibling of nl/fr: same B2B audience, translated copy. ru stays
    // the separate worker cluster — the hreflang rules live in src/lib/seo.ts.
    locales: ['nl', 'fr', 'en', 'ru'],

    // Used when no locale matches
    defaultLocale: 'nl'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);

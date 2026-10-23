import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Locale redirects must be PERMANENT.
 *
 * next-intl answers an unprefixed path (notably "/") with a 307 to the detected
 * locale. A temporary redirect tells Google to keep the source URL as a canonical
 * candidate, so the homepage never consolidated on /nl: Search Console reported
 * /nl as "Duplicate, Google chose a different canonical" and named
 * https://www.constructief-bouw.be/ — the root of a 308 (www→apex) followed by a 307
 * (apex→/nl) chain. The crawl that produced that verdict was 2026-10-16, i.e. after
 * /nl had already declared its self-canonical, so the 307 is the live cause.
 *
 * The language mapping is permanent by design here (each locale has a stable URL and
 * the whole site, sitemap and hreflang set already point at it), so we re-emit the
 * redirect as 308. The target still depends on the visitor's language, so the
 * response declares Vary: Accept-Language — crawlers that send no language header
 * get the default locale, which is exactly the x-default we publish.
 *
 * Everything else (locale-prefixed paths) passes through untouched.
 */
/** /kandidaten is retired: the candidate funnel was replaced by the crew intake. */
const RETIRED_PREFIXES: Record<string, string> = {
    kandidaten: 'onderaannemer-inschrijven',
};

export default function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const maybeLocale = segments[0];
    const hasLocale = routing.locales.includes(maybeLocale as never);
    const firstSegment = hasLocale ? segments[1] : segments[0];

    if (firstSegment && RETIRED_PREFIXES[firstSegment]) {
        const url = request.nextUrl.clone();
        url.pathname = `/${hasLocale ? maybeLocale : routing.defaultLocale}/${RETIRED_PREFIXES[firstSegment]}`;
        url.search = '';
        return NextResponse.redirect(url, 308);
    }

    const response = intlMiddleware(request);

    if (response.status === 307 || response.status === 302) {
        const headers = new Headers(response.headers);
        headers.set('Vary', 'Accept-Language');
        return new NextResponse(null, { status: 308, headers });
    }

    return response;
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(nl|ru|fr)/:path*'],
};

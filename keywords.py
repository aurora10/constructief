#!/usr/bin/env python3
"""
SEO keyword seed for the Constructief programmatic pages.

This is intended to be consumed/updated by "Agent 3" for keyword analysis. The
structure is deliberately simple so it can be extended without breaking anything:
each entry has a URL and the target keywords for that URL (plus a short intent).

NOTE ON /nl/ PREFIX: `nl` is the DUTCH LANGUAGE locale, not "Netherlands". Dutch
market cities (Amsterdam/Rotterdam/Den Haag/Utrecht) are served in Dutch under
/nl/; the hreflang pairing handles the country intent. Keep these separate from
the Belgian cities (same /nl/ locale, different country/market).
"""

#: High-value city pages (Belgian flagship + Dutch market) that are advertised
#: in the sitemap. Each is served as a Dutch-language (/nl/) page.
CITY_PAGES = [
    # Belgian flagship
    "nl/diensten/onderaannemer-antwerpen",
    "nl/diensten/onderaannemer-gent",
    "nl/diensten/onderaannemer-leuven",
    "nl/diensten/onderaannemer-brussel",
    # Dutch market (already showing GSC demand)
    "nl/diensten/onderaannemer-amsterdam",
    "nl/diensten/onderaannemer-rotterdam",
    "nl/diensten/onderaannemer-den-haag",
    "nl/diensten/onderaannemer-utrecht",
]

#: Trade + city pages (only for the trades we actually deliver, flagship cities).
TRADE_CITY_PAGES = [
    "nl/diensten/onderaannemer-gevel-antwerpen",
    "nl/diensten/onderaannemer-gevel-gent",
    "nl/diensten/onderaannemer-gevel-leuven",
    "nl/diensten/onderaannemer-gevel-brussel",
    "nl/diensten/onderaannemer-renovatie-antwerpen",
    "nl/diensten/onderaannemer-renovatie-gent",
    "nl/diensten/onderaannemer-renovatie-leuven",
    "nl/diensten/onderaannemer-renovatie-brussel",
]

#: French opportunity page (no direct competitor in GSC).
FR_PAGE = "fr/sous-traitance-batiment"

#: Commercial / money keywords to extract from and target on each page.
COMMERCIAL_KEYWORDS = [
    "onderaannemer bouw inhuren",
    "bouwploeg inhuren",
    "detachering bouwpersoneel",
    "gescreende bouwploegen",
    "legale bouwploeg a1 limosa",
    "poolse arbeiders inhuren",
    "gevelrenovatie aannemer",
    "renovatieploeg inhuren",
    "sous-traitance bâtiment",
]

#: Keyword map: URL path -> list of primary keywords. Extend this in Agent 3.
KEYWORDS = {
    CITY_PAGES[0]: ["onderaannemer antwerpen", "bouwploeg inhuren antwerpen"],
    CITY_PAGES[4]: ["onderaannemer amsterdam", "bouwploeg inhuren amsterdam"],
    CITY_PAGES[5]: ["onderaannemer rotterdam", "bouwploeg inhuren rotterdam"],
    CITY_PAGES[6]: ["onderaannemer den haag", "bouwploeg inhuren den haag"],
    CITY_PAGES[7]: ["onderaannemer utrecht", "bouwploeg inhuren utrecht"],
    FR_PAGE: ["sous-traitance bâtiment", "sous-traiter main d'œuvre"],
}

if __name__ == "__main__":
    print(f"CITY_PAGES: {len(CITY_PAGES)}")
    print(f"TRADE_CITY_PAGES: {len(TRADE_CITY_PAGES)}")
    print(f"COMMERCIAL_KEYWORDS: {len(COMMERCIAL_KEYWORDS)}")

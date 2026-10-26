import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            // Canonical host is the APEX domain (matches every canonical tag + the
            // sitemap). The www host was also serving the same pages with a 200,
            // which made Google treat the apex pages as duplicates
            // ("Duplicate, Google chose different canonical than user").
            // A 308 (permanent) consolidates everything onto the apex host.
            {
                source: '/:path*',
                has: [{ type: 'host' as const, value: 'www.constructief-bouw.be' }],
                destination: 'https://constructief-bouw.be/:path*',
                permanent: true,
            },

            // Pages that existed before the site moved to locale prefixes. Google still
            // knows these URLs and was reporting them as "Not found (404)"; they now
            // consolidate onto the Dutch version instead. One hop each, including
            // sub-paths (/nieuws/<slug> -> /nl/nieuws/<slug>).
            ...['werkgevers', 'vacatures', 'nieuws', 'over-ons', 'contact', 'privacy', 'diensten', 'onderaannemer-inschrijven']
                .flatMap((page) => [
                    { source: `/${page}`, destination: `/nl/${page}`, permanent: true },
                    { source: `/${page}/:path*`, destination: `/nl/${page}/:path*`, permanent: true },
                ]),

            // The retired candidate funnel goes straight to the crew intake (one hop, not
            // via /nl/kandidaten which would chain two redirects).
            { source: '/kandidaten', destination: '/nl/onderaannemer-inschrijven', permanent: true },
            { source: '/kandidaten/:path*', destination: '/nl/onderaannemer-inschrijven', permanent: true },
        ];
    },
};

export default withNextIntl(nextConfig);

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
        ];
    },
};

export default withNextIntl(nextConfig);

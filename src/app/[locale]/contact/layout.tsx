import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/seo';

// Route layout for /contact (the page itself is a client component, so it cannot
// export generateMetadata). Self-referencing canonical + hreflang: without this
// Google picked its own canonical for the nl/fr/ru duplicates.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: pageAlternates(locale, '/contact') };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

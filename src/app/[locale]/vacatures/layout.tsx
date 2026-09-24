import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/seo';

// Route layout for /vacatures (the page itself is a client component, so it can't
// export generateMetadata). Self-referencing canonical; RU worker cluster gets
// x-default → self (standalone), never collapsed into /nl.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: pageAlternates(locale, '/vacatures') };
}

export default function VacaturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

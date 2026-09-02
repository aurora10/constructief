import type { Metadata } from 'next';

// Route layout for /vacatures (the page itself is a client component, so it can't
// export generateMetadata). Self-referencing canonical; RU worker cluster gets
// x-default → self (standalone), never collapsed into /nl.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const canonical = `https://constructief-bouw.be/${locale}/vacatures`;
    const alternates: Metadata['alternates'] = { canonical };
    if (locale === 'ru') {
        alternates.languages = { 'x-default': canonical };
    }
    return { alternates };
}

export default function VacaturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { cache } from 'react';
import type { Metadata } from 'next';
import { findRowById } from '@/lib/googleSheets';

// Cache profile pages for 1 hour
export const revalidate = 3600;

// Prevent search engines from indexing private blind profiles
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

const getCandidate = cache(async (id: string) => {
    try {
        const row = await findRowById('Candidates', id);
        if (!row) return null;

        return {
            // Map Google Sheets columns to the expected shape
            // Column order: Id | Name | Trade | Experience | Status | Phone | Email | Recruiter Note
            trade: row['Trade'] || '',
            experience: Number(row['Experience']) || 0,
            notes: row['Recruiter Note'] || '',
            status: row['Status'] || '',
            id,
        };
    } catch (error) {
        console.error('Google Sheets Error:', error);
        return null;
    }
});

export default async function BlindProfilePage({ params }: { params: { id: string } }) {
    const candidate = await getCandidate(params.id);

    if (!candidate) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <PageHeader
                title={`${candidate.trade} (${candidate.experience} jaar ervaring)`}
                subtitle="Geverifieerd profiel"
            />

            <div className="container mx-auto px-4 mt-8 max-w-3xl">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Over deze vakman</h2>
                        <div className="prose prose-blue max-w-none text-gray-600">
                            <p className="whitespace-pre-line text-lg leading-relaxed">{candidate.notes || "Geen beschrijving beschikbaar."}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {candidate.status === 'New' ? 'Beschikbaar' : candidate.status}
                            </span>
                        </div>
                        <a
                            href={`/werkgevers?ref=${candidate.id}`}
                            className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Gesprek Aanvragen
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
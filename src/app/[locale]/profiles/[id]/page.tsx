
import { notFound } from 'next/navigation';
import Airtable from 'airtable';
import { PageHeader } from '@/components/layout/PageHeader';

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
    process.env.AIRTABLE_BASE_ID!
);

async function getCandidate(id: string) {
    try {
        const record = await base('Candidates').find(id);
        return {
            trade: record.get('Trade') as string,
            experience: record.get('Experience') as number,
            notes: record.get('Recruiter Note') as string,
            status: record.get('Status') as string,
            id: record.id
        };
    } catch (error) {
        return null;
    }
}

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


'use client';

import { useState } from 'react';

export function CandidateForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            trade: formData.get('trade'),
            experience: formData.get('experience'),
            email: formData.get('email'),
            notes: formData.get('notes'),
        };

        try {
            const res = await fetch('/api/candidates', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error('Submission failed');

            setStatus('success');
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-xl">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Direct Inschrijven</h2>
                    <p className="mb-6 text-gray-600">Geen account nodig. Vul je gegevens in en wij bellen je als we een klus hebben.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                            <input name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jan de Vries" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vakgebied</label>
                                <select name="trade" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="">Kies vakgebied...</option>
                                    <option value="Electrician">Elektricien</option>
                                    <option value="Carpenter">Timmerman</option>
                                    <option value="Bricklayer">Metselaar</option>
                                    <option value="Painter">Schilder</option>
                                    <option value="Plumber">Loodgieter</option>
                                    <option value="Other">Anders</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jaren Ervaring</label>
                                <input name="experience" type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="5" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer (WhatsApp)</label>
                            <input name="phone" required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="06 12345678" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optioneel)</label>
                            <input name="email" type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="jan@example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opmerkingen / Beschikbaarheid</label>
                            <textarea name="notes" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Ik ben per direct beschikbaar..." />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Versturen...' : 'Inschrijven'}
                        </button>

                        {status === 'success' && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                                Bedankt! We hebben je gegevens ontvangen en nemen binnen 24 uur contact op.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
                                Er ging iets mis. Probeer het later opnieuw of bel ons direct.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

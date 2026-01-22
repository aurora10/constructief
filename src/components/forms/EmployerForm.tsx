
'use client';

import { useState } from 'react';

export function EmployerForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            companyName: formData.get('companyName'),
            contactPerson: formData.get('contactPerson'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            trade: formData.get('trade'),
            url: formData.get('url'),
        };

        try {
            const res = await fetch('/api/requests', {
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
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Personeel Aanvragen</h2>
                    <p className="mb-6 text-gray-600">Vertel ons wat je nodig hebt. Wij matchen de juiste vakmensen.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam</label>
                            <input name="companyName" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Bouwbedrijf Jansen BV" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website (URL)</label>
                            <input name="url" type="url" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://bedrijf.nl" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon</label>
                            <input name="contactPerson" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Naam contactpersoon" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input name="email" required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="info@bedrijf.nl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                                <input name="phone" type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="06 12345678" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stad / Locatie</label>
                                <input name="city" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Amsterdam" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gezocht Vakgebied</label>
                                <select name="trade" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="">Kies...</option>
                                    <option value="Electrician">Elektricien</option>
                                    <option value="Carpenter">Timmerman</option>
                                    <option value="Bricklayer">Metselaar</option>
                                    <option value="Painter">Schilder</option>
                                    <option value="Plumber">Loodgieter</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Versturen...' : 'Aanvraag Versturen'}
                        </button>

                        {status === 'success' && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                                Aanvraag ontvangen! We nemen zo snel mogelijk contact op om de details te bespreken.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
                                Er ging iets mis. Probeer het later opnieuw.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

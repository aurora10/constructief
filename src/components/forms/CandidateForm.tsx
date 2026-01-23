'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function CandidateForm() {
    const t = useTranslations('CandidateForm');
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
        <section id="register" className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-xl">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('title')}</h2>
                    <p className="mb-6 text-gray-600">{t('subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                            <input name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('name_placeholder')} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('trade')}</label>
                                <select name="trade" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="">{t('trade_placeholder')}</option>
                                    <option value="Electrician">{t('trade_electrician')}</option>
                                    <option value="Carpenter">{t('trade_carpenter')}</option>
                                    <option value="Bricklayer">{t('trade_bricklayer')}</option>
                                    <option value="Painter">{t('trade_painter')}</option>
                                    <option value="Plumber">{t('trade_plumber')}</option>
                                    <option value="Other">{t('trade_other')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('experience')}</label>
                                <input name="experience" type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('experience_placeholder')} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                            <input name="phone" required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('phone_placeholder')} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                            <input name="email" type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('email_placeholder')} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
                            <textarea name="notes" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder={t('notes_placeholder')} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? t('submitting') : t('submit')}
                        </button>

                        {status === 'success' && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                                {t('success')}
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
                                {t('error')}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

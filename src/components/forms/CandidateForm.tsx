'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Trade clusters for Belgian construction market
// Values MUST match Airtable Multiple Select options exactly
const TRADE_CLUSTERS = {
    structural: [
        'Metser',
        'Bekister',
        'Ijzervlechter',
        'Lasser (TIG/MIG/MAG)',
        'Grondwerker',
        'Kraanmachinist (Torenkraan)',
        'Graafkraanmachinist',
        'Wegenwerker / Klinkerlegger',
        'Stellingbouwer',
    ],
    roofing: [
        'Dakwerker (Platte daken / EPDM)',
        'Dakwerker (Hellende daken)',
    ],
    finishing: [
        'Schilder',
        'Stukadoor',
        'Tegelzetter / Vloerder',
        'Gyproc plaatser',
        'Schrijnwerker (Binnen)',
        'Schrijnwerker (Buiten / Atelier)',
        'Monteur Ramen en Deuren',
    ],
    technical: [
        'Elektricien (Residentieel)',
        'Elektricien (Industrieel)',
        'Loodgieter / Sanitair',
        'HVAC Technieker',
    ],
    management: [
        'Ploegbaas',
        'Werfleider',
        'Handlanger',
    ],
} as const;

type TradeKey = typeof TRADE_CLUSTERS[keyof typeof TRADE_CLUSTERS][number];

// Map Airtable values to translation keys
const TRADE_TRANSLATION_KEYS: Record<string, string> = {
    'Metser': 'trade_metser',
    'Bekister': 'trade_bekister',
    'Ijzervlechter': 'trade_ijzervlechter',
    'Lasser (TIG/MIG/MAG)': 'trade_lasser',
    'Grondwerker': 'trade_grondwerker',
    'Kraanmachinist (Torenkraan)': 'trade_kraanmachinist',
    'Graafkraanmachinist': 'trade_graafkraanmachinist',
    'Wegenwerker / Klinkerlegger': 'trade_wegenwerker',
    'Stellingbouwer': 'trade_stellingbouwer',
    'Dakwerker (Platte daken / EPDM)': 'trade_dakwerker_plat',
    'Dakwerker (Hellende daken)': 'trade_dakwerker_hellend',
    'Schilder': 'trade_schilder',
    'Stukadoor': 'trade_stukadoor',
    'Tegelzetter / Vloerder': 'trade_tegelzetter',
    'Gyproc plaatser': 'trade_gyproc',
    'Schrijnwerker (Binnen)': 'trade_schrijnwerker_binnen',
    'Schrijnwerker (Buiten / Atelier)': 'trade_schrijnwerker_buiten',
    'Monteur Ramen en Deuren': 'trade_monteur_ramen',
    'Elektricien (Residentieel)': 'trade_elektricien_resi',
    'Elektricien (Industrieel)': 'trade_elektricien_ind',
    'Loodgieter / Sanitair': 'trade_loodgieter',
    'HVAC Technieker': 'trade_hvac',
    'Ploegbaas': 'trade_ploegbaas',
    'Werfleider': 'trade_werfleider',
    'Handlanger': 'trade_handlanger',
};

export function CandidateForm() {
    const t = useTranslations('CandidateForm');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [selectedTrades, setSelectedTrades] = useState<Set<string>>(new Set());
    const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set(['structural']));

    function toggleCluster(cluster: string) {
        setExpandedClusters(prev => {
            const next = new Set(prev);
            if (next.has(cluster)) {
                next.delete(cluster);
            } else {
                next.add(cluster);
            }
            return next;
        });
    }

    function toggleTrade(trade: string) {
        setSelectedTrades(prev => {
            const next = new Set(prev);
            if (next.has(trade)) {
                next.delete(trade);
            } else {
                next.add(trade);
            }
            return next;
        });
    }

    function getTradeLabel(trade: string): string {
        const key = TRADE_TRANSLATION_KEYS[trade];
        return key ? t(key) : trade;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            trades: Array.from(selectedTrades),
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
            setSelectedTrades(new Set());
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    const clusterKeys = Object.keys(TRADE_CLUSTERS) as (keyof typeof TRADE_CLUSTERS)[];

    return (
        <section id="register" className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-xl 2xl:max-w-2xl">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('title')}</h2>
                    <p className="mb-6 text-gray-600">{t('subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                            <input name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('name_placeholder')} />
                        </div>

                        {/* Trade Selection - Grouped Checkboxes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('trades_label')}</label>
                            <p className="text-xs text-gray-500 mb-3">{t('trades_hint')}</p>

                            <div className="space-y-2 border rounded-lg overflow-hidden">
                                {clusterKeys.map((clusterKey) => {
                                    const isExpanded = expandedClusters.has(clusterKey);
                                    const trades = TRADE_CLUSTERS[clusterKey];
                                    const selectedInCluster = trades.filter(t => selectedTrades.has(t)).length;

                                    return (
                                        <div key={clusterKey} className="border-b last:border-b-0">
                                            {/* Cluster Header */}
                                            <button
                                                type="button"
                                                onClick={() => toggleCluster(clusterKey)}
                                                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                            >
                                                <span className="font-medium text-gray-800">
                                                    {t(`cluster_${clusterKey}`)}
                                                    {selectedInCluster > 0 && (
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                            {selectedInCluster}
                                                        </span>
                                                    )}
                                                </span>
                                                <svg
                                                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Trade Options */}
                                            {isExpanded && (
                                                <div className="px-4 py-2 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {trades.map((trade) => (
                                                        <label
                                                            key={trade}
                                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedTrades.has(trade)
                                                                ? 'bg-blue-50 border border-blue-200'
                                                                : 'hover:bg-gray-50 border border-transparent'
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedTrades.has(trade)}
                                                                onChange={() => toggleTrade(trade)}
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm text-gray-700">{getTradeLabel(trade)}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Selected Trades Summary */}
                            {selectedTrades.size > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {Array.from(selectedTrades).map((trade) => (
                                        <span
                                            key={trade}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                        >
                                            {getTradeLabel(trade)}
                                            <button
                                                type="button"
                                                onClick={() => toggleTrade(trade)}
                                                className="hover:text-blue-900"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('experience')}</label>
                            <input name="experience" type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('experience_placeholder')} />
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
                            disabled={loading || selectedTrades.size === 0}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading || selectedTrades.size === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? t('submitting') : t('submit')}
                        </button>

                        {selectedTrades.size === 0 && (
                            <p className="text-xs text-amber-600 text-center">{t('select_trade_hint')}</p>
                        )}

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

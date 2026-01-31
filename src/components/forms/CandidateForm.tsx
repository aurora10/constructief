'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { User, Phone, Mail, FileText, Check, ChevronDown, Briefcase } from 'lucide-react';

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
                <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-8 md:p-10 transition-all hover:shadow-lg">
                    <h2 className="text-3xl font-extrabold mb-2 text-slate-900">{t('title')}</h2>
                    <p className="mb-8 text-gray-600">{t('subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('name')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <input
                                    name="name"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                    placeholder={t('name_placeholder')}
                                />
                            </div>
                        </div>

                        {/* Trade Selection - Grouped Checkboxes */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{t('trades_label')}</label>
                            <p className="text-xs text-gray-500 mb-3 ml-1">{t('trades_hint')}</p>

                            <div className="space-y-2 border border-gray-200 rounded-xl overflow-hidden bg-white">
                                {clusterKeys.map((clusterKey) => {
                                    const isExpanded = expandedClusters.has(clusterKey);
                                    const trades = TRADE_CLUSTERS[clusterKey];
                                    const selectedInCluster = trades.filter(t => selectedTrades.has(t)).length;

                                    return (
                                        <div key={clusterKey} className="border-b border-gray-100 last:border-b-0">
                                            {/* Cluster Header */}
                                            <button
                                                type="button"
                                                onClick={() => toggleCluster(clusterKey)}
                                                className="w-full px-5 py-3 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100 transition-colors text-left"
                                            >
                                                <span className="font-medium text-gray-800 flex items-center gap-2">
                                                    {t(`cluster_${clusterKey}`)}
                                                    {selectedInCluster > 0 && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                                                            {selectedInCluster}
                                                        </span>
                                                    )}
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {/* Trade Options */}
                                            {isExpanded && (
                                                <div className="px-5 py-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                                                    {trades.map((trade) => (
                                                        <label
                                                            key={trade}
                                                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${selectedTrades.has(trade)
                                                                ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                                                : 'hover:bg-gray-50 border border-transparent'
                                                                }`}
                                                        >
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTrades.has(trade) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {selectedTrades.has(trade) && <Check className="w-3.5 h-3.5 text-white" />}
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedTrades.has(trade)}
                                                                    onChange={() => toggleTrade(trade)}
                                                                    className="hidden"
                                                                />
                                                            </div>
                                                            <span className={`text-sm ${selectedTrades.has(trade) ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>{getTradeLabel(trade)}</span>
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
                                <div className="mt-3 flex flex-wrap gap-2 pt-2">
                                    {Array.from(selectedTrades).map((trade) => (
                                        <span
                                            key={trade}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium rounded-full animate-in zoom-in-95 duration-200"
                                        >
                                            {getTradeLabel(trade)}
                                            <button
                                                type="button"
                                                onClick={() => toggleTrade(trade)}
                                                className="hover:text-blue-900 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
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

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('experience')}</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <input
                                    name="experience"
                                    type="number"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                    placeholder={t('experience_placeholder')}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('phone')}</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <input
                                    name="phone"
                                    required
                                    type="tel"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                    placeholder={t('phone_placeholder')}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                    placeholder={t('email_placeholder')}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('notes')}</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5 pointer-events-none" />
                                <textarea
                                    name="notes"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                    rows={3}
                                    placeholder={t('notes_placeholder')}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || selectedTrades.size === 0}
                            className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-200 transform ${loading || selectedTrades.size === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('submitting')}
                                </span>
                            ) : t('submit')}
                        </button>

                        {selectedTrades.size === 0 && (
                            <p className="text-xs text-amber-600 text-center font-medium animate-pulse">{t('select_trade_hint')}</p>
                        )}

                        {status === 'success' && (
                            <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-center font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
                                {t('success')}
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-center font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
                                {t('error')}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

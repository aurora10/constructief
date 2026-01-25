'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Search, X, Check } from 'lucide-react';

// Exact same 25 items as in CandidateForm for consistency
const TRADES = [
    'Metser', 'Bekister', 'Ijzervlechter', 'Lasser (TIG/MIG/MAG)',
    'Grondwerker', 'Kraanmachinist (Torenkraan)', 'Graafkraanmachinist',
    'Wegenwerker / Klinkerlegger', 'Stellingbouwer',
    'Dakwerker (Platte daken / EPDM)', 'Dakwerker (Hellende daken)',
    'Schilder', 'Stukadoor', 'Tegelzetter / Vloerder', 'Gyproc plaatser',
    'Schrijnwerker (Binnen)', 'Schrijnwerker (Buiten / Atelier)',
    'Monteur Ramen en Deuren', 'Elektricien (Residentieel)',
    'Elektricien (Industrieel)', 'Loodgieter / Sanitair',
    'HVAC Technieker', 'Ploegbaas', 'Werfleider', 'Handlanger'
];

// Map Airtable values to translation keys (matching CandidateForm)
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

export function EmployerForm() {
    const t = useTranslations('EmployersPage');
    const tForm = useTranslations('CandidateForm'); // Reuse trade translations
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Multi-Select Searchable Select State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredTrades = TRADES.filter(trade => {
        const localizedTrade = tForm(TRADE_TRANSLATION_KEYS[trade] || trade).toLowerCase();
        return localizedTrade.includes(searchTerm.toLowerCase()) || trade.toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTrade = (trade: string) => {
        setSelectedTrades(prev =>
            prev.includes(trade)
                ? prev.filter(t => t !== trade)
                : [...prev, trade]
        );
    };

    const removeTrade = (trade: string) => {
        setSelectedTrades(prev => prev.filter(t => t !== trade));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (selectedTrades.length === 0) {
            alert(t('trade_placeholder'));
            return;
        }

        setLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            companyName: formData.get('companyName'),
            url: formData.get('url'),
            contactPerson: formData.get('contactPerson'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            trades: selectedTrades, // Sending as array
            amount: formData.get('amount'),
            projectType: formData.get('projectType'),
            description: formData.get('description'),
            startDate: formData.get('startDate'),
        };

        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error('Submission failed');

            setStatus('success');
            setSearchTerm('');
            setSelectedTrades([]);
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
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">{t('form_title')}</h2>
                    <p className="mb-6 text-gray-600">{t('form_subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Company Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_name')}</label>
                                <input name="companyName" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('company_name_placeholder')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('url')}</label>
                                <input name="url" type="url" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('url_placeholder')} />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_person')}</label>
                                <input name="contactPerson" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('contact_person_placeholder')} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                                    <input name="email" required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('email_placeholder')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                                    <input name="phone" type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('phone_placeholder')} />
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-100" />

                        {/* Project Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('trade_label')}</label>
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex flex-wrap gap-1 items-center overflow-hidden">
                                            {selectedTrades.length > 0 ? (
                                                <span className="text-gray-900 text-sm">
                                                    {selectedTrades.length === 1
                                                        ? t('selected_one')
                                                        : t('selected_multiple', { count: selectedTrades.length })}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">{t('trade_placeholder')}</span>
                                            )}
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                                            <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
                                                <Search className="h-4 w-4 text-gray-400" />
                                                <input
                                                    autoFocus
                                                    className="w-full bg-transparent outline-none text-sm"
                                                    placeholder={t('trade_placeholder')}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="overflow-y-auto">
                                                {filteredTrades.length > 0 ? (
                                                    filteredTrades.map((trade) => (
                                                        <div
                                                            key={trade}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleTrade(trade);
                                                            }}
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors flex items-center justify-between"
                                                        >
                                                            <span>{tForm(TRADE_TRANSLATION_KEYS[trade] || trade)}</span>
                                                            {selectedTrades.includes(trade) && (
                                                                <Check className="h-4 w-4 text-blue-600" />
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500 italic">Geen resultaten</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Selected Trades Tags */}
                                {selectedTrades.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedTrades.map(trade => (
                                            <span
                                                key={trade}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                                            >
                                                {tForm(TRADE_TRANSLATION_KEYS[trade] || trade)}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTrade(trade)}
                                                    className="hover:text-blue-900 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount_label')}</label>
                                    <input name="amount" type="number" min="1" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('amount_placeholder')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('project_type_label')}</label>
                                    <select name="projectType" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                        <option value="">{t('project_type_placeholder')}</option>
                                        <option value="Nieuwbouw">{t('project_type_new')}</option>
                                        <option value="Renovatie">{t('project_type_renovation')}</option>
                                        <option value="Industrieel">{t('project_type_industrial')}</option>
                                        <option value="Burgerlijk (Civil/Infra)">{t('project_type_civil')}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
                                <input name="city" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('city_placeholder')} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('description_label')}</label>
                                <textarea
                                    name="description"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                    placeholder={t('description_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('start_date_label')}</label>
                                <input name="startDate" type="date" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-md transition-all active:scale-[0.98] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? t('submitting') : t('submit')}
                            </button>
                        </div>

                        {status === 'success' && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-2">
                                {t('success')}
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center font-medium">
                                {t('error')}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

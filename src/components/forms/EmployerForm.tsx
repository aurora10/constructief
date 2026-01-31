'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Search, X, Check, Building2, Globe, User, Mail, Phone, MapPin, FileText, Briefcase, Calendar } from 'lucide-react';

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
            <div className="container mx-auto px-4 max-w-xl 2xl:max-w-2xl">
                <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-8 md:p-10 transition-all hover:shadow-lg">
                    <h2 className="text-3xl font-extrabold mb-2 text-slate-900">{t('form_title')}</h2>
                    <p className="mb-8 text-gray-600">{t('form_subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Info */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('company_name')}</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <input
                                        name="companyName"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                        placeholder={t('company_name_placeholder')}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('url')}</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <input
                                        name="url"
                                        type="url"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                        placeholder={t('url_placeholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('contact_person')}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <input
                                        name="contactPerson"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                        placeholder={t('contact_person_placeholder')}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('email')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <input
                                            name="email"
                                            required
                                            type="email"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                            placeholder={t('email_placeholder')}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('phone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <input
                                            name="phone"
                                            type="tel"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                            placeholder={t('phone_placeholder')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-8 border-gray-100" />

                        {/* Project Details */}
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('trade_label')}</label>
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none bg-white flex items-center justify-between cursor-pointer transition-all duration-200 ${isDropdownOpen ? 'ring-4 ring-blue-500/10 border-blue-500' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex flex-wrap gap-1 items-center overflow-hidden">
                                            {selectedTrades.length > 0 ? (
                                                <span className="text-gray-900 text-sm font-medium">
                                                    {selectedTrades.length === 1
                                                        ? t('selected_one')
                                                        : t('selected_multiple', { count: selectedTrades.length })}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">{t('trade_placeholder')}</span>
                                            )}
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2">
                                            <div className="p-3 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                                                <Search className="h-4 w-4 text-gray-400" />
                                                <input
                                                    autoFocus
                                                    className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                                                    placeholder={t('trade_placeholder')}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="overflow-y-auto p-1">
                                                {filteredTrades.length > 0 ? (
                                                    filteredTrades.map((trade) => (
                                                        <div
                                                            key={trade}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleTrade(trade);
                                                            }}
                                                            className="px-3 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer text-sm transition-colors flex items-center justify-between group"
                                                        >
                                                            <span className="text-gray-700 group-hover:text-blue-700">{tForm(TRADE_TRANSLATION_KEYS[trade] || trade)}</span>
                                                            {selectedTrades.includes(trade) && (
                                                                <Check className="h-4 w-4 text-blue-600" />
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500 italic text-center">Geen resultaten</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Selected Trades Tags */}
                                {selectedTrades.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {selectedTrades.map(trade => (
                                            <span
                                                key={trade}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium rounded-full animate-in zoom-in-95 duration-200"
                                            >
                                                {tForm(TRADE_TRANSLATION_KEYS[trade] || trade)}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTrade(trade)}
                                                    className="hover:text-blue-900 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col h-full gap-1">
                                    <label className="block text-sm font-semibold text-gray-700 ml-1">{t('amount_label')}</label>
                                    <div className="relative mt-auto">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <input
                                            name="amount"
                                            type="number"
                                            min="1"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                            placeholder={t('amount_placeholder')}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col h-full gap-1">
                                    <label className="block text-sm font-semibold text-gray-700 ml-1">{t('project_type_label')}</label>
                                    <div className="relative mt-auto">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <select
                                            name="projectType"
                                            required
                                            className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 appearance-none text-gray-700"
                                        >
                                            <option value="">{t('project_type_placeholder')}</option>
                                            <option value="Nieuwbouw">{t('project_type_new')}</option>
                                            <option value="Renovatie">{t('project_type_renovation')}</option>
                                            <option value="Industrieel">{t('project_type_industrial')}</option>
                                            <option value="Burgerlijk (Civil/Infra)">{t('project_type_civil')}</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('city')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <input
                                        name="city"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
                                        placeholder={t('city_placeholder')}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('description_label')}</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <textarea
                                        name="description"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 min-h-[120px]"
                                        placeholder={t('description_placeholder')}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">{t('start_date_label')}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <input
                                        name="startDate"
                                        type="date"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900"
                                        placeholder="dd/mm/yyyy"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-200 transform ${loading
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
                        </div>

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

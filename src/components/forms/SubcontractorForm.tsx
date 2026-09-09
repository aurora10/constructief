"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Turnstile } from "@marsidev/react-turnstile";
import {
    ChevronDown,
    User,
    Phone,
    Wrench,
    FileCheck2,
    Truck,
    MapPin,
    Euro,
    Languages,
    Users,
    Clock,
    ImagePlus,
    X,
} from "lucide-react";

interface PhotoFile {
    name: string;
    mimeType: string;
    dataBase64: string; // raw base64 (no data: prefix)
}

const MAX_PHOTOS = 3;
const MAX_EDGE = 1280; // downscale so total payload stays well under platform body limits

function readAsDownscaledJpeg(file: File): Promise<PhotoFile> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("read failed"));
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
                const w = Math.round(img.width * scale);
                const h = Math.round(img.height * scale);
                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("no canvas"));
                ctx.drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                resolve({
                    name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
                    mimeType: "image/jpeg",
                    dataBase64: dataUrl.split(",")[1] ?? "",
                });
            };
            img.onerror = () => reject(new Error("image decode failed"));
            img.src = String(reader.result);
        };
        reader.readAsDataURL(file);
    });
}

const inputCls =
    "w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200";
const selectCls =
    "w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 appearance-none text-gray-700";
const labelCls = "block text-sm font-semibold text-gray-700 mb-1 ml-1";
const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none";

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="relative">
            {icon}
            {children}
        </div>
    );
}

export function SubcontractorForm() {
    const t = useTranslations("SubcontractorForm");
    const legalOptions = (t.raw("legal_status_options") as { value: string; label: string }[]) ?? [];
    const carOptions = (t.raw("car_and_tools_options") as { value: string; label: string }[]) ?? [];
    const teamOptions = (t.raw("team_size_options") as { value: string; label: string }[]) ?? [];
    const availabilityOptions = (t.raw("availability_options") as { value: string; label: string }[]) ?? [];
    const suggestions = (t.raw("specialization_suggestions") as string[]) ?? [];

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [turnstileToken, setTurnstileToken] = useState<string>(
        process.env.NODE_ENV === "development" ? "dev-bypass" : ""
    );
    const [photos, setPhotos] = useState<PhotoFile[]>([]);
    const [photoError, setPhotoError] = useState<string>("");

    async function onPickPhotos(files: FileList | null) {
        if (!files) return;
        setPhotoError("");
        const picked = Array.from(files).slice(0, MAX_PHOTOS - photos.length);
        if (picked.length < Array.from(files).length) {
            setPhotoError(t("error_text"));
        }
        const processed: PhotoFile[] = [];
        for (const file of picked) {
            if (!/^image\/(jpeg|png|webp)$/.test(file.type)) continue;
            try {
                processed.push(await readAsDownscaledJpeg(file));
            } catch {
                /* skip unreadable file */
            }
        }
        setPhotos((prev) => [...prev, ...processed].slice(0, MAX_PHOTOS));
    }

    function removePhoto(index: number) {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setStatus("idle");

        const formData = new FormData(e.currentTarget);
        const data = {
            candidate_name: formData.get("name"),
            specialization: formData.get("specialization"),
            legal_status: formData.get("legal_status"),
            car_and_tools: formData.get("car_and_tools"),
            location: formData.get("location"),
            rate: formData.get("rate"),
            phone_number: formData.get("phone"),
            languages: formData.get("languages"),
            team_size: formData.get("team_size"),
            availability: formData.get("availability"),
            website: formData.get("website"), // honeypot
            photos,
            turnstileToken,
        };

        try {
            const res = await fetch("/api/subcontractors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Submission failed");
            setStatus("success");
            setPhotos([]);
            setTurnstileToken(process.env.NODE_ENV === "development" ? "dev-bypass" : "");
            (e.target as HTMLFormElement).reset();
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }

    const disabled = loading || !legalOptions.length || !turnstileToken;

    return (
        <section id="inschrijven" className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-xl 2xl:max-w-2xl">
                <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-8 md:p-10 transition-all hover:shadow-lg">
                    <h2 className="text-3xl font-extrabold mb-2 text-slate-900">{t("form_title")}</h2>
                    <p className="mb-8 text-gray-600">{t("form_subtitle")}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <label className={labelCls}>{t("name")} *</label>
                                <Field icon={<User className={iconCls} />}>
                                    <input name="name" required type="text" className={inputCls} placeholder={t("name_ph")} />
                                </Field>
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>{t("phone")} *</label>
                                <Field icon={<Phone className={iconCls} />}>
                                    <input name="phone" required type="tel" className={inputCls} placeholder={t("phone_ph")} />
                                </Field>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className={labelCls}>{t("specialization")}</label>
                            <Field icon={<Wrench className={iconCls} />}>
                                <input name="specialization" type="text" list="subcontractor-trades" className={inputCls} placeholder={t("specialization_ph")} />
                            </Field>
                            <datalist id="subcontractor-trades">
                                {suggestions.map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>
                        </div>

                        <div className="space-y-1">
                            <label className={labelCls}>{t("legal_status")} *</label>
                            <Field icon={<FileCheck2 className={iconCls} />}>
                                <select name="legal_status" required defaultValue="" className={selectCls}>
                                    <option value="" disabled>
                                        ---
                                    </option>
                                    {legalOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className={labelCls}>{t("car_and_tools")}</label>
                                <Field icon={<Truck className={iconCls} />}>
                                    <select name="car_and_tools" defaultValue="" className={selectCls}>
                                        <option value="" disabled>
                                            ---
                                        </option>
                                        {carOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                </Field>
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>{t("location")}</label>
                                <Field icon={<MapPin className={iconCls} />}>
                                    <input name="location" type="text" className={inputCls} placeholder={t("location_ph")} />
                                </Field>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className={labelCls}>{t("rate")}</label>
                                <Field icon={<Euro className={iconCls} />}>
                                    <input name="rate" type="text" className={inputCls} placeholder={t("rate_ph")} />
                                </Field>
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>{t("languages")}</label>
                                <Field icon={<Languages className={iconCls} />}>
                                    <input name="languages" type="text" className={inputCls} placeholder={t("languages_ph")} />
                                </Field>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className={labelCls}>{t("team_size")}</label>
                                <Field icon={<Users className={iconCls} />}>
                                    <select name="team_size" defaultValue="" className={selectCls}>
                                        <option value="" disabled>
                                            ---
                                        </option>
                                        {teamOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                </Field>
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>{t("availability")}</label>
                                <Field icon={<Clock className={iconCls} />}>
                                    <select name="availability" defaultValue="" className={selectCls}>
                                        <option value="" disabled>
                                            ---
                                        </option>
                                        {availabilityOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                </Field>
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="space-y-1">
                            <label className={labelCls}>{t("photos")}</label>
                            <label className="flex items-center gap-3 w-full py-3 px-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                                <ImagePlus className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-500">{t("photos_hint")}</span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    disabled={photos.length >= MAX_PHOTOS}
                                    onChange={(e) => onPickPhotos(e.target.files)}
                                    className="hidden"
                                />
                            </label>
                            {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
                            {photos.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {photos.map((photo, i) => (
                                        <div key={i} className="relative">
                                            <img
                                                src={`data:${photo.mimeType};base64,${photo.dataBase64}`}
                                                alt={photo.name}
                                                className="h-16 w-16 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(i)}
                                                aria-label={photo.name}
                                                className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white rounded-full p-0.5 hover:bg-gray-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Honeypot */}
                        <div className="hidden" aria-hidden="true">
                            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                        </div>

                        <div className="pt-6 space-y-6">
                            {process.env.NODE_ENV !== "development" && (
                                <div className="flex justify-center">
                                    <Turnstile
                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                                        onSuccess={(token) => setTurnstileToken(token)}
                                        onExpire={() => setTurnstileToken("")}
                                        onError={() => setTurnstileToken("")}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={disabled}
                                className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-200 transform ${
                                    disabled
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t("submitting")}
                                    </span>
                                ) : (
                                    t("submit")
                                )}
                            </button>
                        </div>

                        {status === "success" && (
                            <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-center font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
                                {t("success_title")} {t("success_text")}
                            </div>
                        )}
                        {status === "error" && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-center font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
                                {t("error_text")}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

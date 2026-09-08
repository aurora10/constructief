"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

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

export function SubcontractorForm() {
    const t = useTranslations("SubcontractorForm");
    const legalOptions = (t.raw("legal_status_options") as { value: string; label: string }[]) ?? [];
    const carOptions = (t.raw("car_and_tools_options") as { value: string; label: string }[]) ?? [];
    const teamOptions = (t.raw("team_size_options") as { value: string; label: string }[]) ?? [];
    const availabilityOptions = (t.raw("availability_options") as { value: string; label: string }[]) ?? [];
    const suggestions = (t.raw("specialization_suggestions") as string[]) ?? [];

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [turnstileToken, setTurnstileToken] = useState<string>("");
    const [photos, setPhotos] = useState<PhotoFile[]>([]);
    const [photoError, setPhotoError] = useState<string>("");

    async function onPickPhotos(files: FileList | null) {
        if (!files) return;
        setPhotoError("");
        const remaining = MAX_PHOTOS - photos.length;
        const picked = Array.from(files).slice(0, remaining);
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
            (e.target as HTMLFormElement).reset();
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }

    if (status === "success") {
        return (
            <div className="max-w-2xl mx-auto p-10 bg-neutral-50 dark:bg-neutral-900 border rounded-2xl text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                    {t("success_title")}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg">{t("success_text")}</p>
            </div>
        );
    }

    const selectCls =
        "w-full p-2.5 border rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white";

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">{t("form_title")}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{t("form_subtitle")}</p>

            {status === "error" && (
                <p className="mb-4 p-3 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                    {t("error_text")}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">
                            {t("name")} <span className="text-red-500">*</span>
                        </label>
                        <input name="name" required type="text" className="w-full p-2.5 border rounded-md" placeholder={t("name_ph")} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">
                            {t("phone")} <span className="text-red-500">*</span>
                        </label>
                        <input name="phone" required type="tel" className="w-full p-2.5 border rounded-md" placeholder={t("phone_ph")} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("specialization")}</label>
                    <input
                        name="specialization"
                        type="text"
                        list="subcontractor-trades"
                        className="w-full p-2.5 border rounded-md"
                        placeholder={t("specialization_ph")}
                    />
                    <datalist id="subcontractor-trades">
                        {suggestions.map((s) => (
                            <option key={s} value={s} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">
                        {t("legal_status")} <span className="text-red-500">*</span>
                    </label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("car_and_tools")}</label>
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
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("location")}</label>
                        <input name="location" type="text" className="w-full p-2.5 border rounded-md" placeholder={t("location_ph")} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("rate")}</label>
                        <input name="rate" type="text" className="w-full p-2.5 border rounded-md" placeholder={t("rate_ph")} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("languages")}</label>
                        <input name="languages" type="text" className="w-full p-2.5 border rounded-md" placeholder={t("languages_ph")} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("team_size")}</label>
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
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("availability")}</label>
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
                    </div>
                </div>

                {/* Photo upload */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-white">{t("photos")}</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={photos.length >= MAX_PHOTOS}
                        onChange={(e) => onPickPhotos(e.target.files)}
                        className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white file:cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500 mt-1">{t("photos_hint")}</p>
                    {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
                    {photos.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {photos.map((photo, i) => (
                                <li key={i} className="relative">
                                    <img
                                        src={`data:${photo.mimeType};base64,${photo.dataBase64}`}
                                        alt={photo.name}
                                        className="h-16 w-16 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(i)}
                                        aria-label={photo.name}
                                        className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="flex justify-center py-2">
                    <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken("")}
                        onError={() => setTurnstileToken("")}
                    />
                </div>

                <Button type="submit" disabled={loading || !turnstileToken} className="w-full">
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t("submitting")}
                        </>
                    ) : (
                        t("submit")
                    )}
                </Button>
            </form>
        </div>
    );
}

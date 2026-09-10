'use client';

import { useState } from 'react';

/**
 * Article hero/card image with a graceful fallback: if the file is missing or
 * fails to load, it renders the styled category placeholder instead of a broken
 * image. Lets posts ship before their artwork exists.
 */
export function ArticleImage({
    src,
    alt,
    category,
    variant = 'hero',
}: {
    src?: string | null;
    alt: string;
    category: string;
    variant?: 'hero' | 'card';
}) {
    const [failed, setFailed] = useState(false);
    const box = variant === 'hero' ? 'h-64 mb-12' : 'h-48';

    if (!src || failed) {
        return (
            <div className={`${box} rounded-xl bg-gradient-to-br from-[#0a0f1a] via-[#10233f] to-[#1d4ed8] flex items-center justify-center`}>
                <span className="text-white/80 font-semibold tracking-wide uppercase text-xs px-6 text-center">
                    {category}
                </span>
            </div>
        );
    }

    return (
        <div className={`${box} rounded-xl bg-neutral-200 overflow-hidden`}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                onError={() => setFailed(true)}
            />
        </div>
    );
}

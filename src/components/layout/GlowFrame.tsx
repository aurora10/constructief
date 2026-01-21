"use client";

import React from 'react';

export function GlowFrame() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{
                background: 'radial-gradient(circle at center, transparent 0%, transparent 80%, rgba(59, 130, 246, 0.15) 100%)',
                boxShadow: 'inset 0 0 100px rgba(59, 130, 246, 0.1)'
            }}
        />
    );
}

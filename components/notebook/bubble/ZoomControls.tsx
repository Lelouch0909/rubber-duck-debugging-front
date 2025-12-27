'use client';
import React from 'react';

interface ZoomControlsProps {
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
}

function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
    return (
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 bg-card/80 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-muted/50">
            <button
                onClick={onZoomIn}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-primary"
                title="Zoom avant"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <button
                onClick={onZoomOut}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-primary"
                title="Zoom arrière"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <div className="w-full h-px bg-muted" />
            <button
                onClick={onReset}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-primary"
                title="Recentrer"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
            <span className="text-xs text-center text-muted-foreground font-medium">{Math.round(scale * 100)}%</span>
        </div>
    );
}

export default ZoomControls;

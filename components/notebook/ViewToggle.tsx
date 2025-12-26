'use client';
import React from 'react';
import { CustomProps } from '@/types/common/CustomProps';

interface ViewToggleProps extends CustomProps {
    viewMode: 'bubble' | 'list';
    onViewChange: (mode: 'bubble' | 'list') => void;
}

function ViewToggle({ viewMode, onViewChange, className }: ViewToggleProps) {
    return (
        <div className={`flex items-center gap-1 bg-muted rounded-lg p-1 ${className ?? ''}`}>
            <button
                onClick={() => onViewChange('bubble')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'bubble'
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                title="Vue Bulles"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" strokeWidth={2} />
                    <circle cx="6" cy="6" r="2" strokeWidth={2} />
                    <circle cx="18" cy="6" r="2" strokeWidth={2} />
                    <circle cx="6" cy="18" r="2" strokeWidth={2} />
                    <circle cx="18" cy="18" r="2" strokeWidth={2} />
                    <path strokeLinecap="round" strokeWidth={1.5} d="M9 9l-1.5-1.5M15 9l1.5-1.5M9 15l-1.5 1.5M15 15l1.5 1.5" />
                </svg>
                Bulles
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'list'
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                title="Vue Liste"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Liste
            </button>
        </div>
    );
}

export default ViewToggle;

import React from 'react';
import Link from 'next/link';
import { RedirectButtonProps } from '@/types/common/RedirectButtonProps';

function RedirectButton({ className, href, onClickEvent, children }: RedirectButtonProps) {

    const base = 'inline-flex items-center justify-center rounded-md p-[0px] w-[32px] h-[32px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-marker/60';
    const variant = 'text-marker border-marker border hover:bg-markerHover  shadow-sm';

    return (
        <Link
            href={href}
            className={className ? className : `${base} ${variant}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir les Notebooks"
            aria-label="Ouvrir les Notebooks"
            onClick={onClickEvent}
        >
            {children ?? (
                <svg
                    className="w-[14px] h-[14px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10" />
                </svg>
            )}
        </Link>
    );
}

export default RedirectButton;
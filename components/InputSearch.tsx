import React from 'react';

function InputSearch({children, className = ''}: {children?: React.ReactNode, className?: string}) {
    return (
        <div className="relative ">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-card text-sidebar-foreground pl-10 pr-4 py-2 rounded-lg border-[1px] focus:ring-2 focus:ring-sidebar-ring border-muted outline-none "
            />
        </div>
    );
}

export default InputSearch;
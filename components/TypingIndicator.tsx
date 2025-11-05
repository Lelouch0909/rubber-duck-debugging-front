import React from 'react';
import { DuckAnimation } from "@/components/DuckAnimation";

const TypingIndicator = () => {
    return (
        <div className="flex gap-4 animate-slideIn">
            <div className="shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <DuckAnimation size={'sm'} />
                </div>
            </div>

            <div className="flex flex-col gap-1 max-w-[70%]">
                <div className="rounded-2xl px-4 py-3 bg-card text-primary">
                    <div className="flex gap-1 items-center">
                        <div
                            className="w-2 h-2 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                            className="w-2 h-2 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                            className="w-2 h-2 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: '300ms' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;


'use client';
import React, { useState, useCallback } from 'react';
import {CustomProps} from "@/types/common/CustomProps";
import Card from "@/components/Card";

function Header({ className }: CustomProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCard, setActiveCard] = useState<number | null>(null);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    const handleCardClick = useCallback((cardIndex: number) => {
        setActiveCard(cardIndex);
    }, []);

    return (
        <div className={`${className} transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-auto'} relative`}>

                <button
                    onClick={toggleCollapse}
                    className={`text-muted-foreground hover:text-primary transition-colors p-1 absolute z-50 bottom-0 right-1/2 translate-y-4 translate-x-4 rotate-90 bg-background border-2 border-muted rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl hover:border-primary`} /* Adjusted position */
                    title={isCollapsed ? "Expand Header" : "Collapse Header"}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                    </svg>
                </button>

            {!isCollapsed && (
                <div className="grid grid-cols-5 gap-2 p-4"> {/* Reduced gap between cards */}
                    {[...Array(5)].map((_, index) => (
                        <Card
                            key={index}
                            variant="default"
                            onClickEvent={() => handleCardClick(index)}
                            className={`bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer p-2 rounded-lg border border-slate-600 ${
                                activeCard === index ? 'ring-2 ring-blue-500' : ''
                            }`} /* Highlight active card */
                        >
                            <div className="flex flex-col items-center text-center gap-1"> {/* Reduced gap inside cards */}
                                <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center"> {/* Reduced icon size */}
                                    <span className="text-white text-xs">💡</span> {/* Reduced text size */}
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm">Card {index + 1}</h3> {/* Dynamic card title */}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {isCollapsed && activeCard !== null && (
                <div className="text-center text-white mt-4">
                    Active Card: {activeCard + 1}
                </div>
            )}
        </div>
    );
}

export default Header;
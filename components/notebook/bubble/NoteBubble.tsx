'use client';
import React from 'react';
import { Note } from '@/types/notebook';
import { BubblePosition } from './constants';
import { getBubbleColor } from './colors';

interface NoteBubbleProps {
    note: Note;
    index: number;
    position: BubblePosition;
    isSelected: boolean;
    isDragging: boolean;
    isExploded: boolean;
    isOrphan?: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

function NoteBubble({
    note,
    index,
    position,
    isSelected,
    isDragging,
    isExploded,
    isOrphan = false,
    onMouseDown,
    onClick,
}: NoteBubbleProps) {
    const color = getBubbleColor(index);

    return (
        <div
            onMouseDown={onMouseDown}
            onClick={onClick}
            className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'} ${!isDragging ? 'transition-all duration-300 ease-out' : ''} ${isExploded ? 'z-50' : isSelected ? 'z-30' : 'z-10'}`}
            style={{
                left: position.x - (isExploded ? 140 : position.radius),
                top: position.y - (isExploded ? 90 : position.radius),
                width: isExploded ? 280 : position.radius * 2,
                height: isExploded ? 180 : position.radius * 2,
                borderRadius: isExploded ? '20px' : '50%',
                background: isExploded
                    ? 'var(--card)'
                    : `linear-gradient(145deg, ${color.bg}, ${color.bg.replace('0.85', '0.95')})`,
                boxShadow: isExploded
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    : isSelected
                        ? `0 20px 40px -8px ${color.glow}, 0 0 0 3px var(--marker), inset 0 1px 0 rgba(255,255,255,0.3)`
                        : `0 16px 32px -6px ${color.glow}, 0 0 0 1px ${color.border}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                backdropFilter: 'blur(8px)',
            }}
            title={note.title}
        >
            {/* Bubble shine */}
            {!isExploded && (
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        top: '10%',
                        left: '15%',
                        width: '35%',
                        height: '25%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 60%)',
                        borderRadius: '50%',
                    }}
                />
            )}

            {isExploded ? (
                <div className="p-4 h-full flex flex-col overflow-hidden">
                    <h3 className="font-bold text-lg text-primary mb-1 truncate">{note.title}</h3>
                    {isOrphan && (
                        <span className="text-xs text-muted-foreground mb-2">Sans catégorie</span>
                    )}
                    <p className="text-sm text-muted-foreground flex-1 overflow-hidden line-clamp-3">
                        {note.content.replace(/[#*`]/g, '').slice(0, 150)}...
                    </p>
                    {note.tags.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {note.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-marker/20 text-marker rounded-full font-medium">{tag}</span>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-marker font-medium mt-2">Cliquez pour éditer →</p>
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3">
                    <span
                        className="font-bold text-center leading-tight"
                        style={{
                            fontSize: `${Math.max(12, position.radius / 5)}px`,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        {note.title.length > 18 ? note.title.slice(0, 18) + '...' : note.title}
                    </span>
                    {position.radius > 55 && note.tags[0] && (
                        <span
                            className="mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                                background: 'rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            {note.tags[0]}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default NoteBubble;

'use client';
import React from 'react';
import { NoteGroup, Note } from '@/types/notebook';
import { BubblePosition } from './constants';
import { getBubbleColor } from './colors';

interface GroupBubbleProps {
    group: NoteGroup;
    index: number;
    position: BubblePosition;
    notesInGroup: Note[];
    isDragging: boolean;
    isExploded: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

function GroupBubble({
    group,
    index,
    position,
    notesInGroup,
    isDragging,
    isExploded,
    onMouseDown,
    onClick,
}: GroupBubbleProps) {
    const color = getBubbleColor(index);

    return (
        <div
            onMouseDown={onMouseDown}
            onClick={onClick}
            className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'} ${!isDragging ? 'transition-all duration-300 ease-out' : ''} ${isExploded ? 'z-50' : 'z-10'}`}
            style={{
                left: position.x - (isExploded ? 160 : position.radius),
                top: position.y - (isExploded ? 100 : position.radius),
                width: isExploded ? 320 : position.radius * 2,
                height: isExploded ? 200 : position.radius * 2,
                borderRadius: isExploded ? '24px' : '50%',
                background: isExploded
                    ? 'var(--card)'
                    : `linear-gradient(145deg, ${color.bg}, ${color.bg.replace('0.85', '0.95')})`,
                boxShadow: isExploded
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    : `0 20px 40px -8px ${color.glow}, 0 0 0 1px ${color.border}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                backdropFilter: 'blur(8px)',
            }}
            title={group.name}
        >
            {/* Bubble shine effect */}
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
                <div className="p-5 h-full flex flex-col overflow-hidden">
                    <h3 className="font-bold text-xl text-primary mb-2">{group.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        {notesInGroup.length} note{notesInGroup.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex flex-wrap gap-2">
                            {notesInGroup.slice(0, 4).map(note => (
                                <span key={note.id} className="text-xs px-3 py-1.5 bg-muted text-primary rounded-full truncate max-w-[120px] font-medium">
                                    {note.title}
                                </span>
                            ))}
                            {notesInGroup.length > 4 && (
                                <span className="text-xs px-3 py-1.5 bg-marker/20 text-marker rounded-full font-medium">
                                    +{notesInGroup.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-marker font-medium mt-2">Cliquez pour entrer →</p>
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <span
                        className="font-bold text-center leading-tight"
                        style={{
                            fontSize: `${Math.max(16, position.radius / 4)}px`,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        {group.name}
                    </span>
                    <span
                        className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                            background: 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        {notesInGroup.length} note{notesInGroup.length > 1 ? 's' : ''}
                    </span>
                </div>
            )}
        </div>
    );
}

export default GroupBubble;

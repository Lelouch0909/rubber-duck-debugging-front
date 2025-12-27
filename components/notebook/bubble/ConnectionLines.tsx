'use client';
import React from 'react';
import { NoteConnection } from '@/types/notebook';
import { BubblePosition } from './constants';
import { getConnectionColor, getConnectionWidth } from './colors';

interface ConnectionLinesProps {
    connections: NoteConnection[];
    groupConnections?: NoteConnection[];
    positions: Record<string, BubblePosition>;
}

function ConnectionLines({ connections, groupConnections = [], positions }: ConnectionLinesProps) {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Group connections (dashed lines) */}
            {groupConnections.map((connection) => {
                const source = positions[connection.sourceId];
                const target = positions[connection.targetId];
                if (!source || !target) return null;

                return (
                    <line
                        key={`group-${connection.sourceId}-${connection.targetId}`}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={getConnectionColor(connection.similarity)}
                        strokeWidth={getConnectionWidth(connection.similarity)}
                        strokeDasharray="8 4"
                        filter="url(#glow)"
                    />
                );
            })}

            {/* Note connections */}
            {connections.map((connection) => {
                const source = positions[connection.sourceId];
                const target = positions[connection.targetId];
                if (!source || !target) return null;

                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;

                return (
                    <g key={`${connection.sourceId}-${connection.targetId}`}>
                        <line
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={getConnectionColor(connection.similarity)}
                            strokeWidth={getConnectionWidth(connection.similarity)}
                            filter="url(#glow)"
                        />
                        <circle
                            cx={midX}
                            cy={midY}
                            r="14"
                            className="fill-card"
                            stroke={getConnectionColor(connection.similarity)}
                            strokeWidth="2"
                        />
                        <text
                            x={midX}
                            y={midY + 4}
                            textAnchor="middle"
                            className="fill-primary"
                            fontSize="11"
                            fontWeight="600"
                        >
                            {connection.similarity}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default ConnectionLines;

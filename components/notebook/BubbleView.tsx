'use client';
import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Note, NoteConnection } from '@/types/notebook';

interface BubbleViewProps {
    notes: Note[];
    connections: NoteConnection[];
    selectedNoteId: string | null;
    onNoteClick: (noteId: string) => void;
    searchQuery: string;
}

// Beautiful gradient colors for bubbles
const BUBBLE_GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

// Get connection line color based on similarity score (0-10)
const getConnectionColor = (similarity: number): string => {
    if (similarity <= 5) {
        const ratio = similarity / 5;
        return `rgba(255, ${Math.round(255 * (1 - ratio))}, ${Math.round(255 * (1 - ratio))}, 0.8)`;
    } else {
        const ratio = (similarity - 5) / 5;
        return `rgba(${Math.round(255 * (1 - ratio))}, 0, 0, 0.8)`;
    }
};

interface BubblePosition {
    x: number;
    y: number;
    radius: number;
}

const MIN_RADIUS = 50;
const MAX_RADIUS = 100;
const CANVAS_SIZE = 3000;

function BubbleView({ notes, connections, selectedNoteId, onNoteClick, searchQuery }: BubbleViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

    // Transform state (pan and zoom)
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    // Dragging bubble state
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [hasDragged, setHasDragged] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Exploding bubble state
    const [explodedId, setExplodedId] = useState<string | null>(null);

    // Custom positions for bubbles
    const [customPositions, setCustomPositions] = useState<Record<string, { x: number; y: number }>>({});

    // Filter notes based on search query
    const filteredNotes = useMemo(() => {
        if (!searchQuery) return notes;
        const query = searchQuery.toLowerCase();
        return notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [notes, searchQuery]);

    // Filter connections
    const filteredConnections = useMemo(() => {
        const noteIds = new Set(filteredNotes.map(n => n.id));
        return connections.filter(c => noteIds.has(c.sourceId) && noteIds.has(c.targetId));
    }, [connections, filteredNotes]);

    // Count connections per note
    const connectionCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        filteredConnections.forEach(c => {
            counts[c.sourceId] = (counts[c.sourceId] || 0) + 1;
            counts[c.targetId] = (counts[c.targetId] || 0) + 1;
        });
        return counts;
    }, [filteredConnections]);

    // Calculate bubble radius based on content size and connections
    const calculateRadius = useCallback((note: Note): number => {
        const contentScore = Math.min(note.content.length / 500, 1); // 0-1 based on content
        const connectionScore = Math.min((connectionCounts[note.id] || 0) / 5, 1); // 0-1 based on connections
        const combinedScore = (contentScore * 0.6 + connectionScore * 0.4);
        return MIN_RADIUS + combinedScore * (MAX_RADIUS - MIN_RADIUS);
    }, [connectionCounts]);

    // Calculate initial bubble positions
    const initialPositions = useMemo((): Record<string, BubblePosition> => {
        const positions: Record<string, BubblePosition> = {};
        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;

        // Sort by date (most recent first)
        const sortedNotes = [...filteredNotes].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        sortedNotes.forEach((note, index) => {
            const radius = calculateRadius(note);
            if (index === 0) {
                positions[note.id] = { x: centerX, y: centerY, radius };
            } else {
                const angle = (2 * Math.PI * (index - 1)) / Math.max(sortedNotes.length - 1, 1);
                const radiusOffset = 200 + Math.floor((index - 1) / 6) * 180;
                positions[note.id] = {
                    x: centerX + radiusOffset * Math.cos(angle),
                    y: centerY + radiusOffset * Math.sin(angle),
                    radius,
                };
            }
        });

        return positions;
    }, [filteredNotes, calculateRadius]);

    // Merge custom positions with initial positions
    const bubblePositions = useMemo((): Record<string, BubblePosition> => {
        const merged: Record<string, BubblePosition> = {};
        for (const noteId in initialPositions) {
            if (customPositions[noteId]) {
                merged[noteId] = { ...initialPositions[noteId], ...customPositions[noteId] };
            } else {
                merged[noteId] = initialPositions[noteId];
            }
        }
        return merged;
    }, [initialPositions, customPositions]);

    // Update container size on resize
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Center view on most recent note on initial load
    useEffect(() => {
        if (filteredNotes.length > 0 && containerSize.width > 0) {
            const sortedNotes = [...filteredNotes].sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            const mostRecentId = sortedNotes[0].id;
            const pos = bubblePositions[mostRecentId];

            if (pos) {
                setTransform({
                    x: containerSize.width / 2 - pos.x,
                    y: containerSize.height / 2 - pos.y,
                    scale: 1,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredNotes.length, containerSize.width]);

    // Handle wheel - 2 finger trackpad = pan, ctrl+wheel or pinch = zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        // Check if it's a pinch zoom (ctrl key) or regular scroll (2 finger pan)
        if (e.ctrlKey || e.metaKey) {
            // Pinch zoom
            const delta = e.deltaY > 0 ? 0.95 : 1.05;
            const newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);

            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
                const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
                setTransform({ x: newX, y: newY, scale: newScale });
            }
        } else {
            // Two finger pan
            setTransform(prev => ({
                ...prev,
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY,
            }));
        }
    }, [transform]);

    // Handle pan start
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0 && !draggingId) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
        }
    }, [transform, draggingId]);

    // Handle pan move
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning && !draggingId) {
            setTransform(prev => ({
                ...prev,
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y,
            }));
        } else if (draggingId) {
            setHasDragged(true);
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const canvasX = (e.clientX - rect.left - transform.x) / transform.scale;
                const canvasY = (e.clientY - rect.top - transform.y) / transform.scale;

                setCustomPositions(prev => ({
                    ...prev,
                    [draggingId]: {
                        x: canvasX - dragOffset.x,
                        y: canvasY - dragOffset.y,
                    },
                }));
            }
        }
    }, [isPanning, panStart, draggingId, dragOffset, transform]);

    // Handle pan/drag end
    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        setDraggingId(null);
        // Reset hasDragged after a short delay to allow click detection
        setTimeout(() => setHasDragged(false), 50);
    }, []);

    // Handle bubble drag start
    const handleBubbleMouseDown = useCallback((e: React.MouseEvent, noteId: string, pos: BubblePosition) => {
        e.stopPropagation();
        setHasDragged(false);

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const canvasX = (e.clientX - rect.left - transform.x) / transform.scale;
            const canvasY = (e.clientY - rect.top - transform.y) / transform.scale;

            setDraggingId(noteId);
            setDragOffset({
                x: canvasX - pos.x,
                y: canvasY - pos.y,
            });
        }
    }, [transform]);

    // Handle bubble click - only trigger if not dragged
    const handleBubbleClick = useCallback((e: React.MouseEvent, noteId: string) => {
        e.stopPropagation();

        if (hasDragged) return;

        if (explodedId === noteId) {
            // Second click - open editor
            setExplodedId(null);
            onNoteClick(noteId);
        } else {
            // First click - explode bubble
            setExplodedId(noteId);
        }
    }, [hasDragged, explodedId, onNoteClick]);

    // Close exploded bubble when clicking elsewhere
    const handleCanvasClick = useCallback(() => {
        if (explodedId) {
            setExplodedId(null);
        }
    }, [explodedId]);

    // Zoom controls
    const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }));
    const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.3) }));
    const resetView = () => {
        if (filteredNotes.length > 0) {
            const sortedNotes = [...filteredNotes].sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            const pos = bubblePositions[sortedNotes[0].id];
            if (pos) {
                setTransform({
                    x: containerSize.width / 2 - pos.x,
                    y: containerSize.height / 2 - pos.y,
                    scale: 1,
                });
            }
        }
    };

    // Get gradient for note based on its index
    const getGradient = (index: number) => BUBBLE_GRADIENTS[index % BUBBLE_GRADIENTS.length];

    if (filteredNotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 animate-pulse mb-6" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune note trouvée
                </h3>
                <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Essayez une autre recherche' : 'Créez votre première note !'}
                </p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden select-none"
            style={{
                cursor: isPanning ? 'grabbing' : 'grab',
                background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={handleCanvasClick}
        >
            {/* Stars background - generated client-side only to avoid hydration mismatch */}
            <Stars />

            {/* Zoom controls */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 bg-black/50 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-white/10">
                <button onClick={zoomIn} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white" title="Zoom avant">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                <button onClick={zoomOut} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white" title="Zoom arrière">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <div className="w-full h-px bg-white/20" />
                <button onClick={resetView} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white" title="Recentrer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
                <span className="text-xs text-center text-white/70">{Math.round(transform.scale * 100)}%</span>
            </div>

            {/* Transformable canvas */}
            <div
                className="absolute"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: '0 0',
                    width: CANVAS_SIZE,
                    height: CANVAS_SIZE,
                }}
            >
                {/* SVG for connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {filteredConnections.map((connection) => {
                        const source = bubblePositions[connection.sourceId];
                        const target = bubblePositions[connection.targetId];
                        if (!source || !target) return null;

                        const color = getConnectionColor(connection.similarity);
                        const midX = (source.x + target.x) / 2;
                        const midY = (source.y + target.y) / 2;

                        return (
                            <g key={`${connection.sourceId}-${connection.targetId}`}>
                                <line
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke={color}
                                    strokeWidth={2 + connection.similarity / 3}
                                    className="drop-shadow-lg"
                                />
                                <circle cx={midX} cy={midY} r="16" fill="rgba(0,0,0,0.6)" />
                                <text x={midX} y={midY + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
                                    {connection.similarity}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Bubble nodes */}
                {filteredNotes.map((note, index) => {
                    const pos = bubblePositions[note.id];
                    if (!pos) return null;

                    const isSelected = selectedNoteId === note.id;
                    const isDragging = draggingId === note.id;
                    const isExploded = explodedId === note.id;

                    return (
                        <div
                            key={note.id}
                            onMouseDown={(e) => handleBubbleMouseDown(e, note.id, pos)}
                            onClick={(e) => handleBubbleClick(e, note.id)}
                            className={`absolute rounded-full transition-all duration-500 ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'
                                } ${isExploded ? 'z-50' : isSelected ? 'z-30' : 'z-10'}`}
                            style={{
                                left: pos.x - (isExploded ? 150 : pos.radius),
                                top: pos.y - (isExploded ? 100 : pos.radius),
                                width: isExploded ? 300 : pos.radius * 2,
                                height: isExploded ? 200 : pos.radius * 2,
                                borderRadius: isExploded ? '20px' : '50%',
                                background: isExploded
                                    ? 'rgba(20, 20, 40, 0.95)'
                                    : getGradient(index),
                                boxShadow: isExploded
                                    ? '0 0 60px rgba(147, 51, 234, 0.5), 0 0 120px rgba(79, 70, 229, 0.3)'
                                    : `0 0 ${20 + pos.radius / 3}px rgba(255,255,255,0.2), inset 0 0 ${pos.radius / 2}px rgba(255,255,255,0.1)`,
                                border: isExploded
                                    ? '2px solid rgba(147, 51, 234, 0.8)'
                                    : isSelected
                                        ? '3px solid rgba(255, 215, 0, 0.8)'
                                        : '2px solid rgba(255,255,255,0.2)',
                                animation: isExploded
                                    ? 'explode 0.5s ease-out forwards'
                                    : isDragging
                                        ? 'none'
                                        : 'bubble-breathe 4s ease-in-out infinite, bubble-glow 2s ease-in-out infinite',
                                animationDelay: `${index * 0.3}s`,
                            }}
                            title={note.title}
                        >
                            {isExploded ? (
                                // Exploded content view
                                <div className="p-4 h-full flex flex-col text-white overflow-hidden">
                                    <h3 className="font-bold text-lg mb-2 truncate">{note.title}</h3>
                                    <p className="text-sm text-white/80 flex-1 overflow-hidden line-clamp-4">
                                        {note.content.replace(/[#*`]/g, '').slice(0, 200)}...
                                    </p>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {note.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs px-2 py-1 bg-white/20 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-white/50 mt-2">Cliquez pour éditer</p>
                                </div>
                            ) : (
                                // Bubble view
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3">
                                    <span
                                        className="font-bold text-center leading-tight drop-shadow-lg"
                                        style={{ fontSize: `${Math.max(10, pos.radius / 5)}px` }}
                                    >
                                        {note.title.length > 15 ? note.title.slice(0, 15) + '...' : note.title}
                                    </span>
                                    {pos.radius > 60 && note.tags[0] && (
                                        <span className="text-xs mt-1 opacity-80 bg-black/30 px-2 py-0.5 rounded-full">
                                            {note.tags[0]}
                                        </span>
                                    )}
                                    {/* Glow ring */}
                                    <div
                                        className="absolute inset-0 rounded-full pointer-events-none"
                                        style={{
                                            border: '2px solid rgba(255,255,255,0.4)',
                                            animation: 'bubble-ring 3s ease-in-out infinite',
                                            animationDelay: `${index * 0.5}s`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes bubble-breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes bubble-glow {
                    0%, 100% { filter: brightness(1) saturate(1); }
                    50% { filter: brightness(1.2) saturate(1.1); }
                }
                @keyframes bubble-ring {
                    0%, 100% { opacity: 0.3; transform: scale(0.9); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                @keyframes explode {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 z-30 text-xs text-white/60 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl">
                <span className="font-medium">2 doigts:</span> Déplacer • <span className="font-medium">Pincer:</span> Zoom • <span className="font-medium">Bulle:</span> Clic = voir, 2e clic = éditer
            </div>
        </div>
    );
}

export default BubbleView;

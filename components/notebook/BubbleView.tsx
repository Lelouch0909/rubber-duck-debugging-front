'use client';
import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Note, NoteConnection, NoteGroup } from '@/types/notebook';
import {
    ZoomControls,
    GroupBubble,
    NoteBubble,
    ConnectionLines,
    BubblePosition,
    CANVAS_SIZE,
    MIN_RADIUS,
    MAX_RADIUS,
    GROUP_RADIUS,
} from './bubble';

interface BubbleViewProps {
    notes: Note[];
    groups: NoteGroup[];
    connections: NoteConnection[];
    selectedNoteId: string | null;
    selectedGroupId: string | null;
    onNoteClick: (noteId: string) => void;
    onGroupClick: (groupId: string) => void;
    searchQuery: string;
}

function BubbleView({
    notes,
    groups,
    connections,
    selectedNoteId,
    selectedGroupId,
    onNoteClick,
    onGroupClick,
    searchQuery
}: BubbleViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [hasDragged, setHasDragged] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [explodedId, setExplodedId] = useState<string | null>(null);
    const [customPositions, setCustomPositions] = useState<Record<string, { x: number; y: number }>>({});

    const isGroupView = selectedGroupId === null;

    // Notes without a group (orphan notes)
    const orphanNotes = useMemo(() => notes.filter(n => !n.groupId), [notes]);

    // Notes in selected group
    const groupNotes = useMemo(() => {
        if (!selectedGroupId) return [];
        return notes.filter(n => n.groupId === selectedGroupId);
    }, [notes, selectedGroupId]);

    // Filter by search
    const filteredGroupNotes = useMemo(() => {
        if (!searchQuery) return groupNotes;
        const query = searchQuery.toLowerCase();
        return groupNotes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [groupNotes, searchQuery]);

    const filteredOrphanNotes = useMemo(() => {
        if (!searchQuery) return orphanNotes;
        const query = searchQuery.toLowerCase();
        return orphanNotes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [orphanNotes, searchQuery]);

    // Connections within current view
    const viewConnections = useMemo(() => {
        if (isGroupView) {
            const orphanIds = new Set(filteredOrphanNotes.map(n => n.id));
            return connections.filter(c => orphanIds.has(c.sourceId) && orphanIds.has(c.targetId));
        } else {
            const noteIds = new Set(filteredGroupNotes.map(n => n.id));
            return connections.filter(c => noteIds.has(c.sourceId) && noteIds.has(c.targetId));
        }
    }, [isGroupView, connections, filteredOrphanNotes, filteredGroupNotes]);

    // Connections between groups
    const groupConnections = useMemo(() => {
        if (!isGroupView) return [];

        const connectionMap: Record<string, { strength: number; count: number }> = {};

        connections.forEach(conn => {
            const sourceNote = notes.find(n => n.id === conn.sourceId);
            const targetNote = notes.find(n => n.id === conn.targetId);

            if (sourceNote?.groupId && targetNote?.groupId && sourceNote.groupId !== targetNote.groupId) {
                const key = [sourceNote.groupId, targetNote.groupId].sort().join('-');
                if (!connectionMap[key]) {
                    connectionMap[key] = { strength: 0, count: 0 };
                }
                connectionMap[key].strength += conn.similarity;
                connectionMap[key].count++;
            }
        });

        return Object.entries(connectionMap).map(([key, data]) => {
            const [groupA, groupB] = key.split('-');
            return { sourceId: groupA, targetId: groupB, similarity: Math.round(data.strength / data.count) };
        });
    }, [isGroupView, connections, notes]);

    // Connection counts for sizing
    const connectionCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        viewConnections.forEach(c => {
            counts[c.sourceId] = (counts[c.sourceId] || 0) + 1;
            counts[c.targetId] = (counts[c.targetId] || 0) + 1;
        });
        return counts;
    }, [viewConnections]);

    // Calculate radius
    const calculateRadius = useCallback((note: Note): number => {
        const contentScore = Math.min(note.content.length / 500, 1);
        const connectionScore = Math.min((connectionCounts[note.id] || 0) / 5, 1);
        const combinedScore = (contentScore * 0.6 + connectionScore * 0.4);
        return MIN_RADIUS + combinedScore * (MAX_RADIUS - MIN_RADIUS);
    }, [connectionCounts]);

    // Group positions
    const groupPositions = useMemo((): Record<string, BubblePosition> => {
        const positions: Record<string, BubblePosition> = {};
        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;

        // Position groups in a circle
        groups.forEach((group, index) => {
            const notesInGroup = notes.filter(n => n.groupId === group.id).length;
            const radius = GROUP_RADIUS + Math.min(notesInGroup * 4, 25);

            const angle = (2 * Math.PI * index) / Math.max(groups.length, 1);
            const radiusOffset = groups.length <= 1 ? 0 : 280;

            positions[group.id] = {
                x: centerX + radiusOffset * Math.cos(angle - Math.PI / 2),
                y: centerY + radiusOffset * Math.sin(angle - Math.PI / 2),
                radius,
            };
        });

        // Position orphan notes around the groups
        filteredOrphanNotes.forEach((note, index) => {
            const radius = calculateRadius(note);
            const angle = (2 * Math.PI * index) / Math.max(filteredOrphanNotes.length, 1);
            const radiusOffset = 500 + Math.floor(index / 8) * 150;

            positions[note.id] = {
                x: centerX + radiusOffset * Math.cos(angle),
                y: centerY + radiusOffset * Math.sin(angle),
                radius,
            };
        });

        return positions;
    }, [groups, notes, filteredOrphanNotes, calculateRadius]);

    // Note positions within a group
    const notePositions = useMemo((): Record<string, BubblePosition> => {
        const positions: Record<string, BubblePosition> = {};
        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;

        const sortedNotes = [...filteredGroupNotes].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        sortedNotes.forEach((note, index) => {
            const radius = calculateRadius(note);
            if (index === 0) {
                positions[note.id] = { x: centerX, y: centerY, radius };
            } else {
                const angle = (2 * Math.PI * (index - 1)) / Math.max(sortedNotes.length - 1, 1);
                const radiusOffset = 180 + Math.floor((index - 1) / 6) * 160;
                positions[note.id] = {
                    x: centerX + radiusOffset * Math.cos(angle),
                    y: centerY + radiusOffset * Math.sin(angle),
                    radius,
                };
            }
        });

        return positions;
    }, [filteredGroupNotes, calculateRadius]);

    // Merge positions with custom positions
    const bubblePositions = useMemo((): Record<string, BubblePosition> => {
        const basePositions = isGroupView ? groupPositions : notePositions;
        const merged: Record<string, BubblePosition> = {};
        for (const id in basePositions) {
            if (customPositions[id]) {
                merged[id] = { ...basePositions[id], ...customPositions[id] };
            } else {
                merged[id] = basePositions[id];
            }
        }
        return merged;
    }, [isGroupView, groupPositions, notePositions, customPositions]);

    // Reset on view change
    useEffect(() => {
        setCustomPositions({});
        setExplodedId(null);

        const items = isGroupView ? [...groups, ...filteredOrphanNotes] : filteredGroupNotes;
        if (items.length > 0 && containerSize.width > 0) {
            const firstItemId = isGroupView
                ? (groups[0]?.id || filteredOrphanNotes[0]?.id)
                : filteredGroupNotes[0]?.id;
            const positions = isGroupView ? groupPositions : notePositions;
            const pos = positions[firstItemId];

            if (pos) {
                setTransform({
                    x: containerSize.width / 2 - pos.x,
                    y: containerSize.height / 2 - pos.y,
                    scale: 1,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGroupId, containerSize.width]);

    // Container size observer
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

    // Prevent browser zoom
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventBrowserZoom = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) e.preventDefault();
        };

        container.addEventListener('wheel', preventBrowserZoom, { passive: false });
        return () => container.removeEventListener('wheel', preventBrowserZoom);
    }, []);

    // Wheel handler
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        if (e.ctrlKey || e.metaKey) {
            const delta = e.deltaY > 0 ? 0.95 : 1.05;
            const newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);

            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const newX = centerX - (centerX - transform.x) * (newScale / transform.scale);
                const newY = centerY - (centerY - transform.y) * (newScale / transform.scale);
                setTransform({ x: newX, y: newY, scale: newScale });
            }
        } else {
            setTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    }, [transform]);

    // Mouse handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0 && !draggingId) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
        }
    }, [transform, draggingId]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning && !draggingId) {
            setTransform(prev => ({ ...prev, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
        } else if (draggingId) {
            setHasDragged(true);
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const canvasX = (e.clientX - rect.left - transform.x) / transform.scale;
                const canvasY = (e.clientY - rect.top - transform.y) / transform.scale;
                setCustomPositions(prev => ({
                    ...prev,
                    [draggingId]: { x: canvasX - dragOffset.x, y: canvasY - dragOffset.y },
                }));
            }
        }
    }, [isPanning, panStart, draggingId, dragOffset, transform]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        setDraggingId(null);
        setTimeout(() => setHasDragged(false), 50);
    }, []);

    const handleBubbleMouseDown = useCallback((e: React.MouseEvent, id: string, pos: BubblePosition) => {
        e.stopPropagation();
        setHasDragged(false);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const canvasX = (e.clientX - rect.left - transform.x) / transform.scale;
            const canvasY = (e.clientY - rect.top - transform.y) / transform.scale;
            setDraggingId(id);
            setDragOffset({ x: canvasX - pos.x, y: canvasY - pos.y });
        }
    }, [transform]);

    const handleGroupClickEvent = useCallback((e: React.MouseEvent, groupId: string) => {
        e.stopPropagation();
        if (hasDragged) return;
        if (explodedId === groupId) {
            setExplodedId(null);
            onGroupClick(groupId);
        } else {
            setExplodedId(groupId);
        }
    }, [hasDragged, explodedId, onGroupClick]);

    const handleNoteClickEvent = useCallback((e: React.MouseEvent, noteId: string) => {
        e.stopPropagation();
        if (hasDragged) return;
        if (explodedId === noteId) {
            setExplodedId(null);
            onNoteClick(noteId);
        } else {
            setExplodedId(noteId);
        }
    }, [hasDragged, explodedId, onNoteClick]);

    const handleCanvasClick = useCallback(() => {
        if (explodedId) setExplodedId(null);
    }, [explodedId]);

    // Zoom controls
    const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }));
    const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.3) }));
    const resetView = () => {
        const center = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
        setTransform({ x: containerSize.width / 2 - center.x, y: containerSize.height / 2 - center.y, scale: 1 });
    };

    // Empty states
    if (isGroupView && groups.length === 0 && filteredOrphanNotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 bg-background">
                <div className="w-24 h-24 rounded-full bg-marker/30 mb-6" />
                <h3 className="text-lg font-semibold text-primary mb-2">Aucune note</h3>
                <p className="text-sm text-muted-foreground">Créez votre première note pour commencer !</p>
            </div>
        );
    }

    if (!isGroupView && filteredGroupNotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 bg-background">
                <div className="w-20 h-20 rounded-full bg-marker/30 mb-6" />
                <h3 className="text-lg font-semibold text-primary mb-2">
                    {searchQuery ? 'Aucun résultat' : 'Catégorie vide'}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Essayez une autre recherche' : 'Ajoutez des notes à cette catégorie'}
                </p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden select-none bg-secondary"
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={handleCanvasClick}
        >
            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--muted-foreground) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                    opacity: 0.1,
                }}
            />

            <ZoomControls scale={transform.scale} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />

            {/* Canvas */}
            <div
                className="absolute"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: '0 0',
                    width: CANVAS_SIZE,
                    height: CANVAS_SIZE,
                }}
            >
                <ConnectionLines
                    connections={viewConnections}
                    groupConnections={isGroupView ? groupConnections : []}
                    positions={bubblePositions}
                />

                {/* Groups */}
                {isGroupView && groups.map((group, index) => {
                    const pos = bubblePositions[group.id];
                    if (!pos) return null;
                    const notesInGroup = notes.filter(n => n.groupId === group.id);

                    return (
                        <GroupBubble
                            key={group.id}
                            group={group}
                            index={index}
                            position={pos}
                            notesInGroup={notesInGroup}
                            isDragging={draggingId === group.id}
                            isExploded={explodedId === group.id}
                            onMouseDown={(e) => handleBubbleMouseDown(e, group.id, pos)}
                            onClick={(e) => handleGroupClickEvent(e, group.id)}
                        />
                    );
                })}

                {/* Orphan notes (in group view) */}
                {isGroupView && filteredOrphanNotes.map((note, index) => {
                    const pos = bubblePositions[note.id];
                    if (!pos) return null;

                    return (
                        <NoteBubble
                            key={note.id}
                            note={note}
                            index={index + groups.length}
                            position={pos}
                            isSelected={selectedNoteId === note.id}
                            isDragging={draggingId === note.id}
                            isExploded={explodedId === note.id}
                            isOrphan
                            onMouseDown={(e) => handleBubbleMouseDown(e, note.id, pos)}
                            onClick={(e) => handleNoteClickEvent(e, note.id)}
                        />
                    );
                })}

                {/* Notes in selected group */}
                {!isGroupView && filteredGroupNotes.map((note, index) => {
                    const pos = bubblePositions[note.id];
                    if (!pos) return null;

                    return (
                        <NoteBubble
                            key={note.id}
                            note={note}
                            index={index}
                            position={pos}
                            isSelected={selectedNoteId === note.id}
                            isDragging={draggingId === note.id}
                            isExploded={explodedId === note.id}
                            onMouseDown={(e) => handleBubbleMouseDown(e, note.id, pos)}
                            onClick={(e) => handleNoteClickEvent(e, note.id)}
                        />
                    );
                })}
            </div>

            {/* Help text */}
            <div className="absolute bottom-4 left-4 z-30 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-muted/50 font-medium">
                <span className="text-primary">Glisser:</span> Déplacer • <span className="text-primary">Molette:</span> Zoom •
                <span className="text-primary"> Clic:</span> Aperçu • <span className="text-primary">Double clic:</span> {isGroupView ? 'Entrer' : 'Éditer'}
            </div>
        </div>
    );
}

export default BubbleView;

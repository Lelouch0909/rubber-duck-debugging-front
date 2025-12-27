'use client';
import React, { useMemo } from 'react';
import NoteCard from './NoteCard';
import { Note, NoteGroup } from '@/types/notebook';

interface ListViewProps {
    notes: Note[];
    groups: NoteGroup[];
    selectedNoteId: string | null;
    selectedGroupId: string | null;
    onNoteClick: (noteId: string) => void;
    onGroupClick: (groupId: string) => void;
    onBackToGroups: () => void;
    searchQuery: string;
}

function ListView({
    notes,
    groups,
    selectedNoteId,
    selectedGroupId,
    onNoteClick,
    onGroupClick,
    onBackToGroups,
    searchQuery
}: ListViewProps) {
    const isGroupView = selectedGroupId === null;

    // Filter notes by search and group
    const filteredNotes = useMemo(() => {
        let filtered = notes;

        // If in a specific group, filter by groupId
        if (!isGroupView) {
            filtered = notes.filter(n => n.groupId === selectedGroupId);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query) ||
                note.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [notes, selectedGroupId, isGroupView, searchQuery]);

    // Orphan notes (no group)
    const orphanNotes = useMemo(() => {
        if (!isGroupView) return [];

        let orphans = notes.filter(n => !n.groupId);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            orphans = orphans.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query) ||
                note.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return orphans;
    }, [notes, isGroupView, searchQuery]);

    // Sort by updated date (newest first)
    const sortedNotes = useMemo(() => [...filteredNotes].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ), [filteredNotes]);

    // Group view: show categories first, then orphan notes
    if (isGroupView) {
        // Filter groups by search
        const filteredGroups = groups.filter(group => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            // Match group name or notes within
            const notesInGroup = notes.filter(n => n.groupId === group.id);
            return group.name.toLowerCase().includes(query) ||
                notesInGroup.some(n =>
                    n.title.toLowerCase().includes(query) ||
                    n.content.toLowerCase().includes(query)
                );
        });

        if (filteredGroups.length === 0 && orphanNotes.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <svg className="w-16 h-16 text-muted-foreground mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        {searchQuery ? 'Aucun résultat' : 'Aucune catégorie'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'Essayez une autre recherche' : 'Créez votre première catégorie !'}
                    </p>
                </div>
            );
        }

        return (
            <div className="p-4 overflow-y-auto custom-scrollbar h-full">
                {/* Categories section */}
                {filteredGroups.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                            Catégories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredGroups.map((group) => {
                                const notesInGroup = notes.filter(n => n.groupId === group.id);
                                return (
                                    <div
                                        key={group.id}
                                        onClick={() => onGroupClick(group.id)}
                                        className="group cursor-pointer bg-card hover:bg-card-active rounded-xl p-5 border border-muted hover:border-marker transition-all duration-200 hover:shadow-lg"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                                style={{ background: group.color }}
                                            >
                                                {group.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                {notesInGroup.length} note{notesInGroup.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-primary mb-2 group-hover:text-marker transition-colors">
                                            {group.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-1">
                                            {notesInGroup.slice(0, 3).map(note => (
                                                <span key={note.id} className="text-xs text-muted-foreground truncate max-w-[80px]">
                                                    {note.title}
                                                </span>
                                            ))}
                                            {notesInGroup.length > 3 && (
                                                <span className="text-xs text-marker">+{notesInGroup.length - 3}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-marker mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Cliquez pour voir →
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Orphan notes section */}
                {orphanNotes.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                            Notes sans catégorie
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {orphanNotes.map((note) => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    isSelected={selectedNoteId === note.id}
                                    onClick={() => onNoteClick(note.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Note view inside a group
    if (sortedNotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <svg className="w-16 h-16 text-muted-foreground mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchQuery ? 'Aucun résultat' : 'Catégorie vide'}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Essayez une autre recherche' : 'Ajoutez des notes à cette catégorie'}
                </p>
                <button
                    onClick={onBackToGroups}
                    className="mt-4 text-sm text-marker hover:underline"
                >
                    ← Retour aux catégories
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 overflow-y-auto custom-scrollbar h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedNotes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        isSelected={selectedNoteId === note.id}
                        onClick={() => onNoteClick(note.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ListView;

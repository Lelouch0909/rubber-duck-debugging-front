'use client';
import React from 'react';
import NoteCard from './NoteCard';
import { Note } from '@/types/notebook';

interface ListViewProps {
    notes: Note[];
    selectedNoteId: string | null;
    onNoteClick: (noteId: string) => void;
    searchQuery: string;
}

function ListView({ notes, selectedNoteId, onNoteClick, searchQuery }: ListViewProps) {
    // Filter notes based on search query
    const filteredNotes = notes.filter(note => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );
    });

    // Sort by updated date (newest first)
    const sortedNotes = [...filteredNotes].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    if (sortedNotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <svg className="w-16 h-16 text-muted-foreground mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-y-auto custom-scrollbar">
            {sortedNotes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNoteId === note.id}
                    onClick={() => onNoteClick(note.id)}
                />
            ))}
        </div>
    );
}

export default ListView;

'use client';
import React, { useCallback } from 'react';
import { Note } from '@/types/notebook';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    setViewMode,
    setSelectedNote,
    addNote,
    updateNote,
    deleteNote,
    setSearchQuery,
    clearNewFlag,
    addTag,
    closeEditor,
    enterGroup,
    exitGroup,
} from '@/store/slices/notebookSlice';
import ViewToggle from './ViewToggle';
import BubbleView from './BubbleView';
import ListView from './ListView';
import NoteEditor from './NoteEditor';
import AddButton from '@/components/buttons/AddButton';

function NotebookDashboard() {
    const dispatch = useAppDispatch();
    const {
        notes,
        groups,
        connections,
        selectedNoteId,
        selectedGroupId,
        viewMode,
        isEditing,
        searchQuery,
        availableTags,
    } = useAppSelector((state) => state.notebook);

    const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;
    const currentGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

    // Filter notes by current group
    const filteredNotes = selectedGroupId
        ? notes.filter(n => n.groupId === selectedGroupId)
        : notes;

    const handleViewChange = useCallback((mode: 'bubble' | 'list') => {
        dispatch(setViewMode(mode));
    }, [dispatch]);

    const handleNoteClick = useCallback((noteId: string) => {
        dispatch(setSelectedNote(noteId));
        setTimeout(() => {
            dispatch(clearNewFlag(noteId));
        }, 2000);
    }, [dispatch]);

    const handleGroupClick = useCallback((groupId: string) => {
        dispatch(enterGroup(groupId));
    }, [dispatch]);

    const handleBackToGalaxies = useCallback(() => {
        dispatch(exitGroup());
    }, [dispatch]);

    const handleAddNote = useCallback(() => {
        dispatch(addNote({
            title: 'Nouvelle note',
            content: '',
            tags: [],
        }));
    }, [dispatch]);

    const handleSaveNote = useCallback((updates: Partial<Note>) => {
        if (selectedNoteId) {
            dispatch(updateNote({ id: selectedNoteId, updates }));
        }
    }, [dispatch, selectedNoteId]);

    const handleDeleteNote = useCallback(() => {
        if (selectedNoteId) {
            dispatch(deleteNote(selectedNoteId));
        }
    }, [dispatch, selectedNoteId]);

    const handleCloseEditor = useCallback(() => {
        dispatch(closeEditor());
    }, [dispatch]);

    const handleAddTag = useCallback((tag: string) => {
        dispatch(addTag(tag));
    }, [dispatch]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
    }, [dispatch]);

    return (
        <div className="flex h-full w-full bg-background text-primary animate-fadeIn">
            {/* Main content area */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isEditing ? 'w-[60%]' : 'w-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-muted">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {selectedGroupId && (
                                <button
                                    onClick={handleBackToGalaxies}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                    title="Retour aux galaxies"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            <svg className="w-6 h-6 text-marker" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h1 className="text-xl font-semibold">
                                {currentGroup ? currentGroup.name : 'Galaxies'}
                            </h1>
                        </div>
                        <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Rechercher..."
                                className="w-full px-4 py-2 bg-muted border border-muted rounded-lg text-sm focus:outline-none focus:border-marker transition-colors"
                            />
                        </div>
                        {selectedGroupId && <AddButton onClickEvent={handleAddNote} />}
                    </div>
                </div>

                {/* View content */}
                <div className="flex-1 overflow-hidden">
                    {viewMode === 'bubble' ? (
                        <BubbleView
                            notes={filteredNotes}
                            groups={groups}
                            connections={connections}
                            selectedNoteId={selectedNoteId}
                            selectedGroupId={selectedGroupId}
                            onNoteClick={handleNoteClick}
                            onGroupClick={handleGroupClick}
                            searchQuery={searchQuery}
                        />
                    ) : (
                        <ListView
                            notes={notes}
                            groups={groups}
                            selectedNoteId={selectedNoteId}
                            selectedGroupId={selectedGroupId}
                            onNoteClick={handleNoteClick}
                            onGroupClick={handleGroupClick}
                            onBackToGroups={handleBackToGalaxies}
                            searchQuery={searchQuery}
                        />
                    )}
                </div>

                {/* Stats bar */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-muted text-xs text-muted-foreground">
                    <span>
                        {selectedGroupId
                            ? `${filteredNotes.length} notes dans ${currentGroup?.name}`
                            : `${groups.length} galaxies • ${notes.length} notes`
                        }
                    </span>
                    <span>{connections.length} connexions</span>
                    <span>Vue: {viewMode === 'bubble' ? 'Bulles' : 'Liste'}</span>
                </div>
            </div>

            {/* Editor panel */}
            {isEditing && (
                <div className="w-[40%] border-l border-muted animate-slideInRight">
                    <NoteEditor
                        note={selectedNote}
                        availableTags={availableTags}
                        onSave={handleSaveNote}
                        onDelete={handleDeleteNote}
                        onClose={handleCloseEditor}
                        onAddTag={handleAddTag}
                    />
                </div>
            )}
        </div>
    );
}

export default NotebookDashboard;

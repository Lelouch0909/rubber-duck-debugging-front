'use client'
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { CustomProps } from "@/types/common/CustomProps";
import Card from "@/components/Card";
import AddButton from "@/components/buttons/AddButton";
import InputSearch from "@/components/InputSearch";
import Link from "next/link";
import RedirectButton from "@/components/buttons/RedirectButton";

interface Note {
    id: number;
    title: string;
    content: string;
    tags: string[];
    time: string;
    isNew?: boolean;
}

function RightSidebar({ className }: CustomProps) {
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [notes, setNotes] = useState<Note[]>([
        {
            id: 1,
            title: "React Hooks - useEffect",
            content: "useEffect permet de gérer les effets de bord :\n- Requêtes API\n- Subscriptions\n- Nettoyage de ressources\n\nSyntaxe : useEffect(() => {}, [])",
            tags: ["React", "Hooks"],
            time: "Il y a 1h"
        },
        {
            id: 2,
            title: "JavaScript Closures",
            content: "Une closure est une fonction qui a accès aux variables de son environnement lexical. Exemple : function outer() { let count = 0; return function inner() { count++; return count; }; }",
            tags: [],
            time: "Il y a 2h"
        }
    ]);
    const [availableTags, setAvailableTags] = useState<string[]>([
        "React", "Hooks", "JavaScript", "CSS", "TypeScript", "Node.js", "API"
    ]);
    const [newTag, setNewTag] = useState<string>("");
    const [editorTitle, setEditorTitle] = useState<string>("");
    const [editorValue, setEditorValue] = useState<string>("");
    const [editorTags, setEditorTags] = useState<string[]>([]);
    const [editorNoteId, setEditorNoteId] = useState<number | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Trier les notes pour mettre la sélectionnée en première position
    const sortedNotes = useMemo(() => {
        return [...notes].sort((a, b) => {
            if (a.id === selectedNoteId) return -1;
            if (b.id === selectedNoteId) return 1;
            return 0;
        });
    }, [notes, selectedNoteId]);

    // Sélectionner une note : sauvegarde de la note en cours si modifiée
    const handleNoteClick = useCallback((noteId: number) => {
        if (
            editorNoteId !== null &&
            editorNoteId !== noteId &&
            (editorTitle.trim() !== "" || editorValue.trim() !== "") &&
            (
                notes.find(n => n.id === editorNoteId)?.content !== editorValue ||
                notes.find(n => n.id === editorNoteId)?.title !== editorTitle ||
                JSON.stringify(notes.find(n => n.id === editorNoteId)?.tags) !== JSON.stringify(editorTags)
            )
        ) {
            // Nouvelle note depuis l'éditeur courant
            const nextId = notes.length ? Math.max(...notes.map(n => n.id)) + 1 : 1;
            setNotes(prev => [
                {
                    id: nextId,
                    title: editorTitle ? editorTitle : "Nouvelle note",
                    content: editorValue,
                    tags: editorTags,
                    time: "À l'instant",
                    isNew: true
                },
                ...prev
            ]);
            setTimeout(() => {
                setNotes(prev =>
                    prev.map(note =>
                        note.id === nextId ? { ...note, isNew: false } : note
                    )
                );
            }, 2000);
        }

        setSelectedNoteId(noteId);

        // Met à jour l'éditeur avec la note sélectionnée
        const note = notes.find(n => n.id === noteId);
        setEditorTitle(note ? note.title : "");
        setEditorValue(note ? note.content : "");
        setEditorTags(note ? note.tags : []);
        setEditorNoteId(noteId);

        // Retirer le flag isNew
        setNotes(prev =>
            prev.map(note =>
                note.id === noteId ? { ...note, isNew: false } : note
            )
        );

        setTimeout(() => {
            textareaRef.current?.focus();
        }, 0);
    }, [editorValue, editorTitle, editorTags, editorNoteId, notes]);

    // Ajout d'une nouvelle note
    const handleAddNewNote = useCallback(() => {
        const nextId = notes.length ? Math.max(...notes.map(n => n.id)) + 1 : 1;
        const newNote: Note = {
            id: nextId,
            title: "Nouvelle note",
            content: "",
            tags: [],
            time: "À l'instant",
            isNew: true
        };

        setNotes(prev => [newNote, ...prev]);
        setSelectedNoteId(nextId);
        setEditorNoteId(nextId);
        setEditorTitle("Nouvelle note");
        setEditorValue("");
        setEditorTags([]);

        setTimeout(() => {
            setNotes(prev =>
                prev.map(note =>
                    note.id === nextId ? { ...note, isNew: false } : note
                )
            );
        }, 2000);

        setTimeout(() => {
            textareaRef.current?.focus();
        }, 0);
    }, [notes]);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    // Ajout d'un tag dans la note ET dans la liste globale si absent
    const handleAddTag = useCallback(() => {
        const tag = newTag.trim();
        if (tag) {
            if (!editorTags.includes(tag)) {
                setEditorTags(tags => [...tags, tag]);
            }
            if (!availableTags.includes(tag)) {
                setAvailableTags(tags => [...tags, tag]);
            }
            setNewTag("");
        }
    }, [newTag, editorTags, availableTags]);

    // Ajout rapide d'un tag existant via clic
    const handleAddTagFromList = (tag: string) => {
        if (!editorTags.includes(tag)) setEditorTags(tags => [...tags, tag]);
    };

    // Suppression d'un tag assigné à la note en édition
    const handleRemoveEditorTag = (tag: string) => {
        setEditorTags(tags => tags.filter(t => t !== tag));
    };

    // Suppression d'un tag de la liste des tags disponibles
    const handleRemoveAvailableTag = (tag: string) => {
        setAvailableTags(tags => tags.filter(t => t !== tag));
        // En option, on peut aussi le retirer de toutes les notes (ceci est souvent attendu)
        setNotes(prev => prev.map(note => ({
            ...note,
            tags: note.tags.filter(t => t !== tag)
        })));
        // Retirer aussi du tag de l'éditeur si sélectionné
        setEditorTags(tags => tags.filter(t => t !== tag));
    };

    // Suppression d'une note
    const handleDeleteNote = () => {
        if (editorNoteId === null) return;
        setNotes(prev => prev.filter(note => note.id !== editorNoteId));

        // Sélectionne automatiquement une autre note ou vide l'éditeur
        const idx = notes.findIndex(note => note.id === editorNoteId);
        const nextNote = notes.filter(note => note.id !== editorNoteId)[idx] || notes.filter(note => note.id !== editorNoteId)[idx - 1] || null;
        if (nextNote) {
            setSelectedNoteId(nextNote.id);
            setEditorNoteId(nextNote.id);
            setEditorTitle(nextNote.title);
            setEditorValue(nextNote.content);
            setEditorTags(nextNote.tags);
        } else {
            setSelectedNoteId(null);
            setEditorNoteId(null);
            setEditorTitle("");
            setEditorValue("");
            setEditorTags([]);
        }
    };

    // Sauvegarde de la note en édition
    const handleSaveNote = () => {
        if (editorNoteId !== null) {
            setNotes(prev =>
                prev.map(note =>
                    note.id === editorNoteId
                        ? { ...note, title: editorTitle, content: editorValue, tags: editorTags }
                        : note
                )
            );
        } else if (editorValue.trim().length > 0 || editorTitle.trim().length > 0) {
            handleAddNewNote();
        }
    };

    const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditorValue(e.target.value);
    };
    const handleEditorTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditorTitle(e.target.value);
    };

    React.useEffect(() => {
        if (selectedNoteId !== editorNoteId) {
            const note = notes.find(n => n.id === selectedNoteId);
            setEditorValue(note ? note.content : "");
            setEditorTitle(note ? note.title : "");
            setEditorTags(note ? note.tags : []);
            setEditorNoteId(selectedNoteId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNoteId]);

    return (
        <div className={`${className ?? ''} text-primary flex flex-col transition-all duration-300 ${
            isCollapsed ? 'w-12' : 'w-[25%]'
        } relative`}>
            {/* Header */}
            <div className={`flex border-b border-muted relative flex-col gap-4 ${
                isCollapsed ? 'justify-center p-2' : 'justify-between p-4'
            }`}>
                {isCollapsed && (
                    <RedirectButton href={"/notebooks"}></RedirectButton>
                )}
                <div className="flex items-center justify-between w-full">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-marker" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            <h2 className="text-lg font-medium">Notebooks</h2>
                            <RedirectButton href={"/notebooks"}></RedirectButton>
                        </div>
                    )}

                    <div className="flex items-center">
                        <AddButton onClickEvent={handleAddNewNote} />
                    </div>
                </div>

                {/* Bouton collapse */}
                <button
                    onClick={toggleCollapse}
                    className="text-muted-foreground hover:text-primary transition-colors p-1 absolute z-50 top-10 -left-4 bg-background border-2 border-muted rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl hover:border-primary"
                    title={isCollapsed ? 'Étendre la sidebar' : 'Réduire la sidebar'}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d={isCollapsed ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                    </svg>
                </button>
                {!isCollapsed && (
                    <div className="w-full">
                        <InputSearch />
                    </div>
                )}
            </div>
            {/* Liste de notes */}
            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto px-2 pb-4 mt-2 custom-scrollbar max-h-[25%] border-b border-muted">
                    <div className="flex flex-col gap-0 ">
                        {sortedNotes.map((note) => {
                            const isSelected = selectedNoteId === note.id;
                            return (
                                <Card
                                    key={note.id}
                                    variant="note"
                                    onClickEvent={() => handleNoteClick(note.id)}
                                    active={isSelected}
                                    className={`transition-all duration-200 ${
                                        isSelected ? 'shadow-lg' : 'shadow-sm'
                                    } ${note.isNew ? 'ring-2 ring-marker ring-opacity-50' : ''}`}
                                >
                                    <Card.Header className="flex flex-col items-start gap-2">
                                        <div className="flex items-start justify-between w-full">
                                            <h3 className="text-sm font-medium text-sidebar-foreground line-clamp-1 flex-1">
                                                {note.title}
                                            </h3>
                                            <svg className="w-4 h-4 text-muted-foreground shrink-0 ml-2" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                            </svg>
                                        </div>
                                        {note.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 w-full">
                                                {note.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className={`text-white text-xs px-2 py-1 rounded ${
                                                            tag === 'React' ? 'bg-blue-500' :
                                                                tag === 'Hooks' ? 'bg-green-500' :
                                                                    tag === 'JavaScript' ? 'bg-yellow-500' :
                                                                        tag === 'CSS' ? 'bg-purple-500' :
                                                                            tag === 'TypeScript' ? 'bg-blue-600' :
                                                                                'bg-gray-500'
                                                        }`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </Card.Header>
                                    <Card.Content className="py-2">
                                        <div className="text-muted-foreground space-y-1 max-h-20 overflow-hidden">
                                            {note.content.split('\n').map((line, idx) =>
                                                <div key={idx} className="text-xs">{line || <br />}</div>
                                            )}
                                        </div>
                                    </Card.Content>
                                    <Card.Footer className="opacity-95">
                                        <div className="flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span className="text-xs text-muted-foreground">{note.time}</span>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
            {/* Zone d'édition */}
            {!isCollapsed && (
                <div className="flex flex-col flex-1 px-2 pt-3 pb-1 gap-2 border-b border-muted bg-background">
                    {/* Tags assignés à la note courante */}
                    {editorTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-1">
                            {editorTags.map((tag) => (
                                <span
                                    key={tag}
                                    className={`text-white text-xs px-2 py-1 rounded flex items-center gap-1 ${
                                        tag === 'React' ? 'bg-blue-500' :
                                            tag === 'Hooks' ? 'bg-green-500' :
                                                tag === 'JavaScript' ? 'bg-yellow-500' :
                                                    tag === 'CSS' ? 'bg-purple-500' :
                                                        tag === 'TypeScript' ? 'bg-blue-600' :
                                                            'bg-gray-500'
                                    }`}
                                >
                                    {tag}
                                    <button
                                        className="ml-1 text-white/80 hover:text-white text-xs"
                                        onClick={() => handleRemoveEditorTag(tag)}
                                        type="button"
                                    >×</button>
                                </span>
                            ))}
                        </div>
                    )}
                    <input
                        type="text"
                        value={editorTitle}
                        onChange={handleEditorTitleChange}
                        placeholder="Titre de la note"
                        className="border border-muted rounded px-2 py-1 text-sm font-semibold bg-transparent mb-1"
                    />
                    <textarea
                        ref={textareaRef}
                        name="notebook"
                        className="border border-muted h-36 resize-vertical rounded p-2 w-full text-sm bg-transparent"
                        placeholder="Écrire votre note ici..."
                        value={editorValue}
                        onChange={handleEditorChange}
                    />
                    <div className="flex gap-2 justify-between">
                        <button
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
                            onClick={handleDeleteNote}
                            type="button"
                            disabled={editorNoteId === null}
                        >
                            Supprimer
                        </button>
                        <button
                            className="px-3 py-1 bg-marker hover:bg-markerHover text-white rounded text-xs font-semibold"
                            onClick={handleSaveNote}
                            type="button"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            )}
            {/* Section Tags bas */}
            {!isCollapsed && (
                <div className="border-t border-muted mt-auto pt-4 px-2">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                            </svg>
                            <span className="text-sm font-medium text-muted-foreground">Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {availableTags.map((tag) => (
                                <span
                                    key={tag}
                                    className={`flex items-center text-white text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 ${
                                        tag === 'React' ? 'bg-blue-500' :
                                            tag === 'Hooks' ? 'bg-green-500' :
                                                tag === 'JavaScript' ? 'bg-yellow-500' :
                                                    tag === 'CSS' ? 'bg-purple-500' :
                                                        tag === 'TypeScript' ? 'bg-blue-600' :
                                                            'bg-gray-500'
                                    }`}
                                >
                                    <span onClick={() => handleAddTagFromList(tag)}>{tag}</span>
                                    <button
                                        className="ml-1 text-white/70 hover:text-white text-xs"
                                        onClick={() => handleRemoveAvailableTag(tag)}
                                        title="Supprimer ce tag de la liste"
                                        type="button"
                                    >×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Nouveau tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                className="flex-1 px-2 py-1 text-xs bg-muted border border-muted-foreground rounded focus:outline-none focus:border-marker"
                            />
                            <button
                                onClick={handleAddTag}
                                className="w-6 h-6 bg-marker hover:bg-markerHover rounded flex items-center justify-center transition-colors"
                            >
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RightSidebar;
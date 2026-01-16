'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Note } from '@/types/notebook';
import MarkdownRenderer from './MarkdownRenderer';
import { getTagColor, formatRelativeTime } from './NoteCard';

interface NoteEditorProps {
    note: Note | null;
    availableTags: string[];
    onSave: (updates: Partial<Note>) => void;
    onDelete: () => void;
    onClose: () => void;
    onAddTag: (tag: string) => void;
}

function NoteEditor({ note, availableTags, onSave, onDelete, onClose, onAddTag }: NoteEditorProps) {
    const [title, setTitle] = useState(note?.title ?? '');
    const [content, setContent] = useState(note?.content ?? '');
    const [tags, setTags] = useState<string[]>(note?.tags ?? []);
    const [newTag, setNewTag] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Update state when note changes
    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setTags(note.tags);
        }
    }, [note]);

    // Focus textarea on mount
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const handleSave = () => {
        onSave({ title, content, tags });
    };

    const handleAddTag = () => {
        const tag = newTag.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            onAddTag(tag);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleAddExistingTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    // Insert markdown formatting
    const insertFormat = (prefix: string, suffix: string = prefix) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.slice(start, end);
        const newContent = content.slice(0, start) + prefix + selectedText + suffix + content.slice(end);

        setContent(newContent);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    if (!note) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Sélectionnez une note pour l&apos;éditer
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-muted">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Fermer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 w-full"
                        placeholder="Titre de la note"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowMetadata(!showMetadata)}
                        className={`p-2 rounded-lg transition-colors ${showMetadata ? 'bg-muted text-marker' : 'hover:bg-muted'}`}
                        title="Métadonnées"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`p-2 rounded-lg transition-colors ${showPreview ? 'bg-muted text-marker' : 'hover:bg-muted'}`}
                        title={showPreview ? 'Éditer' : 'Prévisualiser'}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showPreview ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Metadata panel */}
            {showMetadata && (
                <div className="p-4 bg-muted/30 border-b border-muted text-sm animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-muted-foreground">Créée le:</span>
                            <span className="ml-2">{new Date(note.createdAt).toLocaleString('fr-FR')}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Modifiée le:</span>
                            <span className="ml-2">{new Date(note.updatedAt).toLocaleString('fr-FR')}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Dernière modification:</span>
                            <span className="ml-2">{formatRelativeTime(note.updatedAt)}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Taille:</span>
                            <span className="ml-2">{content.length} caractères</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tags */}
            <div className="p-4 border-b border-muted">
                <div className="flex flex-wrap gap-2 items-center">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="flex items-center gap-1 text-white text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: getTagColor(tag) }}
                        >
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-200"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="Ajouter un tag..."
                            className="px-2 py-1 text-xs bg-muted border border-muted-foreground rounded focus:outline-none focus:border-marker w-28"
                        />
                        <button
                            onClick={handleAddTag}
                            className="w-6 h-6 bg-marker hover:bg-markerHover rounded flex items-center justify-center transition-colors"
                        >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Available tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {availableTags
                        .filter(t => !tags.includes(t))
                        .slice(0, 5)
                        .map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleAddExistingTag(tag)}
                                className="text-xs px-2 py-0.5 rounded border border-muted-foreground text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                            >
                                + {tag}
                            </button>
                        ))}
                </div>
            </div>

            {/* Formatting toolbar */}
            {!showPreview && (
                <div className="flex items-center gap-1 p-2 border-b border-muted bg-muted/20">
                    <button
                        onClick={() => insertFormat('**')}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Gras (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        onClick={() => insertFormat('*')}
                        className="p-2 hover:bg-muted rounded transition-colors italic"
                        title="Italique (Ctrl+I)"
                    >
                        I
                    </button>
                    <button
                        onClick={() => insertFormat('`')}
                        className="p-2 hover:bg-muted rounded transition-colors font-mono text-sm"
                        title="Code inline"
                    >
                        {'</>'}
                    </button>
                    <button
                        onClick={() => insertFormat('\n```\n', '\n```\n')}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Bloc de code"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </button>
                    <div className="w-px h-6 bg-muted mx-1" />
                    <button
                        onClick={() => insertFormat('## ', '')}
                        className="p-2 hover:bg-muted rounded transition-colors text-sm font-semibold"
                        title="Titre H2"
                    >
                        H2
                    </button>
                    <button
                        onClick={() => insertFormat('### ', '')}
                        className="p-2 hover:bg-muted rounded transition-colors text-sm font-semibold"
                        title="Titre H3"
                    >
                        H3
                    </button>
                    <div className="w-px h-6 bg-muted mx-1" />
                    <button
                        onClick={() => insertFormat('- ', '')}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Liste à puces"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => insertFormat('> ', '')}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Citation"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Editor / Preview */}
            <div className="flex-1 overflow-hidden">
                {showPreview ? (
                    <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                        <MarkdownRenderer content={content} />
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full p-4 bg-transparent resize-none outline-none font-mono text-sm custom-scrollbar"
                        placeholder="Écrivez votre note en Markdown..."
                    />
                )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between p-4 border-t border-muted">
                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-marker hover:bg-markerHover text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5 13l4 4L19 7" />
                    </svg>
                    Enregistrer
                </button>
            </div>
        </div>
    );
}

export default NoteEditor;

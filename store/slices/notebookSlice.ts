import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, NoteConnection, NotebookState } from '@/types/notebook';

// Mock data for development
const mockNotes: Note[] = [
    {
        id: '1',
        title: 'React Hooks - useEffect',
        content: '## useEffect\n\nuseEffect permet de gérer les effets de bord :\n- **Requêtes API**\n- **Subscriptions**\n- **Nettoyage de ressources**\n\n```javascript\nuseEffect(() => {\n  // effet\n  return () => {\n    // cleanup\n  };\n}, [dependencies]);\n```',
        tags: ['React', 'Hooks'],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: '2',
        title: 'JavaScript Closures',
        content: '## Closures\n\nUne **closure** est une fonction qui a accès aux variables de son environnement lexical.\n\n```javascript\nfunction outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  };\n}\n```\n\n> Les closures sont utilisées pour créer des *variables privées*.',
        tags: ['JavaScript'],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        id: '3',
        title: 'TypeScript Generics',
        content: '## Generics\n\nLes **generics** permettent de créer des composants réutilisables.\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\nconst result = identity<string>("hello");\n```\n\n### Avantages\n1. Type-safety\n2. Réutilisabilité\n3. Moins de duplication',
        tags: ['TypeScript'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: '4',
        title: 'CSS Grid Layout',
        content: '## CSS Grid\n\nGrid est un système de layout bidimensionnel.\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n```\n\n### Propriétés clés\n- `grid-template-columns`\n- `grid-template-rows`\n- `gap`\n- `grid-area`',
        tags: ['CSS'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
];

// Mock connections based on tags similarity
const mockConnections: NoteConnection[] = [
    { sourceId: '1', targetId: '2', similarity: 6 },  // React/JS connection
    { sourceId: '1', targetId: '3', similarity: 4 },  // React/TS connection
    { sourceId: '2', targetId: '3', similarity: 7 },  // JS/TS strong connection
    { sourceId: '3', targetId: '4', similarity: 2 },  // TS/CSS weak connection
];

const initialState: NotebookState = {
    notes: mockNotes,
    connections: mockConnections,
    selectedNoteId: null,
    viewMode: 'bubble',
    isEditing: false,
    searchQuery: '',
    availableTags: ['React', 'Hooks', 'JavaScript', 'TypeScript', 'CSS', 'Node.js', 'API'],
};

const notebookSlice = createSlice({
    name: 'notebook',
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction<'bubble' | 'list'>) => {
            state.viewMode = action.payload;
        },

        setSelectedNote: (state, action: PayloadAction<string | null>) => {
            state.selectedNoteId = action.payload;
            state.isEditing = action.payload !== null;
        },

        addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
            const newNote: Note = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isNew: true,
            };
            state.notes.unshift(newNote);
            state.selectedNoteId = newNote.id;
            state.isEditing = true;
        },

        updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Note> }>) => {
            const { id, updates } = action.payload;
            const noteIndex = state.notes.findIndex(n => n.id === id);
            if (noteIndex !== -1) {
                state.notes[noteIndex] = {
                    ...state.notes[noteIndex],
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
            }
        },

        deleteNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter(n => n.id !== action.payload);
            state.connections = state.connections.filter(
                c => c.sourceId !== action.payload && c.targetId !== action.payload
            );
            if (state.selectedNoteId === action.payload) {
                state.selectedNoteId = null;
                state.isEditing = false;
            }
        },

        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },

        setConnections: (state, action: PayloadAction<NoteConnection[]>) => {
            state.connections = action.payload;
        },

        clearNewFlag: (state, action: PayloadAction<string>) => {
            const note = state.notes.find(n => n.id === action.payload);
            if (note) {
                note.isNew = false;
            }
        },

        addTag: (state, action: PayloadAction<string>) => {
            if (!state.availableTags.includes(action.payload)) {
                state.availableTags.push(action.payload);
            }
        },

        removeTag: (state, action: PayloadAction<string>) => {
            state.availableTags = state.availableTags.filter(t => t !== action.payload);
            // Remove tag from all notes
            state.notes = state.notes.map(note => ({
                ...note,
                tags: note.tags.filter(t => t !== action.payload),
            }));
        },

        closeEditor: (state) => {
            state.selectedNoteId = null;
            state.isEditing = false;
        },
    },
});

export const {
    setViewMode,
    setSelectedNote,
    addNote,
    updateNote,
    deleteNote,
    setSearchQuery,
    setConnections,
    clearNewFlag,
    addTag,
    removeTag,
    closeEditor,
} = notebookSlice.actions;

export default notebookSlice.reducer;

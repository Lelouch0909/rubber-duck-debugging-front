import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, NoteConnection, NoteGroup, NotebookState } from '@/types/notebook';

// Mock groups for development
const mockGroups: NoteGroup[] = [
    {
        id: 'group-1',
        name: 'Frontend',
        color: 'radial-gradient(ellipse at center, #667eea 0%, #764ba2 30%, #1a1a2e 70%)',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'group-2',
        name: 'Backend',
        color: 'radial-gradient(ellipse at center, #4facfe 0%, #00f2fe 30%, #1a1a2e 70%)',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'group-3',
        name: 'DevOps',
        color: 'radial-gradient(ellipse at center, #43e97b 0%, #38f9d7 30%, #1a1a2e 70%)',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
    },
];

// Mock data for development
const mockNotes: Note[] = [
    {
        id: '1',
        title: 'React Hooks - useEffect',
        content: '## useEffect\n\nuseEffect permet de gérer les effets de bord.',
        tags: ['React', 'Hooks'],
        groupId: 'group-1',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: '2',
        title: 'JavaScript Closures',
        content: '## Closures\n\nUne closure est une fonction qui a accès aux variables de son environnement.',
        tags: ['JavaScript'],
        groupId: 'group-1',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        id: '3',
        title: 'TypeScript Generics',
        content: '## Generics\n\nLes generics permettent de créer des composants réutilisables.',
        tags: ['TypeScript'],
        groupId: 'group-1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: '4',
        title: 'CSS Grid Layout',
        content: '## CSS Grid\n\nGrid est un système de layout bidimensionnel.',
        tags: ['CSS'],
        groupId: 'group-1',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: '5',
        title: 'Node.js API REST',
        content: '## API REST avec Express\n\nCréation d\'APIs avec Node.js et Express.',
        tags: ['Node.js', 'API'],
        groupId: 'group-2',
        createdAt: new Date(Date.now() - 100000000).toISOString(),
        updatedAt: new Date(Date.now() - 100000000).toISOString(),
    },
    {
        id: '6',
        title: 'Docker Basics',
        content: '## Docker\n\nConteneurisation avec Docker.',
        tags: ['Docker', 'DevOps'],
        groupId: 'group-3',
        createdAt: new Date(Date.now() - 200000000).toISOString(),
        updatedAt: new Date(Date.now() - 200000000).toISOString(),
    },
    // Orphan notes (no group)
    {
        id: '7',
        title: 'Git Workflow',
        content: '## Git\n\nGestion de versions avec Git et GitHub.',
        tags: ['Git', 'DevOps'],
        // No groupId - this is an orphan note
        createdAt: new Date(Date.now() - 50000000).toISOString(),
        updatedAt: new Date(Date.now() - 50000000).toISOString(),
    },
    {
        id: '8',
        title: 'Clean Code Principles',
        content: '## Clean Code\n\nPrincipes de code propre et maintenable.',
        tags: ['Best Practices'],
        // No groupId - this is an orphan note
        createdAt: new Date(Date.now() - 60000000).toISOString(),
        updatedAt: new Date(Date.now() - 60000000).toISOString(),
    },
];

// Mock connections based on tags similarity
const mockConnections: NoteConnection[] = [
    { sourceId: '1', targetId: '2', similarity: 6 },
    { sourceId: '1', targetId: '3', similarity: 4 },
    { sourceId: '2', targetId: '3', similarity: 7 },
    { sourceId: '3', targetId: '4', similarity: 2 },
    // Inter-group connections
    { sourceId: '1', targetId: '5', similarity: 3 },  // Frontend -> Backend
    { sourceId: '5', targetId: '6', similarity: 5 },  // Backend -> DevOps
    // Orphan connections
    { sourceId: '7', targetId: '8', similarity: 4 },  // Git -> Clean Code
    { sourceId: '6', targetId: '7', similarity: 6 },  // Docker -> Git
];

const initialState: NotebookState = {
    notes: mockNotes,
    groups: mockGroups,
    connections: mockConnections,
    selectedNoteId: null,
    selectedGroupId: null,
    viewMode: 'bubble',
    isEditing: false,
    searchQuery: '',
    availableTags: ['React', 'Hooks', 'JavaScript', 'TypeScript', 'CSS', 'Node.js', 'API', 'Docker', 'DevOps'],
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

        enterGroup: (state, action: PayloadAction<string>) => {
            state.selectedGroupId = action.payload;
            state.selectedNoteId = null;
            state.isEditing = false;
        },

        exitGroup: (state) => {
            state.selectedGroupId = null;
            state.selectedNoteId = null;
            state.isEditing = false;
        },

        addGroup: (state, action: PayloadAction<{ name: string; color: string }>) => {
            const newGroup: NoteGroup = {
                id: `group-${Date.now()}`,
                name: action.payload.name,
                color: action.payload.color,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            state.groups.push(newGroup);
        },

        updateGroup: (state, action: PayloadAction<{ id: string; updates: Partial<NoteGroup> }>) => {
            const { id, updates } = action.payload;
            const groupIndex = state.groups.findIndex(g => g.id === id);
            if (groupIndex !== -1) {
                state.groups[groupIndex] = {
                    ...state.groups[groupIndex],
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
            }
        },

        deleteGroup: (state, action: PayloadAction<string>) => {
            state.groups = state.groups.filter(g => g.id !== action.payload);
            state.notes = state.notes.map(n =>
                n.groupId === action.payload ? { ...n, groupId: undefined } : n
            );
            if (state.selectedGroupId === action.payload) {
                state.selectedGroupId = null;
            }
        },

        addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
            const newNote: Note = {
                ...action.payload,
                id: Date.now().toString(),
                groupId: state.selectedGroupId || undefined,
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

        moveNoteToGroup: (state, action: PayloadAction<{ noteId: string; groupId: string | undefined }>) => {
            const { noteId, groupId } = action.payload;
            const noteIndex = state.notes.findIndex(n => n.id === noteId);
            if (noteIndex !== -1) {
                state.notes[noteIndex] = {
                    ...state.notes[noteIndex],
                    groupId,
                    updatedAt: new Date().toISOString(),
                };
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
    enterGroup,
    exitGroup,
    addGroup,
    updateGroup,
    deleteGroup,
    addNote,
    updateNote,
    deleteNote,
    moveNoteToGroup,
    setSearchQuery,
    setConnections,
    clearNewFlag,
    addTag,
    removeTag,
    closeEditor,
} = notebookSlice.actions;

export default notebookSlice.reducer;

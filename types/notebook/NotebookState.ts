import { Note } from './Note';
import { NoteConnection } from './NoteConnection';

export interface NotebookState {
    notes: Note[];
    connections: NoteConnection[];
    selectedNoteId: string | null;
    viewMode: 'bubble' | 'list';
    isEditing: boolean;
    searchQuery: string;
    availableTags: string[];
}

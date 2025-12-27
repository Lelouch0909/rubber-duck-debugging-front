import { Note } from './Note';
import { NoteConnection } from './NoteConnection';
import { NoteGroup } from './NoteGroup';

export interface NotebookState {
    notes: Note[];
    groups: NoteGroup[];
    connections: NoteConnection[];
    selectedNoteId: string | null;
    selectedGroupId: string | null;  // null = galaxy view, string = inside a galaxy
    viewMode: 'bubble' | 'list';
    isEditing: boolean;
    searchQuery: string;
    availableTags: string[];
}

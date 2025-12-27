export interface Note {
    id: string;
    title: string;
    content: string;  // Markdown content
    tags: string[];
    groupId?: string;  // Optional group/galaxy ID
    createdAt: string;  // ISO date
    updatedAt: string;  // ISO date
    isNew?: boolean;
}
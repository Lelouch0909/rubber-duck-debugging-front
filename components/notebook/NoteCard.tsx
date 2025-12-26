'use client';
import React from 'react';
import Card from '@/components/Card';
import { Note } from '@/types/notebook';

interface NoteCardProps {
    note: Note;
    isSelected: boolean;
    onClick: () => void;
}

// Tag color mapping
const getTagColor = (tag: string): string => {
    const colors: Record<string, string> = {
        'React': 'bg-blue-500',
        'Hooks': 'bg-green-500',
        'JavaScript': 'bg-yellow-500',
        'CSS': 'bg-purple-500',
        'TypeScript': 'bg-blue-600',
        'Node.js': 'bg-green-600',
        'API': 'bg-orange-500',
    };
    return colors[tag] || 'bg-gray-500';
};

// Format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
};

function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
    // Get preview text (first 100 chars without markdown)
    const getPreview = (content: string): string => {
        return content
            .replace(/#{1,6}\s/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/`{1,3}[^`]*`{1,3}/g, '')
            .replace(/\n/g, ' ')
            .slice(0, 100);
    };

    return (
        <Card
            variant="note"
            onClickEvent={onClick}
            active={isSelected}
            className={`transition-all duration-200 ${isSelected ? 'shadow-lg' : 'shadow-sm'
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
                {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 w-full">
                        {note.tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`text-white text-xs px-2 py-0.5 rounded ${getTagColor(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </Card.Header>
            <Card.Content className="py-2">
                <p className="text-muted-foreground text-xs line-clamp-2">
                    {getPreview(note.content)}
                </p>
            </Card.Content>
            <Card.Footer className="opacity-95">
                <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(note.updatedAt)}
                    </span>
                </div>
            </Card.Footer>
        </Card>
    );
}

export default NoteCard;
export { getTagColor, formatRelativeTime };

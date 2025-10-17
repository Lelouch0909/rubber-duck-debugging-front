
interface Note {
    id: number;
    title: string;
    content: string;
    tags: string[];
    time: string;
    isNew?: boolean;
}
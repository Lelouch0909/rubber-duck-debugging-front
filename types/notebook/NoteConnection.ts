export interface NoteConnection {
    sourceId: string;
    targetId: string;
    similarity: number;  // 0-10, determines line color (0=white, 5=red, 10=black)
}

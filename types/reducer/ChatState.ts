interface ChatState {
    chats: Record<string, Chat>;
    currentChatId: string | null;
    isTyping: boolean;
    messageIdCounter: number;
}
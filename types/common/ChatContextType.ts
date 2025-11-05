interface ChatContextType {
    chats: Map<string, Chat>;
    currentChatId: string | null;
    addMessage: (chatId: string, message: Message) => void;
    createChat: (initialMessage: Message) => string;
    getChat: (chatId: string) => Chat | undefined;
    setCurrentChatId: (chatId: string | null) => void;
    generateMessageId: () => number;
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChatState = {
    chats: {},
    currentChatId: null,
    isTyping: false,
    messageIdCounter: 0,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        createChat: (state, action: PayloadAction<{ chatId: string; initialMessage: Message }>) => {
            const { chatId, initialMessage } = action.payload;
            const newChat: Chat = {
                id: chatId,
                messages: [initialMessage],
                createdAt: new Date(),
            };

            state.chats[chatId] = newChat;
            state.currentChatId = chatId;
        },

        addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
            const { chatId, message } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                chat.messages.push(message);
            }
        },

        setCurrentChatId: (state, action: PayloadAction<string | null>) => {
            state.currentChatId = action.payload;
        },

        setIsTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        },

        incrementMessageId: (state) => {
            state.messageIdCounter += 1;
        },

        deleteChat: (state, action: PayloadAction<string>) => {
            delete state.chats[action.payload];

            if (state.currentChatId === action.payload) {
                state.currentChatId = null;
            }
        },

        updateMessage: (state, action: PayloadAction<{ chatId: string; messageId: number; content: string }>) => {
            const { chatId, messageId, content } = action.payload;
            const chat = state.chats[chatId];

            if (chat) {
                const messageIndex = chat.messages.findIndex(m => m.id === messageId);
                if (messageIndex !== -1) {
                    chat.messages[messageIndex].content = content;
                }
            }
        },
    },
});

export const {
    createChat,
    addMessage,
    setCurrentChatId,
    setIsTyping,
    incrementMessageId,
    deleteChat,
    updateMessage,
} = chatSlice.actions;

export default chatSlice.reducer;


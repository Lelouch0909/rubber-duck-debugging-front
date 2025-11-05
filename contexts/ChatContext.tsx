'use client';
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';


const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<Map<string, Chat>>(new Map());
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const messageIdCounter = useRef(0);

    const generateChatId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const generateMessageId = () => {
        messageIdCounter.current += 1;
        return Date.now() * 1000 + messageIdCounter.current;
    };

    const createChat = (initialMessage: Message): string => {
        const chatId = generateChatId();
        const newChat: Chat = {
            id: chatId,
            messages: [initialMessage],
            createdAt: new Date(),
        };

        setChats(prev => {
            const newChats = new Map(prev);
            newChats.set(chatId, newChat);
            return newChats;
        });

        setCurrentChatId(chatId);
        return chatId;
    };

    const addMessage = (chatId: string, message: Message) => {
        setChats(prev => {
            const newChats = new Map(prev);
            const chat = newChats.get(chatId);
            if (chat) {
                chat.messages.push(message);
                newChats.set(chatId, { ...chat });
            }
            return newChats;
        });
    };

    const getChat = (chatId: string): Chat | undefined => {
        return chats.get(chatId);
    };

    return (
        <ChatContext.Provider value={{
            chats,
            currentChatId,
            addMessage,
            createChat,
            getChat,
            setCurrentChatId,
            generateMessageId
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};


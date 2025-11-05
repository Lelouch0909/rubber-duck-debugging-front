import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    createChat as createChatAction,
    addMessage as addMessageAction,
    setCurrentChatId,
    incrementMessageId,
    setIsTyping,
} from '@/store/slices/chatSlice';
import { setIsSending } from '@/store/slices/uiSlice';

export const useChatRedux = () => {
    const dispatch = useAppDispatch();
    const chats = useAppSelector((state) => state.chat.chats);
    const currentChatId = useAppSelector((state) => state.chat.currentChatId);
    const isTyping = useAppSelector((state) => state.chat.isTyping);
    const messageIdCounter = useAppSelector((state) => state.chat.messageIdCounter);
    const isSending = useAppSelector((state) => state.ui.isSending);

    const generateChatId = useCallback(() => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }, []);

    const generateMessageId = useCallback(() => {
        dispatch(incrementMessageId());
        return Date.now() * 1000 + messageIdCounter + 1;
    }, [dispatch, messageIdCounter]);

    const createChat = useCallback((initialMessage: Message): string => {
        const chatId = generateChatId();
        dispatch(createChatAction({ chatId, initialMessage }));
        return chatId;
    }, [dispatch, generateChatId]);

    const addMessage = useCallback((chatId: string, message: Message) => {
        dispatch(addMessageAction({ chatId, message }));
    }, [dispatch]);

    const getChat = useCallback((chatId: string): Chat | undefined => {
        return chats[chatId];
    }, [chats]);

    const setCurrentChat = useCallback((chatId: string | null) => {
        dispatch(setCurrentChatId(chatId));
    }, [dispatch]);

    const setTyping = useCallback((typing: boolean) => {
        dispatch(setIsTyping(typing));
    }, [dispatch]);

    const setSending = useCallback((sending: boolean) => {
        dispatch(setIsSending(sending));
    }, [dispatch]);

    return {
        chats,
        currentChatId,
        isTyping,
        isSending,
        createChat,
        addMessage,
        getChat,
        setCurrentChatId: setCurrentChat,
        generateMessageId,
        setIsTyping: setTyping,
        setIsSending: setSending,
    };
};


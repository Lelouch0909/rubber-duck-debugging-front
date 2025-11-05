import { useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useChatRedux } from './useChatRedux';
import { useGetAssistantResponseMutation } from '@/store/slices/apiSlice';

export const useChatSendRedux = () => {
    const pathname = usePathname();
    const router = useRouter();
    const {
        createChat,
        addMessage,
        currentChatId,
        generateMessageId,
        setIsTyping,
        setIsSending,
    } = useChatRedux();

    const [getAssistantResponse] = useGetAssistantResponseMutation();
    const isSendingRef = useRef(false);
    const lastMessageTimeRef = useRef(0);

    const handleSend = useCallback(async (content: string) => {
        // Éviter les doubles envois rapides (debounce de 500ms)
        const now = Date.now();
        if (now - lastMessageTimeRef.current < 500) {
            console.log('Message ignoré - envoi trop rapide');
            return;
        }
        lastMessageTimeRef.current = now;

        // Éviter les envois simultanés
        if (isSendingRef.current) {
            console.log('Message ignoré - envoi en cours');
            return;
        }

        isSendingRef.current = true;
        setIsSending(true);

        try {
            if (pathname === '/') {
                // Sur la page d'accueil, créer une nouvelle conversation
                const userMessage: Message = {
                    id: generateMessageId(),
                    role: 'user',
                    content,
                    timestamp: 'A l\'instant'
                };
                const chatId = createChat(userMessage);

                // Rediriger immédiatement vers la nouvelle conversation
                router.push(`/c/${chatId}`);

                // Activer l'indicateur de typing
                setIsTyping(true);

                // Appeler l'API pour obtenir la réponse de l'assistant
                try {
                    const response = await getAssistantResponse({
                        chatId,
                        messageContent: content,
                    }).unwrap();

                    // Ajouter la réponse de l'assistant
                    const assistantMessage: Message = {
                        id: generateMessageId(),
                        role: 'assistant',
                        content: response.content || 'Excellente question ! 🎯\n\nLaisse-moi t\'aider avec ça.',
                        timestamp: 'A l\'instant'
                    };
                    addMessage(chatId, assistantMessage);
                } catch (error) {
                    console.error('Erreur API:', error);
                    // Fallback sur une réponse par défaut si l'API échoue
                    const assistantMessage: Message = {
                        id: generateMessageId(),
                        role: 'assistant',
                        content: 'Excellente question ! 🎯\n\nLaisse-moi t\'aider avec ça. Peux-tu me donner plus de détails sur ce que tu essaies d\'accomplir ?',
                        timestamp: 'A l\'instant'
                    };
                    addMessage(chatId, assistantMessage);
                }

                setIsTyping(false);

            } else if (pathname?.startsWith('/c/') && currentChatId) {
                // Dans une conversation existante, ajouter le message
                const userMessage: Message = {
                    id: generateMessageId(),
                    role: 'user',
                    content,
                    timestamp: 'A l\'instant'
                };
                addMessage(currentChatId, userMessage);

                // Activer l'indicateur de typing
                setIsTyping(true);

                // Appeler l'API pour obtenir la réponse de l'assistant
                try {
                    const response = await getAssistantResponse({
                        chatId: currentChatId,
                        messageContent: content,
                    }).unwrap();

                    const assistantMessage: Message = {
                        id: generateMessageId(),
                        role: 'assistant',
                        content: response.content || 'Excellente question ! 🎯\n\nLaisse-moi t\'aider avec ça.',
                        timestamp: 'A l\'instant'
                    };
                    addMessage(currentChatId, assistantMessage);
                } catch (error) {
                    console.error('Erreur API:', error);
                    // Fallback sur une réponse par défaut
                    const assistantMessage: Message = {
                        id: generateMessageId(),
                        role: 'assistant',
                        content: 'Excellente question ! 🎯\n\nLaisse-moi t\'aider avec ça. Peux-tu me donner plus de détails sur ce que tu essaies d\'accomplir ?',
                        timestamp: 'A l\'instant'
                    };
                    addMessage(currentChatId, assistantMessage);
                }

                setIsTyping(false);
            }
        } finally {
            isSendingRef.current = false;
            setIsSending(false);
        }
    }, [
        pathname,
        router,
        createChat,
        addMessage,
        currentChatId,
        generateMessageId,
        setIsTyping,
        setIsSending,
        getAssistantResponse,
    ]);

    return handleSend;
};


'use client';
import { usePathname } from 'next/navigation';
import { useChatContext } from '@/contexts/ChatContext';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export function useChatSend() {
    const pathname = usePathname();
    const { createChat, addMessage, currentChatId, generateMessageId } = useChatContext();
    const router = useRouter();
    const isSendingRef = useRef(false);
    const lastMessageTimeRef = useRef(0);

    const handleSend = (content: string) => {
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

        if (pathname === '/') {
            // Sur la page d'accueil, créer une nouvelle conversation
            const userMessage = {
                id: generateMessageId(),
                role: 'user' as const,
                content,
                timestamp: 'A l\'instant'
            };
            const chatId = createChat(userMessage);

            // Rediriger immédiatement vers la nouvelle conversation
            router.push(`/c/${chatId}`);

            // Simuler une réponse de l'assistant après la redirection
            setTimeout(() => {
                const assistantMessage = {
                    id: generateMessageId(),
                    role: 'assistant' as const,
                    content: 'Excellente question ! 🎯\n\nLaisse-moi t\'aider avec ça. Peux-tu me donner plus de détails sur ce que tu essaies d\'accomplir ?',
                    timestamp: 'A l\'instant'
                };
                addMessage(chatId, assistantMessage);
                isSendingRef.current = false;
            }, 800);

        } else if (pathname?.startsWith('/c/') && currentChatId) {
            // Dans une conversation existante, ajouter le message
            const userMessage = {
                id: generateMessageId(),
                role: 'user' as const,
                content,
                timestamp: 'A l\'instant'
            };
            addMessage(currentChatId, userMessage);

            // Simuler une réponse de l'assistant
            setTimeout(() => {
                const assistantMessage = {
                    id: generateMessageId(),
                    role: 'assistant' as const,
                    content: 'Excellente question ! 🎯\n\nLaisse-moi t\'aider avec ça. Peux-tu me donner plus de détails sur ce que tu essaies d\'accomplir ?',
                    timestamp: 'A l\'instant'
                };
                addMessage(currentChatId, assistantMessage);
                isSendingRef.current = false;
            }, 800);
        } else {
            isSendingRef.current = false;
        }
    };

    return handleSend;
}


'use client';
import React, { useEffect, useState, useRef } from 'react';
import { CustomProps } from "@/types/common/CustomProps";
import Image from "next/image";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useChatRedux } from "@/hooks/useChatRedux";
import { useParams } from "next/navigation";

function Page(_params: CustomProps) {
    const params = useParams();
    const chatId = params['chat-id'] as string;
    const { getChat, setCurrentChatId, isTyping } = useChatRedux();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const previousMessageCountRef = useRef(0);

    // Fonction pour scroller vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Mettre à jour les messages quand le chatId change ou quand le chat est mis à jour
    useEffect(() => {
        if (chatId) {
            setCurrentChatId(chatId);
            const chat = getChat(chatId);
            if (chat) {
                setMessages(chat.messages);
                previousMessageCountRef.current = chat.messages.length;
                // Scroll après un court délai pour laisser le temps au rendu
                setTimeout(scrollToBottom, 100);
            }
        }
    }, [chatId, getChat, setCurrentChatId]);

    // Écouter les changements dans le Redux store
    useEffect(() => {
        const interval = setInterval(() => {
            const chat = getChat(chatId);
            if (chat && JSON.stringify(chat.messages) !== JSON.stringify(messages)) {
                const newMessages = [...chat.messages];

                setMessages(newMessages);
                previousMessageCountRef.current = newMessages.length;
                // Scroll automatique quand un nouveau message arrive
                setTimeout(scrollToBottom, 100);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [chatId, getChat, messages]);

    return messages.length === 0 ? (
        <div className={"flex flex-col items-center justify-center h-full text-center animate-fadeIn"}>
            <Image
                src="/rubberduck_logo.png"
                width={120}
                height={120}
                alt="Rubberduck"
                className={"mb-6 opacity-50 animate-float"}
            />
            <h2 className={"text-xl font-medium text-primary mb-2"}>
                Chargement de la conversation...
            </h2>
        </div>
    ) : (
        <div ref={containerRef} className={"flex-1 overflow-y-auto px-4 py-6 pb-32 custom-scrollbar"}>
            <div className={"flex flex-col gap-6 max-w-4xl mx-auto w-full"}>
                {messages.map((message, index) => (
                    <div
                        key={`${message.id}-${index}`}
                        className="animate-slideIn"
                        style={{
                            animationDelay: `${Math.min(index * 50, 300)}ms`,
                            animationFillMode: 'backwards'
                        }}
                    >
                        <ChatMessage message={message} />
                    </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}

export default Page;
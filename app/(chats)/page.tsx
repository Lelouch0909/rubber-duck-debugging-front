'use client'
import Chat from "@/components/Chat";
import Image from "next/image";
import React from "react";
import ChatMessage from "@/components/ChatMessage";

export default function Home() {
const defaultMessage =       {
        id: 1,
        role: 'assistant' as const,
        content: 'Salut ! Je suis Quack, ton canard en plastique évolué 🦆 Je suis là pour t\'aider à apprendre le code, pas juste te donner les réponses. Quelle technologie veux-tu explorer aujourd\'hui ?',
        timestamp: 'A l\'instant'
    };

  return (
    <div className={"flex-1 overflow-y-auto px-4 py-6 pb-32 custom-scrollbar"}>
        <ChatMessage message={defaultMessage}></ChatMessage>
            <div className={"flex flex-col items-center justify-center h-full text-center"}>
                  <Image
                    src="/rubberduck_logo.png"
                    width={120}
                    height={120}
                    alt="Rubberduck"
                    className={"mb-6 opacity-50"}
                />
                <h2 className={"text-xl font-medium text-primary mb-2"}>
                    Commencez une conversation
                </h2>
                <p className={"text-muted-foreground"}>
                    Posez vos questions sur le code et je vous aiderai !
                </p>
            </div>
    </div>

);
}

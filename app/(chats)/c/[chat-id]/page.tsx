import React from 'react';
import {CustomProps} from "@/types/common/CustomProps";
import Image from "next/image";
import ChatMessage from "@/components/ChatMessage";

function Page({className}: CustomProps) {
    const messages = [
        {
            id: 1,
            role: 'user' as const,
            content: 'Salut ! Je suis Quack, ton canard en plastique évolué 🦆 Je suis là pour t\'aider à apprendre le code, pas juste te donner les réponses. Quelle technologie veux-tu explorer aujourd\'hui ?',
            timestamp: 'Il y a 5 min'
        },
        {
            id: 2,
            role: 'assistant' as const,
            content: 'Bonjour ! Je voudrais comprendre comment fonctionne React Hooks, en particulier useState et useEffect.',
            timestamp: 'Il y a 4 min'
        },
        {
            id: 3,
            role: 'user' as const,
            content: 'Excellente question ! 🎯\n\nCommençons par useState. Peux-tu me dire ce que tu sais déjà sur la gestion de l\'état dans React ? Cela m\'aidera à t\'expliquer de manière plus ciblée.',
            timestamp: 'Il y a 3 min'
        },
        {
            id: 4,
            role: 'assistant' as const,
            content: 'Je sais que l\'état permet de stocker des données qui changent dans le temps, mais je ne comprends pas bien comment useState fonctionne en pratique.',
            timestamp: 'Il y a 2 min'
        },
        {
            id: 5,
            role: 'user' as const,
            content: 'Parfait ! Tu as raison. 👍\n\nuseState retourne deux choses : la valeur actuelle et une fonction pour la modifier.\n\nEssaie de créer un compteur simple. Quelle serait ta première ligne de code ?',
            timestamp: 'Il y a 1 min'
        }
    ];
    return (

            messages.length === 0 ?
                (
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
                ) :
                (
                    <div className={"flex flex-col gap-6 max-w-4xl mx-auto"}>
                        {messages.map((message) => <ChatMessage message={message}></ChatMessage>)}
                    </div>
                ))

}

export default Page;
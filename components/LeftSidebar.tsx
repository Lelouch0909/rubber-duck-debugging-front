'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { useSession } from "next-auth/react";
import AddButton from "@/components/buttons/AddButton";
import InputSearch from "@/components/InputSearch";
import { CustomProps } from "@/types/common/CustomProps";
import Image from "next/image";
import Card from "@/components/Card";
import AuthButtons from "@/components/auth/AuthButtons";


function LeftSidebar({ className }: CustomProps) {
    const { data: session } = useSession();
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [conversations, setConversations] = useState<Discussion[]>([
        {
            id: 1,
            title: "Introduction aux React Hooks",
            messages: 24,
            time: "Il y a 2 jours"
        },
        {
            id: 2,
            title: "JavaScript Closures expliqués",
            messages: 18,
            time: "Il y a 1h"
        },
        {
            id: 3,
            title: "CSS Grid vs Flexbox",
            messages: 15,
            time: "Il y a 3 jours"
        },
        {
            id: 4,
            title: "API REST avec Node.js",
            messages: 32,
            time: "Il y a 5 jours"
        },
        {
            id: 5,
            title: "TypeScript Interfaces",
            messages: 12,
            time: "Il y a 5 sept."
        }
    ]);

    // Trier les conversations pour mettre la sélectionnée en première position
    const sortedConversations = useMemo(() => {
        return [...conversations].sort((a, b) => {
            if (a.id === selectedConversationId) return -1;
            if (b.id === selectedConversationId) return 1;
            return 0;
        });
    }, [conversations, selectedConversationId]);

    const getRandomTopic = () => {
        const topics = [
            { title: "Nouvelle conversation React", badge: "React", badgeColor: "bg-blue-500" },
            { title: "Discussion JavaScript", badge: "JavaScript", badgeColor: "bg-yellow-500" },
            { title: "Problème CSS", badge: "CSS", badgeColor: "bg-purple-500" },
            { title: "Question Node.js", badge: "Backend", badgeColor: "bg-green-500" },
            { title: "TypeScript Help", badge: "TypeScript", badgeColor: "bg-blue-600" },
            { title: "Python Discussion", badge: "Python", badgeColor: "bg-green-600" },
            { title: "Vue.js Question", badge: "Vue", badgeColor: "bg-emerald-500" },
            { title: "Angular Problem", badge: "Angular", badgeColor: "bg-red-500" }
        ];
        return topics[Math.floor(Math.random() * topics.length)];
    };

    const handleCardClick = useCallback((conversationId: number) => {
        setSelectedConversationId(conversationId);

        // Retirer le flag isNew
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId ? { ...conv, isNew: false } : conv
            )
        );
    }, []);

    const handleAddNewConversation = useCallback(() => {
        const newTopic = getRandomTopic();
        const newId = Math.max(...conversations.map(c => c.id)) + 1;

        const newConversation: Discussion = {
            id: newId,
            title: newTopic.title,
            messages: 0,
            time: "À l'instant",
            isNew: true
        };

        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversationId(newId);

        setTimeout(() => {
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === newId ? { ...conv, isNew: false } : conv
                )
            );
        }, 2000);
    }, [conversations]);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    return (
        <div className={`${className} text-primary flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-[25%]'
            } relative`}>

            <div className={`flex  border-b border-muted relative flex-col gap-4 ${isCollapsed ? 'justify-center p-2' : 'justify-between  p-4'
                }`}>
                <div className={"flex  items-center justify-between w-full"}>
                    {!isCollapsed && (

                        <h2 className="text-lg font-medium">Conversations</h2>
                    )}

                    <div className="flex items-center ">
                        <AddButton onClickEvent={handleAddNewConversation} />
                    </div>
                </div>


                <button
                    onClick={toggleCollapse}
                    className={`text-muted-foreground hover:text-primary transition-colors p-1 absolute z-50 ${'top-10 -right-4 bg-background border-2 border-muted rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl hover:border-primary'
                        }`}
                    title={isCollapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                    </svg>
                </button>
                {!isCollapsed && (
                    <div className="w-full">
                        <InputSearch />
                    </div>
                )}

            </div>


            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto px-2 pb-4 mt-2 custom-scrollbar">
                    <div className="flex flex-col gap-4">
                        {sortedConversations.map((conversation) => {
                            const isSelected = selectedConversationId === conversation.id;

                            return (
                                <Card
                                    key={conversation.id}
                                    variant="history"
                                    onClickEvent={() => {
                                        handleCardClick(conversation.id);
                                    }}
                                    active={isSelected}
                                    className={`transition-all duration-200 ${isSelected ? 'shadow-lg' : 'shadow-sm'
                                        } ${conversation.isNew ? 'ring-2 ring-marker ring-opacity-50' : ''
                                        }`}
                                >
                                    <Card.Header>
                                        <h3 className="text-sm font-medium text-sidebar-foreground line-clamp-2 flex-1">
                                            {conversation.title}
                                        </h3>

                                    </Card.Header>

                                    <Card.Footer className="opacity-95">
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" className="lucide lucide-message-square w-3 h-3"
                                                aria-hidden="true">
                                                <path
                                                    d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
                                            </svg>
                                            <span>{conversation.messages} msgs</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{conversation.time}</span>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="border-t border-muted mt-auto pt-4">
                <Card className="bg-inherit border-0 w-full text-secondary-foreground">
                    <Card.Content className={`text-xs flex  gap-2 items-center 
                    }`}>
                        <Image
                            src={session?.user?.image || "/rubberduck_logo.png"}
                            width={40}
                            height={40}
                            alt="profile"
                            className="shrink-0 rounded-full"
                        />
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden w-full">
                                {session ? (
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium truncate">
                                            {session.user?.name}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground truncate flex-1">
                                                {session.user?.email}
                                            </p>
                                            <AuthButtons />
                                        </div>
                                    </div>
                                ) : (
                                    <AuthButtons />
                                )}
                            </div>
                        )}
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
}

export default LeftSidebar;

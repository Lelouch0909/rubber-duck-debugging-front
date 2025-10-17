import React from 'react';
import Image from "next/image";

const ChatMessage = ({message} : { message: Message }) => {
    return (
        <div
            key={message.id}
            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
            <div className={"shrink-0"}>
                {message.role === 'assistant' ? (
                    <div
                        className={"w-10 h-10 rounded-full bg-marker flex items-center justify-center"}>
                        <Image
                            src="/rubberduck_logo.png"
                            width={28}
                            height={28}
                            alt="Assistant"
                            className={"rounded-full"}
                        />
                    </div>
                ) : (
                    <div
                        className={"w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary font-medium"}>
                        U
                    </div>
                )}
            </div>

            {/* Message bubble */}
            <div className={`flex flex-col gap-1 max-w-[70%]`}>
                <div
                    className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                            ? 'bg-marker text-white'
                            : 'bg-card text-primary'
                    }`}
                >
                    <p className={"text-sm whitespace-pre-wrap"}>{message.content}</p>
                </div>
                <span
                    className={`text-xs text-muted-foreground ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.timestamp}
                                    </span>
            </div>
        </div>
    )
};

export default ChatMessage;
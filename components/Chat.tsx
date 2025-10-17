import React from 'react';
import {CustomProps} from "@/types/common/CustomProps";
import FooterChat from "@/components/FooterChat";
import Image from "next/image";

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatProps extends CustomProps {
    messages?: Message[];
}

function Chat({className, children, messages = []} : ChatProps) {
    return (
        <div className={`${className} relative h-full flex flex-col`}>
            {/* Zone de messages avec scroll */}

            {children}
            {/* Footer fixe en bas */}
            <div className={"absolute bottom-0 w-full flex items-center justify-center"}>
                <FooterChat />
            </div>

        </div>
    );
}

export default Chat;
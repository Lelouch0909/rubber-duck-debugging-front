'use client';
import React from 'react';
import {CustomProps} from "@/types/common/CustomProps";
import FooterChat from "@/components/FooterChat";


interface ChatProps extends CustomProps {
    messages?: Message[];
    onSend?: (message: string) => void;
}

function ChatsBloc({className, children, messages = [], onSend} : ChatProps) {
    return (
        <div className={`${className} relative h-full flex flex-col`}>
            {/* Zone de messages avec scroll */}

            {children}

            {/* Footer fixe en bas */}
            <div className={"absolute bottom-0 w-full flex items-center justify-center"}>
                <FooterChat onSend={onSend} />
            </div>

        </div>
    );
}

export default ChatsBloc;
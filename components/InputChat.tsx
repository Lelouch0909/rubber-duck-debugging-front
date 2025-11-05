"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

interface InputChatProps {
  className?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
}

const InputChat = forwardRef<{ sendMessage: () => void }, InputChatProps>(
  ({ className = "", onSend, disabled = false }, ref) => {
    const [chatInput, setChatInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleEditorChange = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setChatInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleSend = () => {
      if (chatInput.trim() && onSend) {
        onSend(chatInput.trim());
        setChatInput("");
      }
    };

    // Exposer handleSend via ref
    useImperativeHandle(ref, () => ({
      sendMessage: handleSend,
    }));

    // Ajuste automatiquement la hauteur du textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
      }
    }, [chatInput]);

    return (
      <div className={`relative w-full ${className}`}>
        <textarea
          ref={textareaRef}
          name="notebook"
          className="border-none resize-none rounded p-2 w-full bg-transparent pl-3 pr-4 py-2 outline-none overflow-y-auto align-middle text-[1rem] min-h-[40px] max-h-[200px]"
          placeholder="Pose une question sur le code..."
          value={chatInput}
          onChange={handleEditorChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
      </div>
    );
  }
);

InputChat.displayName = "InputChat";

export default InputChat;

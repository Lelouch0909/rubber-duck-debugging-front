"use client";
import React, { useState, useRef, useEffect } from "react";

function InputChat({
  className = "",
}: {
  className?: string;
}) {
  const [chatInput, setChatInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditorChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setChatInput(e.target.value);
  };

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
        rows={1}
      />
    </div>
  );
}

export default InputChat;

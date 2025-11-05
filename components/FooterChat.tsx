"use client";
import { CustomProps } from "@/types/common/CustomProps";
import AddButton from "@/components/buttons/AddButton";
import InputChat from "@/components/InputChat";
import { Send } from "lucide-react";
import { useRef } from "react";
import { useChatRedux } from "@/hooks/useChatRedux";

interface FooterChatProps extends CustomProps {
  onSend?: (message: string) => void;
  disabled?: boolean;
}

const FooterChat = ({ className, onSend, disabled = false }: FooterChatProps) => {
  const inputChatRef = useRef<{ sendMessage: () => void }>(null);
  const { isSending } = useChatRedux();

  const handleSend = (message: string) => {
    if (message.trim() && onSend && !isSending) {
      onSend(message);
    }
  };

  const handleSendClick = () => {
    if (!isSending) {
      inputChatRef.current?.sendMessage();
    }
  };

  return (
    <div
      className={`${
        className ?? ""
      } w-full md:w-2/3 bg-background flex flex-col items-center justify-around gap-2 py-3 px-4 border-muted rounded-xl mb-2 border-t-[1px]`}
    >
      <InputChat
        ref={inputChatRef}
        className={"w-full"}
        onSend={handleSend}
        disabled={disabled || isSending}
      />

      <div className={"w-full flex justify-between items-center"}>
        <div className={"flex items-center gap-2"}>
          <AddButton />
          <span className={"text-sm text-muted"}>Add files</span>
        </div>

        <div className={"flex items-center gap-3"}>
          <span className={"text-sm text-muted hidden sm:inline"}>
            Press Enter to send
          </span>

          <button
            type="button"
            aria-label="Envoyer"
            disabled={disabled || isSending}
            onClick={handleSendClick}
            className={
              "flex items-center gap-2 bg-marker hover:bg-markerHover text-white rounded-md px-3 py-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            }
          >
            <Send className="w-4 h-4" />
            <span className={"text-sm font-medium"}>
              {isSending ? "Envoi..." : "Envoyer"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterChat;


import {CustomProps} from "@/types/common/CustomProps";
import AddButton from "@/components/buttons/AddButton";
import InputChat from "@/components/InputChat";
import { Send } from "lucide-react";

const FooterChat = ({className} : CustomProps) => (
    <div className={`${className ?? ""} w-full md:w-2/3 bg-background flex flex-col items-center justify-around gap-2 py-3 px-4 border-muted rounded-xl mb-2 border-t-[1px]`}>
        <InputChat className={"w-full"} />

        <div className={'w-full flex justify-between items-center'}>
            <div className={"flex items-center gap-2"}>
                {/* Utilise le AddButton par défaut pour garder la cohérence */}
                <AddButton />
                <span className={"text-sm text-muted"}>Add files</span>
            </div>

            <div className={"flex items-center gap-3"}>
                <span className={"text-sm text-muted hidden sm:inline"}>Press Enter to send</span>

                <button
                    type="button"
                    aria-label="Envoyer"
                    className={"flex items-center gap-2 bg-marker hover:bg-markerHover text-white rounded-md px-3 py-2 transition-colors shadow-sm"}
                >
                    <Send className="w-4 h-4" />
                    <span className={"text-sm font-medium"}>Envoyer</span>
                </button>
            </div>
        </div>
    </div>
);

export default FooterChat;
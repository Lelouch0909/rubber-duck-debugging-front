import {CustomProps} from "@/types/common/CustomProps";

export interface RedirectButtonProps extends CustomProps {
    onClickEvent?: () => void;
    href: string;
}
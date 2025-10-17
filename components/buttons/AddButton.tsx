import React from 'react';
import {AddButtonProps} from "@/types/common/AddButtonProps";

function AddButton({className, onClickEvent} : AddButtonProps) {
    return (
        <button
            className={className ? className : "bg-marker hover:bg-markerHover text-black rounded-md p-[10px] w-[32px] h-[32px] flex items-center justify-center font-bold text-lg transition-colors"}
            onClick={onClickEvent}
        >
            +
        </button>
    );
}

export default AddButton;
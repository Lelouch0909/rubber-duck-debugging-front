import React from "react";

export interface CardProps {
    children?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'conversation' | 'history' | 'note';
    active?: boolean;
    onClickEvent?: () => void;
}

export interface CardHeaderProps {
    children?: React.ReactNode;
    className?: string;
}

export interface CardContentProps {
    children?: React.ReactNode;
    className?: string;
}

export interface CardFooterProps {
    children?: React.ReactNode;
    className?: string;
}
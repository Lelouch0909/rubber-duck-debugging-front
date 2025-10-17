import React from 'react';
import {CardContentProps, CardFooterProps, CardHeaderProps, CardProps} from "@/types/common/Card";


function Card({ children, className = '', variant = 'default', onClickEvent, active = false }: CardProps) {

    let baseClasses = 'p-2 rounded-[14px] border border-muted shadow-sm';

    switch (variant) {
        case 'conversation':
            baseClasses += ' mb-3';
            baseClasses += active ? ' bg-card-active' : ' bg-card';
            break;
        case  'note':
            baseClasses += ' mb-3 cursor-pointer hover:border-accent/50 transition-colors hover:scale-102 hover:border-muted-foreground';
            baseClasses += active ? ' bg-card-active' : ' bg-card';
            break;
        case 'history':
            baseClasses += ' h-18 cursor-pointer hover:border-accent/50 transition-colors hover:scale-102 hover:border-muted-foreground';
            baseClasses += active ? ' bg-card-active border-muted-foreground' : ' bg-card';
            break;
        case 'default':
        default:
            baseClasses = className;
            break;
    }


    return (
        <div className={`${baseClasses} ${className}`} onClick={onClickEvent}>
            {children}
        </div>
    );
}

function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`flex items-start justify-between mb-2 ${className}`}>
            {children}
        </div>
    );
}

function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
}

function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`flex items-center justify-between text-xs text-muted-foreground ${className}`}>
            {children}
        </div>
    );
}

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
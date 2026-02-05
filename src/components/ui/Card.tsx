import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
}

export function Card({ className, glass, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl transition-all',
                glass
                    ? 'glass'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

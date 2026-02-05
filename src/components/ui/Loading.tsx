import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export function Loading({ className, size = 'md', fullScreen, ...props }: LoadingProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    const spinner = (
        <Loader2
            className={cn(
                'animate-spin text-primary-600',
                sizes[size],
                className
            )}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
                {spinner}
            </div>
        );
    }

    return <div className="flex justify-center p-4" {...props}>{spinner}</div>;
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200", className)}
            {...props}
        />
    );
}

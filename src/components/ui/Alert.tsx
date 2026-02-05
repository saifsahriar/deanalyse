import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
    title?: string;
}

const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
};

const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
};

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
    const Icon = icons[variant];
    return (
        <div
            role="alert"
            className={cn(
                'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] pl-11',
                styles[variant],
                className
            )}
            {...props}
        >
            <Icon className="h-5 w-5" />
            <div className="space-y-1">
                {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
                <div className="text-sm opacity-90">{children}</div>
            </div>
        </div>
    );
}

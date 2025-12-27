import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, label, id, ...props }, ref) => {
        const generatedId = React.useId();
        const textareaId = id || generatedId;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-surface-700"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    id={textareaId}
                    className={cn(
                        'flex min-h-[100px] w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm transition-colors',
                        'placeholder:text-surface-400',
                        'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                        'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-50',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };

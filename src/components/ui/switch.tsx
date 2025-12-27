'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    id?: string;
    className?: string;
}

function Switch({
    checked = false,
    onCheckedChange,
    disabled = false,
    label,
    id,
    className,
}: SwitchProps) {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <button
                type="button"
                role="switch"
                id={switchId}
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    checked ? 'bg-primary-600' : 'bg-surface-200'
                )}
            >
                <span
                    className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
                        checked ? 'translate-x-5' : 'translate-x-0'
                    )}
                />
            </button>
            {label && (
                <label
                    htmlFor={switchId}
                    className="text-sm font-medium text-surface-700 cursor-pointer"
                >
                    {label}
                </label>
            )}
        </div>
    );
}

export { Switch };

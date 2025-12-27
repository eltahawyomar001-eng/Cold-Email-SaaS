import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, id, ...props }, ref) => {
        const checkboxId = id || React.useId();

        return (
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id={checkboxId}
                    className={cn(
                        'h-4 w-4 rounded border-surface-300 text-primary-600 transition-colors',
                        'focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="text-sm font-medium text-surface-700 cursor-pointer"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

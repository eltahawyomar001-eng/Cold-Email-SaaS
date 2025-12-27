import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, label, id, options, ...props }, ref) => {
        const selectId = id || React.useId();

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-surface-700"
                    >
                        {label}
                    </label>
                )}
                <select
                    id={selectId}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm transition-colors',
                        'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                        'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-50',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';

export { Select };

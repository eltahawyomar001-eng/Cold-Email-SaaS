import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-slate-100 text-slate-700',
                primary: 'bg-blue-50 text-blue-700 ring-1 ring-blue-500/20',
                secondary: 'bg-slate-100 text-slate-600',
                success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20',
                warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20',
                destructive: 'bg-red-50 text-red-700 ring-1 ring-red-500/20',
                info: 'bg-sky-50 text-sky-700 ring-1 ring-sky-500/20',
                purple: 'bg-violet-50 text-violet-700 ring-1 ring-violet-500/20',
                gradient: 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm',
            },
            size: {
                default: 'px-3 py-1 text-xs',
                sm: 'px-2 py-0.5 text-[10px]',
                lg: 'px-4 py-1.5 text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
    dotColor?: string;
}

function Badge({ className, variant, size, dot, dotColor, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {dot && (
                <span
                    className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        dotColor || (variant === 'success' ? 'bg-emerald-500' :
                            variant === 'warning' ? 'bg-amber-500' :
                                variant === 'destructive' ? 'bg-red-500' : 'bg-slate-400')
                    )}
                />
            )}
            {children}
        </div>
    );
}

export { Badge, badgeVariants };

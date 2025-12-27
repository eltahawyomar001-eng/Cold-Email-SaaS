'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >
            {Icon && (
                <div className="rounded-full bg-surface-100 p-4 mb-4">
                    <Icon className="h-8 w-8 text-surface-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-surface-500 max-w-sm">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn, getInitials, getAvatarColor } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
};

const sizePx = {
    sm: 32,
    md: 40,
    lg: 48,
};

function Avatar({ className, src, alt, name, size = 'md', ...props }: AvatarProps) {
    const [imgError, setImgError] = React.useState(false);

    const showFallback = !src || imgError;
    const initials = name ? getInitials(name) : '?';
    const bgColor = name ? getAvatarColor(name) : 'bg-surface-500';

    return (
        <div
            className={cn(
                'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full',
                sizeClasses[size],
                showFallback && bgColor,
                showFallback && 'text-white font-medium',
                className
            )}
            {...props}
        >
            {!showFallback ? (
                <Image
                    src={src}
                    alt={alt || name || 'Avatar'}
                    width={sizePx[size]}
                    height={sizePx[size]}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
}

export { Avatar };

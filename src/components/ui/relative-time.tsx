'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface RelativeTimeProps {
    date: Date | string;
    className?: string;
}

/**
 * Client-side relative time component to avoid hydration mismatches
 * The time difference is calculated on the client only
 */
export function RelativeTime({ date, className }: RelativeTimeProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const d = typeof date === 'string' ? parseISO(date) : date;

    // Show a static format on server, relative time on client
    if (!mounted) {
        return <span className={className}>...</span>;
    }

    return (
        <span className={className}>
            {formatDistanceToNow(d, { addSuffix: true })}
        </span>
    );
}

'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error('Dialog components must be used within a Dialog');
    }
    return context;
}

interface DialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const handleOpenChange = React.useCallback(
        (newOpen: boolean) => {
            if (!isControlled) {
                setUncontrolledOpen(newOpen);
            }
            onOpenChange?.(newOpen);
        },
        [isControlled, onOpenChange]
    );

    return (
        <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
}

interface DialogTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

function DialogTrigger({ children, asChild }: DialogTriggerProps) {
    const { onOpenChange } = useDialog();

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
            onClick: () => onOpenChange(true),
        });
    }

    return (
        <button type="button" onClick={() => onOpenChange(true)}>
            {children}
        </button>
    );
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

function DialogContent({ children, className }: DialogContentProps) {
    const { open, onOpenChange } = useDialog();

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 animate-fade-in"
                onClick={() => onOpenChange(false)}
            />

            {/* Content */}
            <div
                className={cn(
                    'relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl animate-slide-up',
                    className
                )}
            >
                <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 p-1 rounded-md text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
                {children}
            </div>
        </div>
    );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}
            {...props}
        />
    );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn('text-lg font-semibold text-surface-900', className)}
            {...props}
        />
    );
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn('text-sm text-surface-500', className)}
            {...props}
        />
    );
}

function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('p-6', className)}
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('flex justify-end space-x-2 p-6 pt-0', className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
};

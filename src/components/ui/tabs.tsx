'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs');
    }
    return context;
}

interface TabsProps {
    children: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

function Tabs({ children, value: controlledValue, defaultValue = '', onValueChange, className }: TabsProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = React.useCallback(
        (newValue: string) => {
            if (!isControlled) {
                setUncontrolledValue(newValue);
            }
            onValueChange?.(newValue);
        },
        [isControlled, onValueChange]
    );

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

function TabsList({ children, className }: TabsListProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-lg bg-surface-100 p-1',
                className
            )}
            role="tablist"
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    children: React.ReactNode;
    value: string;
    className?: string;
    disabled?: boolean;
}

function TabsTrigger({ children, value, className, disabled }: TabsTriggerProps) {
    const { value: selectedValue, onValueChange } = useTabs();
    const isSelected = selectedValue === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => onValueChange(value)}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20',
                'disabled:pointer-events-none disabled:opacity-50',
                isSelected
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900',
                className
            )}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    children: React.ReactNode;
    value: string;
    className?: string;
}

function TabsContent({ children, value, className }: TabsContentProps) {
    const { value: selectedValue } = useTabs();

    if (selectedValue !== value) return null;

    return (
        <div
            role="tabpanel"
            className={cn('mt-4 animate-fade-in', className)}
        >
            {children}
        </div>
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

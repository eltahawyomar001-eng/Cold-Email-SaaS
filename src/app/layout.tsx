import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/toast';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'ColdReach - Cold Email Platform',
    description: 'Send cold emails at scale with advanced automation and analytics',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </Providers>
            </body>
        </html>
    );
}

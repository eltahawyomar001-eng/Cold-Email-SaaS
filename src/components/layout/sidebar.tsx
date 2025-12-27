'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Mail,
    Megaphone,
    Inbox,
    BarChart3,
    Flame,
    CreditCard,
    Settings,
    Building2,
    UserCog,
    Send,
} from 'lucide-react';

const mainNav = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Leads', href: '/app/leads', icon: Users },
    { name: 'Email Accounts', href: '/app/email-accounts', icon: Mail },
    { name: 'Campaigns', href: '/app/campaigns', icon: Megaphone },
    { name: 'Inbox', href: '/app/inbox', icon: Inbox },
    { name: 'Analytics', href: '/app/stats', icon: BarChart3 },
    { name: 'Warm-up', href: '/app/warmup', icon: Flame },
];

const settingsNav = [
    { name: 'Team', href: '/app/team', icon: UserCog },
    { name: 'Workspaces', href: '/app/workspaces', icon: Building2 },
    { name: 'Billing', href: '/app/billing', icon: CreditCard },
];

interface SidebarProps {
    isDemoMode?: boolean;
}

export function Sidebar({ isDemoMode = false }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`fixed left-0 z-40 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-slate-100 ${isDemoMode ? 'top-10' : 'top-0'}`}>
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
                    <Send className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    ColdReach
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-4">
                <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Menu
                </p>
                {mainNav.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/app' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            )}
                        >
                            <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-slate-400')} />
                            {item.name}
                        </Link>
                    );
                })}

                <p className="px-3 py-2 mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Settings
                </p>
                {settingsNav.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            )}
                        >
                            <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-slate-400')} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Upgrade Banner */}
            <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white">
                    <p className="font-semibold text-sm">Upgrade to Pro</p>
                    <p className="text-xs text-white/80 mt-1">
                        Unlock unlimited emails and advanced features
                    </p>
                    <Link
                        href="/app/billing"
                        className="mt-3 block w-full text-center py-2 px-4 bg-white text-violet-600 rounded-xl text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                        Upgrade Now
                    </Link>
                </div>
            </div>
        </aside>
    );
}

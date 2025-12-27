'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
    ChevronDown,
    LogOut,
    Settings,
    User,
    Bell,
    Search,
    Building2,
    Plus,
    Check,
} from 'lucide-react';

interface Workspace {
    id: string;
    name: string;
    role: string;
}

interface HeaderProps {
    workspaces?: Workspace[];
    currentWorkspace?: Workspace | null;
}

export function Header({ workspaces = [], currentWorkspace }: HeaderProps) {
    const { data: session } = useSession();
    const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="fixed top-0 right-0 left-64 z-30 h-16 bg-white/70 backdrop-blur-xl border-b border-slate-100">
            <div className="flex h-full items-center justify-between px-6">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search leads, campaigns, emails..."
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Workspace Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-semibold">
                                {currentWorkspace?.name?.charAt(0) || 'W'}
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                {currentWorkspace?.name || 'Workspace'}
                            </span>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        {showWorkspaceMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowWorkspaceMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-scale-in">
                                    <div className="px-3 py-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Workspaces
                                        </p>
                                    </div>
                                    {workspaces.map((ws) => (
                                        <button
                                            key={ws.id}
                                            className={cn(
                                                'flex items-center gap-3 w-full px-3 py-2.5 hover:bg-slate-50 transition-colors',
                                                currentWorkspace?.id === ws.id && 'bg-blue-50'
                                            )}
                                            onClick={() => setShowWorkspaceMenu(false)}
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-semibold">
                                                {ws.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-medium text-slate-900">{ws.name}</p>
                                                <p className="text-xs text-slate-500 capitalize">{ws.role.toLowerCase()}</p>
                                            </div>
                                            {currentWorkspace?.id === ws.id && (
                                                <Check className="h-4 w-4 text-blue-500" />
                                            )}
                                        </button>
                                    ))}
                                    <div className="border-t border-slate-100 mt-2 pt-2">
                                        <button className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                            <Plus className="h-4 w-4" />
                                            Create workspace
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
                        <Bell className="h-5 w-5 text-slate-500" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <Avatar
                                name={session?.user?.name || session?.user?.email || 'User'}
                                size="sm"
                            />
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-scale-in">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-medium text-slate-900">
                                            {session?.user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href="/app/settings"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/app/settings"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </div>
                                    <div className="border-t border-slate-100 pt-1">
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/login' })}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

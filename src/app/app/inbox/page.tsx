'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    Button,
    Badge,
    EmptyState,
} from '@/components/ui';
import { Inbox, Reply, Archive, Star, Trash2, Search, Filter, RefreshCw } from 'lucide-react';

// Demo data
const demoThreads = [
    {
        id: '1',
        leadEmail: 'sarah.johnson@techstartup.io',
        leadName: 'Sarah Johnson',
        subject: 'Re: Partnership Opportunity',
        lastMessage: "Thanks for reaching out! I'd love to discuss this further. Could we schedule a call next week?",
        category: 'INTERESTED',
        isRead: false,
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        campaignName: 'Q4 Sales Outreach',
        emailAccount: { email: 'sales@company.com' },
    },
    {
        id: '2',
        leadEmail: 'mike.chen@enterprise.com',
        leadName: 'Mike Chen',
        subject: 'Re: Quick Question About Your Solutions',
        lastMessage: "I'm currently out of office until January 5th. I'll get back to you when I return.",
        category: 'OOO',
        isRead: true,
        lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        campaignName: 'Product Launch',
        emailAccount: { email: 'marketing@company.com' },
    },
    {
        id: '3',
        leadEmail: 'emma.williams@consulting.co',
        leadName: 'Emma Williams',
        subject: 'Re: Exclusive Offer for Your Team',
        lastMessage: "We're not looking for any new solutions at this time, but thanks for thinking of us.",
        category: 'NOT_INTERESTED',
        isRead: true,
        lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        campaignName: 'Webinar Invitations',
        emailAccount: { email: 'events@company.com' },
    },
    {
        id: '4',
        leadEmail: 'alex.brown@agency.net',
        leadName: 'Alex Brown',
        subject: 'Re: Collaboration Proposal',
        lastMessage: "This sounds interesting! Can you send over more details about pricing and implementation timeline?",
        category: 'INTERESTED',
        isRead: false,
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        campaignName: 'Partnership Outreach',
        emailAccount: { email: 'partners@company.com' },
    },
    {
        id: '5',
        leadEmail: 'jennifer.davis@retail.com',
        leadName: 'Jennifer Davis',
        subject: 'Re: Boost Your Sales This Quarter',
        lastMessage: "Could you clarify what integrations you support? We use Shopify and Salesforce.",
        category: 'NEUTRAL',
        isRead: false,
        lastMessageAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        campaignName: 'Q4 Sales Outreach',
        emailAccount: { email: 'sales@company.com' },
    },
];

export default function InboxPage() {
    const [threads] = useState(demoThreads);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const stats = {
        total: threads.length,
        unread: threads.filter(t => !t.isRead).length,
        interested: threads.filter(t => t.category === 'INTERESTED').length,
        not_interested: threads.filter(t => t.category === 'NOT_INTERESTED').length,
        ooo: threads.filter(t => t.category === 'OOO').length,
    };

    const categories = [
        { key: 'all', label: 'All', count: stats.total },
        { key: 'unread', label: 'Unread', count: stats.unread },
        { key: 'INTERESTED', label: 'Interested', count: stats.interested },
        { key: 'NOT_INTERESTED', label: 'Not Interested', count: stats.not_interested },
        { key: 'OOO', label: 'OOO', count: stats.ooo },
    ];

    const filteredThreads = threads.filter(thread => {
        const matchesFilter = activeFilter === 'all' ||
            (activeFilter === 'unread' && !thread.isRead) ||
            thread.category === activeFilter;
        const matchesSearch = thread.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.leadEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Inbox</h1>
                    <p className="text-slate-500 mt-1">
                        Manage replies and conversations across all accounts
                    </p>
                </div>
                <Button variant="outline">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search inbox..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setActiveFilter(cat.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeFilter === cat.key
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {cat.label}
                        {cat.count > 0 && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${activeFilter === cat.key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}>
                                {cat.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Threads */}
            <Card>
                <CardContent className="p-0">
                    {filteredThreads.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            title={searchQuery ? "No messages found" : "No messages yet"}
                            description={searchQuery ? "Try a different search term." : "When leads reply to your campaigns, their messages will appear here."}
                        />
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredThreads.map((thread) => (
                                <ThreadRow key={thread.id} thread={thread} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function ThreadRow({ thread }: { thread: typeof demoThreads[0] }) {
    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors group ${!thread.isRead ? 'bg-blue-50/30' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Unread indicator */}
                    <div className="pt-2 w-2">
                        {!thread.isRead && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {thread.leadName.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <p className={`font-medium truncate ${!thread.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                {thread.leadName}
                            </p>
                            <CategoryBadge category={thread.category} />
                        </div>
                        <p className={`text-sm truncate ${!thread.isRead ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                            {thread.subject}
                        </p>
                        <p className="text-sm text-slate-500 truncate mt-1">
                            {thread.lastMessage}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            via {thread.campaignName} • {thread.emailAccount.email}
                        </p>
                    </div>
                </div>

                <div className="text-right ml-4 shrink-0">
                    <p className="text-xs text-slate-500">
                        {getTimeAgo(thread.lastMessageAt)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                            <Reply className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors">
                            <Star className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                            <Archive className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CategoryBadge({ category }: { category: string }) {
    const config: Record<string, { variant: 'success' | 'destructive' | 'warning' | 'secondary'; label: string }> = {
        INTERESTED: { variant: 'success', label: 'Interested' },
        NOT_INTERESTED: { variant: 'destructive', label: 'Not Interested' },
        OOO: { variant: 'warning', label: 'OOO' },
        BOUNCE: { variant: 'secondary', label: 'Bounce' },
        NEUTRAL: { variant: 'secondary', label: 'Neutral' },
    };

    const { variant, label } = config[category] || { variant: 'secondary' as const, label: category };

    return (
        <Badge variant={variant} className="text-xs">
            {label}
        </Badge>
    );
}

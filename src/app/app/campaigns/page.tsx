'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
    EmptyState,
} from '@/components/ui';
import { Send, Plus, Play, Pause, MoreVertical, Filter, Search } from 'lucide-react';

// Demo data
const demoCampaigns = [
    {
        id: '1',
        name: 'Q4 Sales Outreach',
        status: 'ACTIVE',
        sentCount: 1245,
        openedCount: 847,
        repliedCount: 156,
        leadsCount: 2500,
        stepsCount: 4,
        emailAccount: { email: 'sales@company.com', name: 'Sales Team' },
        createdAt: new Date('2024-12-15'),
    },
    {
        id: '2',
        name: 'Product Launch Announcement',
        status: 'DRAFT',
        sentCount: 0,
        openedCount: 0,
        repliedCount: 0,
        leadsCount: 1500,
        stepsCount: 3,
        emailAccount: { email: 'marketing@company.com', name: 'Marketing' },
        createdAt: new Date('2024-12-20'),
    },
    {
        id: '3',
        name: 'Webinar Invitations',
        status: 'PAUSED',
        sentCount: 856,
        openedCount: 423,
        repliedCount: 67,
        leadsCount: 1000,
        stepsCount: 2,
        emailAccount: { email: 'events@company.com', name: 'Events Team' },
        createdAt: new Date('2024-12-10'),
    },
    {
        id: '4',
        name: 'Customer Feedback Survey',
        status: 'COMPLETED',
        sentCount: 2100,
        openedCount: 1680,
        repliedCount: 420,
        leadsCount: 2100,
        stepsCount: 2,
        emailAccount: { email: 'cs@company.com', name: 'Customer Success' },
        createdAt: new Date('2024-12-01'),
    },
    {
        id: '5',
        name: 'Partnership Outreach',
        status: 'ACTIVE',
        sentCount: 320,
        openedCount: 198,
        repliedCount: 45,
        leadsCount: 500,
        stepsCount: 5,
        emailAccount: { email: 'partners@company.com', name: 'Partnerships' },
        createdAt: new Date('2024-12-18'),
    },
];

export default function CampaignsPage() {
    const [campaigns] = useState(demoCampaigns);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: campaigns.length,
        ACTIVE: campaigns.filter(c => c.status === 'ACTIVE').length,
        DRAFT: campaigns.filter(c => c.status === 'DRAFT').length,
        PAUSED: campaigns.filter(c => c.status === 'PAUSED').length,
        COMPLETED: campaigns.filter(c => c.status === 'COMPLETED').length,
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Campaigns</h1>
                    <p className="text-slate-500 mt-1">
                        Create and manage your email campaigns
                    </p>
                </div>
                <Link href="/app/campaigns/new">
                    <Button>
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                {[
                    { id: null, label: 'All', count: statusCounts.all },
                    { id: 'ACTIVE', label: 'Active', count: statusCounts.ACTIVE },
                    { id: 'DRAFT', label: 'Drafts', count: statusCounts.DRAFT },
                    { id: 'PAUSED', label: 'Paused', count: statusCounts.PAUSED },
                    { id: 'COMPLETED', label: 'Completed', count: statusCounts.COMPLETED },
                ].map((tab) => (
                    <button
                        key={tab.id || 'all'}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === tab.id
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusFilter === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Campaign Cards */}
            {filteredCampaigns.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <EmptyState
                            icon={Send}
                            title={searchQuery ? "No campaigns found" : "No campaigns yet"}
                            description={searchQuery ? "No campaigns match your search." : "Create your first email campaign to start reaching out to leads."}
                            action={
                                !searchQuery && (
                                    <Link href="/app/campaigns/new">
                                        <Button>
                                            <Plus className="h-4 w-4" />
                                            Create Campaign
                                        </Button>
                                    </Link>
                                )
                            }
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CampaignCard({ campaign }: { campaign: typeof demoCampaigns[0] }) {
    const stats = [
        { label: 'Sent', value: campaign.sentCount },
        { label: 'Opens', value: campaign.openedCount, rate: campaign.sentCount > 0 ? ((campaign.openedCount / campaign.sentCount) * 100).toFixed(0) + '%' : '-' },
        { label: 'Replies', value: campaign.repliedCount, rate: campaign.sentCount > 0 ? ((campaign.repliedCount / campaign.sentCount) * 100).toFixed(0) + '%' : '-' },
    ];

    return (
        <Link href={`/app/campaigns/${campaign.id}`}>
            <Card className="hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer group">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                                {campaign.name}
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                {campaign.leadsCount} leads • {campaign.stepsCount} steps
                            </p>
                        </div>
                        <CampaignStatusBadge status={campaign.status} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center p-2 rounded-xl bg-slate-50">
                                <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-500">
                                    {stat.label}
                                    {stat.rate && <span className="text-emerald-600 ml-1">({stat.rate})</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                    {campaign.emailAccount && (
                        <p className="text-xs text-slate-400 truncate">
                            via {campaign.emailAccount.email}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}

function CampaignStatusBadge({ status }: { status: string }) {
    const config: Record<string, { variant: 'default' | 'success' | 'warning' | 'secondary'; icon?: React.ElementType }> = {
        ACTIVE: { variant: 'success', icon: Play },
        PAUSED: { variant: 'warning', icon: Pause },
        DRAFT: { variant: 'secondary' },
        COMPLETED: { variant: 'default' },
    };

    const { variant, icon: Icon } = config[status] || { variant: 'secondary' as const };

    return (
        <Badge variant={variant} dot={!!Icon}>
            {status.toLowerCase()}
        </Badge>
    );
}

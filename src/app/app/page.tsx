'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
} from '@/components/ui';
import {
    Send,
    Eye,
    MousePointer,
    Reply,
    TrendingUp,
    ArrowRight,
    Mail,
    Users,
    Megaphone,
    Inbox,
    Plus,
    BarChart3,
    Sparkles,
} from 'lucide-react';

interface Stats {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
}

interface Campaign {
    id: string;
    name: string;
    status: string;
    sentCount: number;
    openedCount: number;
    repliedCount: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated data for demo
        setStats({
            sent: 2847,
            opened: 1936,
            clicked: 427,
            replied: 352,
            openRate: 0.68,
            clickRate: 0.15,
            replyRate: 0.124,
        });

        setCampaigns([
            { id: '1', name: 'Q4 Sales Outreach', status: 'ACTIVE', sentCount: 1245, openedCount: 847, repliedCount: 156 },
            { id: '2', name: 'Product Launch', status: 'DRAFT', sentCount: 0, openedCount: 0, repliedCount: 0 },
            { id: '3', name: 'Webinar Invites', status: 'PAUSED', sentCount: 856, openedCount: 423, repliedCount: 67 },
        ]);

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    const statCards = [
        {
            label: 'Emails Sent',
            value: stats?.sent.toLocaleString() || '0',
            icon: Send,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            change: '+12.5%',
            positive: true,
        },
        {
            label: 'Open Rate',
            value: `${((stats?.openRate || 0) * 100).toFixed(1)}%`,
            icon: Eye,
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            change: '+3.2%',
            positive: true,
        },
        {
            label: 'Click Rate',
            value: `${((stats?.clickRate || 0) * 100).toFixed(1)}%`,
            icon: MousePointer,
            color: 'from-violet-500 to-violet-600',
            bgColor: 'bg-violet-50',
            change: '+1.8%',
            positive: true,
        },
        {
            label: 'Reply Rate',
            value: `${((stats?.replyRate || 0) * 100).toFixed(1)}%`,
            icon: Reply,
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            change: '+5.3%',
            positive: true,
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">
                        Welcome back! Here's what's happening with your campaigns.
                    </p>
                </div>
                <Link href="/app/campaigns/new">
                    <Button>
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                {statCards.map((stat) => (
                    <Card key={stat.label} className="group">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                                    <stat.icon className={`h-5 w-5 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                                    <TrendingUp className="h-3 w-3" />
                                    {stat.change}
                                </div>
                            </div>
                            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                                {stat.value}
                            </p>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Campaigns */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Campaigns</CardTitle>
                        <Link href="/app/campaigns">
                            <Button variant="ghost" size="sm">
                                View all
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {campaigns.map((campaign) => (
                            <Link href={`/app/campaigns/${campaign.id}`} key={campaign.id}>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-xl bg-white shadow-sm">
                                            <Megaphone className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {campaign.name}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                <span>{campaign.sentCount.toLocaleString()} sent</span>
                                                <span>{campaign.openedCount.toLocaleString()} opens</span>
                                                <span>{campaign.repliedCount} replies</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            campaign.status === 'ACTIVE' ? 'success' :
                                                campaign.status === 'PAUSED' ? 'warning' : 'secondary'
                                        }
                                        dot
                                    >
                                        {campaign.status}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/app/campaigns/new" className="block">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/20">
                                        <Megaphone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Create Campaign</p>
                                        <p className="text-sm text-white/80">Start a new email sequence</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/app/leads" className="block">
                            <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-violet-50">
                                        <Users className="h-5 w-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Import Leads</p>
                                        <p className="text-sm text-slate-500">Add contacts from CSV</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/app/email-accounts" className="block">
                            <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-50">
                                        <Mail className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Connect Account</p>
                                        <p className="text-sm text-slate-500">Add Gmail or SMTP</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/app/inbox" className="block">
                            <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-amber-50">
                                        <Inbox className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">View Inbox</p>
                                        <p className="text-sm text-slate-500">3 new replies</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-slate-400" />
                        Performance Overview
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">7 Days</Button>
                        <Button variant="ghost" size="sm">30 Days</Button>
                        <Button variant="ghost" size="sm">90 Days</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100">
                        <div className="text-center">
                            <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">Performance chart coming soon</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

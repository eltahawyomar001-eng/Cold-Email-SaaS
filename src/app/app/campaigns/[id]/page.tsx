'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
    Badge,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui';
import { ArrowLeft, Play, Pause, Users, Mail, BarChart3, Edit, Trash2 } from 'lucide-react';

// Demo campaign data
const demoCampaigns: Record<string, any> = {
    '1': {
        id: '1',
        name: 'Q4 Sales Outreach',
        status: 'ACTIVE',
        sentCount: 1245,
        deliveredCount: 1220,
        openedCount: 847,
        clickedCount: 189,
        repliedCount: 156,
        bouncedCount: 25,
        emailAccount: { email: 'sales@company.com', name: 'Sales Team' },
        steps: [
            { id: '1', order: 1, subject: 'Quick question about {{company}}', body: 'Hi {{firstName}},\n\nI noticed that your company...', delayAmount: 0, delayUnit: 'days' },
            { id: '2', order: 2, subject: 'Following up', body: 'Hi {{firstName}},\n\nJust wanted to follow up...', delayAmount: 3, delayUnit: 'days' },
            { id: '3', order: 3, subject: 'Last try', body: 'Hi {{firstName}},\n\nI don\'t want to be a bother...', delayAmount: 5, delayUnit: 'days' },
        ],
        campaignLeads: [
            { id: '1', status: 'COMPLETED', currentStep: 3, lastStepAt: new Date('2024-12-20'), lead: { email: 'john@techcorp.com', firstName: 'John', lastName: 'Smith' } },
            { id: '2', status: 'REPLIED', currentStep: 2, lastStepAt: new Date('2024-12-22'), lead: { email: 'sarah@startup.io', firstName: 'Sarah', lastName: 'Johnson' } },
            { id: '3', status: 'ACTIVE', currentStep: 1, lastStepAt: new Date('2024-12-25'), lead: { email: 'mike@enterprise.com', firstName: 'Mike', lastName: 'Wilson' } },
            { id: '4', status: 'BOUNCED', currentStep: 1, lastStepAt: new Date('2024-12-24'), lead: { email: 'invalid@bounced.com', firstName: 'Test', lastName: 'User' } },
        ],
    },
    '2': {
        id: '2',
        name: 'Product Launch Announcement',
        status: 'DRAFT',
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        repliedCount: 0,
        bouncedCount: 0,
        emailAccount: { email: 'marketing@company.com', name: 'Marketing' },
        steps: [
            { id: '1', order: 1, subject: 'Exciting news from {{company}}', body: 'Hi {{firstName}},\n\nWe\'re thrilled to announce...', delayAmount: 0, delayUnit: 'days' },
        ],
        campaignLeads: [],
    },
    '3': {
        id: '3',
        name: 'Webinar Invitations',
        status: 'PAUSED',
        sentCount: 856,
        deliveredCount: 842,
        openedCount: 423,
        clickedCount: 98,
        repliedCount: 67,
        bouncedCount: 14,
        emailAccount: { email: 'events@company.com', name: 'Events Team' },
        steps: [
            { id: '1', order: 1, subject: 'You\'re invited: {{webinarName}}', body: 'Hi {{firstName}},\n\nWe\'d love to have you join...', delayAmount: 0, delayUnit: 'days' },
            { id: '2', order: 2, subject: 'Reminder: Webinar tomorrow', body: 'Hi {{firstName}},\n\nJust a friendly reminder...', delayAmount: 2, delayUnit: 'days' },
        ],
        campaignLeads: [
            { id: '1', status: 'COMPLETED', currentStep: 2, lastStepAt: new Date('2024-12-18'), lead: { email: 'emma@agency.co', firstName: 'Emma', lastName: 'Davis' } },
            { id: '2', status: 'ACTIVE', currentStep: 1, lastStepAt: new Date('2024-12-19'), lead: { email: 'alex@consulting.com', firstName: 'Alex', lastName: 'Brown' } },
        ],
    },
};

export default function CampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sequence');

    useEffect(() => {
        const id = params.id as string;
        // Simulate loading
        setTimeout(() => {
            const found = demoCampaigns[id];
            if (found) {
                setCampaign(found);
            }
            setLoading(false);
        }, 300);
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Campaign not found</h2>
                <p className="text-slate-500 mb-4">The campaign you're looking for doesn't exist.</p>
                <Link href="/app/campaigns">
                    <Button>Back to Campaigns</Button>
                </Link>
            </div>
        );
    }

    const stats = {
        sent: campaign.sentCount,
        delivered: campaign.deliveredCount,
        opened: campaign.openedCount,
        clicked: campaign.clickedCount,
        replied: campaign.repliedCount,
        bounced: campaign.bouncedCount,
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/app/campaigns">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
                            <CampaignStatusBadge status={campaign.status} />
                        </div>
                        <p className="text-slate-500 mt-1">
                            {campaign.campaignLeads.length} leads • {campaign.steps.length} steps
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {campaign.status === 'ACTIVE' ? (
                        <Button variant="outline">
                            <Pause className="h-4 w-4" />
                            Pause
                        </Button>
                    ) : campaign.status === 'DRAFT' || campaign.status === 'PAUSED' ? (
                        <Button>
                            <Play className="h-4 w-4" />
                            Start Campaign
                        </Button>
                    ) : null}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 stagger-children">
                <StatCard label="Sent" value={stats.sent} color="blue" />
                <StatCard label="Delivered" value={stats.delivered} rate={stats.sent > 0 ? stats.delivered / stats.sent : 0} color="slate" />
                <StatCard label="Opened" value={stats.opened} rate={stats.delivered > 0 ? stats.opened / stats.delivered : 0} color="emerald" />
                <StatCard label="Clicked" value={stats.clicked} rate={stats.opened > 0 ? stats.clicked / stats.opened : 0} color="violet" />
                <StatCard label="Replied" value={stats.replied} rate={stats.delivered > 0 ? stats.replied / stats.delivered : 0} color="amber" />
                <StatCard label="Bounced" value={stats.bounced} rate={stats.sent > 0 ? stats.bounced / stats.sent : 0} isNegative color="red" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                {[
                    { id: 'sequence', label: 'Sequence', icon: Mail },
                    { id: 'leads', label: 'Leads', icon: Users },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'sequence' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Email Sequence</CardTitle>
                        <CardDescription>The steps in your campaign sequence</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {campaign.steps.map((step: any, index: number) => (
                                <div key={step.id} className="p-4 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {index === 0 ? 'Initial Email' : `Follow-up ${index}`}
                                                </p>
                                                {index > 0 && (
                                                    <p className="text-sm text-slate-500">
                                                        {step.delayAmount} {step.delayUnit} after previous step
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="ml-11">
                                        <p className="font-medium text-slate-900 mb-1">{step.subject}</p>
                                        <p className="text-sm text-slate-600 whitespace-pre-line line-clamp-3">
                                            {step.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'leads' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Leads</CardTitle>
                        <CardDescription>Leads enrolled in this campaign</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {campaign.campaignLeads.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                No leads enrolled in this campaign yet.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Step</TableHead>
                                        <TableHead>Last Activity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaign.campaignLeads.map((cl: any) => (
                                        <TableRow key={cl.id}>
                                            <TableCell className="font-medium">{cl.lead.email}</TableCell>
                                            <TableCell>{cl.lead.firstName} {cl.lead.lastName}</TableCell>
                                            <TableCell>
                                                <LeadStatusBadge status={cl.status} />
                                            </TableCell>
                                            <TableCell>{cl.currentStep} / {campaign.steps.length}</TableCell>
                                            <TableCell className="text-slate-500">
                                                {cl.lastStepAt ? new Date(cl.lastStepAt).toLocaleDateString() : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

            {activeTab === 'analytics' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Analytics</CardTitle>
                        <CardDescription>Performance metrics over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">Analytics chart coming soon</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    rate,
    isNegative = false,
    color,
}: {
    label: string;
    value: number;
    rate?: number;
    isNegative?: boolean;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        blue: 'from-blue-500 to-blue-600',
        emerald: 'from-emerald-500 to-emerald-600',
        violet: 'from-violet-500 to-violet-600',
        amber: 'from-amber-500 to-amber-600',
        red: 'from-red-500 to-red-600',
        slate: 'from-slate-500 to-slate-600',
    };

    return (
        <Card className="group">
            <CardContent className="pt-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
                    {value}
                </p>
                {rate !== undefined && (
                    <p className={`text-xs ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
                        {(rate * 100).toFixed(1)}%
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function CampaignStatusBadge({ status }: { status: string }) {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
        ACTIVE: 'success',
        PAUSED: 'warning',
        DRAFT: 'secondary',
        COMPLETED: 'default',
    };

    return (
        <Badge variant={variants[status] || 'secondary'} dot>
            {status.toLowerCase()}
        </Badge>
    );
}

function LeadStatusBadge({ status }: { status: string }) {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
        PENDING: 'secondary',
        ACTIVE: 'default',
        COMPLETED: 'success',
        REPLIED: 'success',
        BOUNCED: 'destructive',
        UNSUBSCRIBED: 'warning',
    };

    return (
        <Badge variant={variants[status] || 'secondary'}>
            {status.toLowerCase()}
        </Badge>
    );
}

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui';
import { ArrowLeft, Play, Pause, Users, Mail, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default async function CampaignDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const campaign = await prisma.campaign.findUnique({
        where: { id: params.id },
        include: {
            emailAccount: true,
            steps: { orderBy: { order: 'asc' } },
            campaignLeads: {
                include: { lead: true },
                take: 50,
            },
            _count: {
                select: { campaignLeads: true },
            },
        },
    });

    if (!campaign) {
        notFound();
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/app/campaigns">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-surface-900">{campaign.name}</h1>
                            <CampaignStatusBadge status={campaign.status} />
                        </div>
                        <p className="text-surface-500 mt-1">
                            {campaign._count.campaignLeads} leads • {campaign.steps.length} steps
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {campaign.status === 'ACTIVE' ? (
                        <Button variant="outline">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                        </Button>
                    ) : campaign.status === 'DRAFT' || campaign.status === 'PAUSED' ? (
                        <Button>
                            <Play className="h-4 w-4 mr-2" />
                            Start Campaign
                        </Button>
                    ) : null}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <StatCard label="Sent" value={stats.sent} />
                <StatCard label="Delivered" value={stats.delivered} rate={stats.sent > 0 ? stats.delivered / stats.sent : 0} />
                <StatCard label="Opened" value={stats.opened} rate={stats.delivered > 0 ? stats.opened / stats.delivered : 0} />
                <StatCard label="Clicked" value={stats.clicked} rate={stats.opened > 0 ? stats.clicked / stats.opened : 0} />
                <StatCard label="Replied" value={stats.replied} rate={stats.delivered > 0 ? stats.replied / stats.delivered : 0} />
                <StatCard label="Bounced" value={stats.bounced} rate={stats.sent > 0 ? stats.bounced / stats.sent : 0} isNegative />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="sequence">
                <TabsList>
                    <TabsTrigger value="sequence">
                        <Mail className="h-4 w-4 mr-2" />
                        Sequence
                    </TabsTrigger>
                    <TabsTrigger value="leads">
                        <Users className="h-4 w-4 mr-2" />
                        Leads
                    </TabsTrigger>
                    <TabsTrigger value="stats">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="sequence">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Sequence</CardTitle>
                            <CardDescription>
                                The steps in your campaign sequence
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {campaign.steps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className="p-4 border border-surface-200 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-surface-900">
                                                    {index === 0 ? 'Initial Email' : `Follow-up ${index}`}
                                                </p>
                                                {index > 0 && (
                                                    <p className="text-sm text-surface-500">
                                                        {step.delayAmount} {step.delayUnit} after previous step
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-9">
                                            <p className="font-medium text-surface-900 mb-1">{step.subject}</p>
                                            <p className="text-sm text-surface-600 whitespace-pre-line line-clamp-3">
                                                {step.body}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leads">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Leads</CardTitle>
                            <CardDescription>
                                Leads enrolled in this campaign
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
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
                                    {campaign.campaignLeads.map((cl) => (
                                        <TableRow key={cl.id}>
                                            <TableCell className="font-medium">{cl.lead.email}</TableCell>
                                            <TableCell>
                                                {cl.lead.firstName} {cl.lead.lastName}
                                            </TableCell>
                                            <TableCell>
                                                <LeadStatusBadge status={cl.status} />
                                            </TableCell>
                                            <TableCell>{cl.currentStep} / {campaign.steps.length}</TableCell>
                                            <TableCell className="text-surface-500">
                                                {cl.lastStepAt
                                                    ? new Date(cl.lastStepAt).toLocaleDateString()
                                                    : '-'
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Analytics</CardTitle>
                            <CardDescription>
                                Performance metrics over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center text-surface-500">
                                Chart placeholder - would show time series data
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StatCard({
    label,
    value,
    rate,
    isNegative = false,
}: {
    label: string;
    value: number;
    rate?: number;
    isNegative?: boolean;
}) {
    return (
        <Card>
            <CardContent className="pt-4">
                <p className="text-sm text-surface-500">{label}</p>
                <p className="text-2xl font-bold text-surface-900">{value}</p>
                {rate !== undefined && (
                    <p className={`text-xs ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
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
        <Badge variant={variants[status] || 'secondary'}>
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

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getUserWorkspaces } from '@/server/rbac';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
    EmptyState,
} from '@/components/ui';
import { Send, Plus, Play, Pause, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default async function CampaignsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const workspaces = await getUserWorkspaces(session.user.id);
    const currentWorkspace = workspaces[0];

    if (!currentWorkspace) {
        return <div>No workspace found</div>;
    }

    const campaigns = await prisma.campaign.findMany({
        where: { workspaceId: currentWorkspace.id },
        orderBy: { createdAt: 'desc' },
        include: {
            emailAccount: {
                select: { email: true, name: true },
            },
            _count: {
                select: { campaignLeads: true, steps: true },
            },
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Campaigns</h1>
                    <p className="text-surface-500 mt-1">
                        Create and manage your email campaigns
                    </p>
                </div>
                <Link href="/app/campaigns/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            {/* Campaign Cards */}
            {campaigns.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <EmptyState
                            icon={Send}
                            title="No campaigns yet"
                            description="Create your first email campaign to start reaching out to leads."
                            action={
                                <Link href="/app/campaigns/new">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Campaign
                                    </Button>
                                </Link>
                            }
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CampaignCard({ campaign }: { campaign: any }) {
    const stats = [
        { label: 'Sent', value: campaign.sentCount },
        { label: 'Opens', value: campaign.openedCount, rate: campaign.sentCount > 0 ? ((campaign.openedCount / campaign.sentCount) * 100).toFixed(0) + '%' : '-' },
        { label: 'Replies', value: campaign.repliedCount, rate: campaign.sentCount > 0 ? ((campaign.repliedCount / campaign.sentCount) * 100).toFixed(0) + '%' : '-' },
    ];

    return (
        <Link href={`/app/campaigns/${campaign.id}`}>
            <Card className="hover:border-primary-200 hover:shadow-md transition-all cursor-pointer">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-base">{campaign.name}</CardTitle>
                            <p className="text-sm text-surface-500">
                                {campaign._count.campaignLeads} leads • {campaign._count.steps} steps
                            </p>
                        </div>
                        <CampaignStatusBadge status={campaign.status} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-lg font-semibold text-surface-900">{stat.value}</p>
                                <p className="text-xs text-surface-500">
                                    {stat.label}
                                    {stat.rate && ` (${stat.rate})`}
                                </p>
                            </div>
                        ))}
                    </div>
                    {campaign.emailAccount && (
                        <p className="text-xs text-surface-400 truncate">
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
        <Badge variant={variant} className="flex items-center space-x-1">
            {Icon && <Icon className="h-3 w-3" />}
            <span>{status.toLowerCase()}</span>
        </Badge>
    );
}

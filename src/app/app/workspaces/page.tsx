import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getUserWorkspaces } from '@/server/rbac';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
} from '@/components/ui';
import { Building2, Plus, Settings, Users, Send, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default async function WorkspacesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const workspaces = await getUserWorkspaces(session.user.id);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Workspaces</h1>
                    <p className="text-surface-500 mt-1">
                        Manage your workspaces and switch between them
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workspace
                </Button>
            </div>

            {/* Workspace Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workspaces.map((workspace) => (
                    <Card key={workspace.id} className="hover:border-primary-200 transition-colors">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary-100 rounded-lg">
                                        <Building2 className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{workspace.name}</CardTitle>
                                        <CardDescription className="capitalize">
                                            {workspace.role.toLowerCase()}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <StatItem icon={Users} value={workspace.memberCount} label="Members" />
                                <StatItem icon={Send} value={workspace.campaignCount} label="Campaigns" />
                                <StatItem icon={BarChart3} value={workspace.leadCount} label="Leads" />
                            </div>
                            <Button variant="outline" className="w-full">
                                Switch to this workspace
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Create New Workspace Card */}
                <Card className="border-dashed border-2 border-surface-300 bg-surface-50/50">
                    <CardContent className="flex flex-col items-center justify-center h-full py-12">
                        <div className="p-3 bg-surface-200 rounded-full mb-4">
                            <Plus className="h-6 w-6 text-surface-500" />
                        </div>
                        <p className="font-medium text-surface-900 mb-1">Create Workspace</p>
                        <p className="text-sm text-surface-500 text-center mb-4">
                            Start a new workspace for a different project or team
                        </p>
                        <Button variant="outline">
                            Create Workspace
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatItem({
    icon: Icon,
    value,
    label,
}: {
    icon: React.ElementType;
    value: number;
    label: string;
}) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center mb-1">
                <Icon className="h-4 w-4 text-surface-400 mr-1" />
                <span className="font-semibold text-surface-900">{value}</span>
            </div>
            <p className="text-xs text-surface-500">{label}</p>
        </div>
    );
}

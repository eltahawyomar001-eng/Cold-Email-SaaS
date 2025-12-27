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
    Badge,
    Avatar,
    EmptyState,
} from '@/components/ui';
import { UserPlus, MoreVertical, Mail, Shield, Crown, Users } from 'lucide-react';

export default async function TeamPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const workspaces = await getUserWorkspaces(session.user.id);
    const currentWorkspace = workspaces[0];

    if (!currentWorkspace) {
        return <div>No workspace found</div>;
    }

    const members = await prisma.workspaceMember.findMany({
        where: { workspaceId: currentWorkspace.id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    const invites = await prisma.invite.findMany({
        where: {
            workspaceId: currentWorkspace.id,
            acceptedAt: null,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Team</h1>
                    <p className="text-surface-500 mt-1">
                        Manage team members and invitations
                    </p>
                </div>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                </Button>
            </div>

            {/* Members */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                        People with access to this workspace
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-surface-200">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-4"
                            >
                                <div className="flex items-center space-x-3">
                                    <Avatar name={member.user.name || member.user.email} />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-medium text-surface-900">
                                                {member.user.name || member.user.email}
                                            </p>
                                            {member.role === 'OWNER' && (
                                                <Crown className="h-4 w-4 text-yellow-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-surface-500">{member.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <RoleBadge role={member.role} />
                                    {member.role !== 'OWNER' && (
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Invitations</CardTitle>
                        <CardDescription>
                            People who have been invited but haven&apos;t joined yet
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-surface-200">
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-surface-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-surface-900">{invite.email}</p>
                                            <p className="text-sm text-surface-500">
                                                Expires {new Date(invite.expiresAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Badge variant="secondary">{invite.role.toLowerCase()}</Badge>
                                        <Button variant="ghost" size="sm">
                                            Resend
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Roles Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>
                        What each role can do in the workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <RoleCard
                            role="Owner"
                            icon={Crown}
                            iconColor="text-yellow-500"
                            permissions={[
                                'Full workspace access',
                                'Manage billing',
                                'Delete workspace',
                                'Manage all members',
                            ]}
                        />
                        <RoleCard
                            role="Admin"
                            icon={Shield}
                            iconColor="text-blue-500"
                            permissions={[
                                'Manage campaigns',
                                'Manage leads',
                                'Manage accounts',
                                'Invite members',
                            ]}
                        />
                        <RoleCard
                            role="Member"
                            icon={Users}
                            iconColor="text-green-500"
                            permissions={[
                                'View campaigns',
                                'View leads',
                                'View statistics',
                                'View inbox',
                            ]}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
        OWNER: 'warning',
        ADMIN: 'default',
        MEMBER: 'secondary',
    };

    return (
        <Badge variant={variants[role] || 'secondary'}>
            {role.toLowerCase()}
        </Badge>
    );
}

function RoleCard({
    role,
    icon: Icon,
    iconColor,
    permissions,
}: {
    role: string;
    icon: React.ElementType;
    iconColor: string;
    permissions: string[];
}) {
    return (
        <div className="p-4 rounded-lg border border-surface-200">
            <div className="flex items-center space-x-2 mb-3">
                <Icon className={`h-5 w-5 ${iconColor}`} />
                <p className="font-medium text-surface-900">{role}</p>
            </div>
            <ul className="space-y-2">
                {permissions.map((permission) => (
                    <li key={permission} className="text-sm text-surface-600">
                        • {permission}
                    </li>
                ))}
            </ul>
        </div>
    );
}

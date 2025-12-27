'use client';

import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
    Badge,
    Avatar,
} from '@/components/ui';
import { UserPlus, MoreVertical, Mail, Shield, Crown, Users, X, Copy, Check } from 'lucide-react';

// Demo data
const demoMembers = [
    { id: '1', name: 'John Smith', email: 'john@company.com', role: 'OWNER', avatarUrl: null, createdAt: new Date('2024-01-01') },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'ADMIN', avatarUrl: null, createdAt: new Date('2024-03-15') },
    { id: '3', name: 'Mike Wilson', email: 'mike@company.com', role: 'MEMBER', avatarUrl: null, createdAt: new Date('2024-06-20') },
    { id: '4', name: 'Emma Davis', email: 'emma@company.com', role: 'MEMBER', avatarUrl: null, createdAt: new Date('2024-09-10') },
];

const demoInvites = [
    { id: '1', email: 'alex@newcompany.com', role: 'MEMBER', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { id: '2', email: 'lisa@partner.io', role: 'ADMIN', expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
];

export default function TeamPage() {
    const [members] = useState(demoMembers);
    const [invites, setInvites] = useState(demoInvites);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://app.coldreach.io/invite/demo-token');
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCancelInvite = (id: string) => {
        setInvites(invites.filter(inv => inv.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Team</h1>
                    <p className="text-slate-500 mt-1">
                        Manage team members and invitations
                    </p>
                </div>
                <Button onClick={() => setShowInviteModal(true)}>
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                </Button>
            </div>

            {/* Members */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                        People with access to this workspace ({members.length} members)
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar name={member.name || member.email} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-slate-900">
                                                {member.name || member.email}
                                            </p>
                                            {member.role === 'OWNER' && (
                                                <Crown className="h-4 w-4 text-amber-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RoleBadge role={member.role} />
                                    {member.role !== 'OWNER' && (
                                        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                            <MoreVertical className="h-4 w-4 text-slate-400" />
                                        </button>
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
                        <div className="divide-y divide-slate-100">
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{invite.email}</p>
                                            <p className="text-sm text-slate-500">
                                                Expires {new Date(invite.expiresAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary">{invite.role.toLowerCase()}</Badge>
                                        <Button variant="ghost" size="sm">
                                            Resend
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleCancelInvite(invite.id)}
                                        >
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
                            iconColor="text-amber-500"
                            bgColor="bg-amber-50"
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
                            bgColor="bg-blue-50"
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
                            iconColor="text-emerald-500"
                            bgColor="bg-emerald-50"
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

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowInviteModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-scale-in">
                        <button
                            onClick={() => setShowInviteModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <X className="h-4 w-4 text-slate-400" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Invite Team Member</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="colleague@company.com"
                                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Role</label>
                                <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                    <option value="MEMBER">Member</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <Button className="w-full" onClick={() => setShowInviteModal(false)}>
                                Send Invitation
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-400">or share link</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                                {copiedLink ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        Copy Invite Link
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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
    bgColor,
    permissions,
}: {
    role: string;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
    permissions: string[];
}) {
    return (
        <div className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <p className="font-semibold text-slate-900">{role}</p>
            </div>
            <ul className="space-y-2">
                {permissions.map((permission) => (
                    <li key={permission} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {permission}
                    </li>
                ))}
            </ul>
        </div>
    );
}

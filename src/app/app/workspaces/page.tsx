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
} from '@/components/ui';
import { Building2, Plus, Settings, Users, Send, BarChart3, Check, Crown, X } from 'lucide-react';

// Demo data
const demoWorkspaces = [
    {
        id: '1',
        name: 'Marketing Team',
        role: 'OWNER',
        memberCount: 5,
        campaignCount: 12,
        leadCount: 3500,
        isActive: true,
    },
    {
        id: '2',
        name: 'Sales Operations',
        role: 'ADMIN',
        memberCount: 8,
        campaignCount: 24,
        leadCount: 8200,
        isActive: false,
    },
    {
        id: '3',
        name: 'Customer Success',
        role: 'MEMBER',
        memberCount: 3,
        campaignCount: 6,
        leadCount: 1200,
        isActive: false,
    },
];

export default function WorkspacesPage() {
    const [workspaces, setWorkspaces] = useState(demoWorkspaces);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    const handleCreateWorkspace = () => {
        if (!newWorkspaceName.trim()) return;
        const newWorkspace = {
            id: String(Date.now()),
            name: newWorkspaceName,
            role: 'OWNER',
            memberCount: 1,
            campaignCount: 0,
            leadCount: 0,
            isActive: false,
        };
        setWorkspaces([...workspaces, newWorkspace]);
        setNewWorkspaceName('');
        setShowCreateModal(false);
    };

    const handleSwitchWorkspace = (id: string) => {
        setWorkspaces(workspaces.map(ws => ({
            ...ws,
            isActive: ws.id === id
        })));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Workspaces</h1>
                    <p className="text-slate-500 mt-1">
                        Manage your workspaces and switch between them
                    </p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4" />
                    Create Workspace
                </Button>
            </div>

            {/* Workspace Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {workspaces.map((workspace) => (
                    <Card
                        key={workspace.id}
                        className={`hover:border-blue-200 hover:shadow-lg transition-all ${workspace.isActive ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
                            }`}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl shadow-lg shadow-blue-500/25">
                                        <Building2 className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-base">{workspace.name}</CardTitle>
                                            {workspace.isActive && (
                                                <Badge variant="success" dot>Active</Badge>
                                            )}
                                        </div>
                                        <CardDescription className="flex items-center gap-1 capitalize">
                                            {workspace.role === 'OWNER' && <Crown className="h-3 w-3 text-amber-500" />}
                                            {workspace.role.toLowerCase()}
                                        </CardDescription>
                                    </div>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                    <Settings className="h-4 w-4 text-slate-400" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <StatItem icon={Users} value={workspace.memberCount} label="Members" />
                                <StatItem icon={Send} value={workspace.campaignCount} label="Campaigns" />
                                <StatItem icon={BarChart3} value={workspace.leadCount} label="Leads" />
                            </div>
                            <Button
                                variant={workspace.isActive ? "outline" : "default"}
                                className="w-full"
                                onClick={() => handleSwitchWorkspace(workspace.id)}
                                disabled={workspace.isActive}
                            >
                                {workspace.isActive ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Current Workspace
                                    </>
                                ) : (
                                    'Switch to this workspace'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Create New Workspace Card */}
                <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
                    onClick={() => setShowCreateModal(true)}>
                    <CardContent className="flex flex-col items-center justify-center h-full py-12">
                        <div className="p-3 bg-slate-200 group-hover:bg-blue-100 rounded-full mb-4 transition-colors">
                            <Plus className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <p className="font-medium text-slate-900 mb-1">Create Workspace</p>
                        <p className="text-sm text-slate-500 text-center">
                            Start a new workspace for a different project or team
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Create Workspace Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-scale-in">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <X className="h-4 w-4 text-slate-400" />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Create Workspace</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Workspace Name</label>
                                <input
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="e.g., Marketing, Sales, Product"
                                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <Button className="w-full" onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
                                Create Workspace
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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
        <div className="text-center p-2 rounded-xl bg-slate-50">
            <div className="flex items-center justify-center gap-1 mb-1">
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-900">
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                </span>
            </div>
            <p className="text-xs text-slate-500">{label}</p>
        </div>
    );
}

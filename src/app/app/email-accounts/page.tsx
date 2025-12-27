'use client';

import { useState } from 'react';
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
    Switch,
    EmptyState,
} from '@/components/ui';
import { Mail, Plus, Settings, Trash2, RefreshCw } from 'lucide-react';

interface EmailAccount {
    id: string;
    name: string;
    email: string;
    provider: string;
    status: string;
    healthScore: number;
    maxPerDay: number;
    sentToday: number;
    warmupEnabled: boolean;
}

export default function EmailAccountsPage() {
    // This would normally fetch from the server
    // For demo, we'll use static data that would be fetched
    return <EmailAccountsClient />;
}

function EmailAccountsClient() {
    const [accounts, setAccounts] = useState<EmailAccount[]>([]);
    const [showConnectModal, setShowConnectModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Email Accounts</h1>
                    <p className="text-surface-500 mt-1">
                        Manage your sending accounts and connection status
                    </p>
                </div>
                <Button onClick={() => setShowConnectModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-100 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <Mail className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                        <p className="font-medium text-primary-900">Demo Mode</p>
                        <p className="text-sm text-primary-700 mt-0.5">
                            Email accounts are simulated. Connect Gmail or add SMTP settings to see how it works.
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Demo Account Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M5.27 5.27L12 10.14l6.73-4.87L12 0z" />
                                        <path fill="#34A853" d="M1.98 17.25L6 14.14V6l-4.02 2.91z" />
                                        <path fill="#4285F4" d="M12 24l6-4.35V10.14l-6 4.32z" />
                                        <path fill="#FBBC05" d="M12 24l-6-4.35V10.14l6 4.32z" />
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-base">sales@demo.com</CardTitle>
                                    <CardDescription>Gmail</CardDescription>
                                </div>
                            </div>
                            <Badge variant="success">Connected</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Health Score</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-surface-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
                                    </div>
                                    <span className="font-medium text-surface-900">92%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Sent Today</span>
                                <span className="font-medium text-surface-900">45 / 100</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Warm-up</span>
                                <Switch checked={true} onCheckedChange={() => { }} />
                            </div>
                            <div className="pt-2 flex items-center space-x-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Settings className="h-4 w-4 mr-1" />
                                    Settings
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Add Account Card */}
                <Card className="border-dashed border-2 border-surface-300 bg-surface-50/50">
                    <CardContent className="flex flex-col items-center justify-center h-full py-12">
                        <div className="p-3 bg-surface-200 rounded-full mb-4">
                            <Plus className="h-6 w-6 text-surface-500" />
                        </div>
                        <p className="font-medium text-surface-900 mb-1">Add Email Account</p>
                        <p className="text-sm text-surface-500 text-center mb-4">
                            Connect Gmail, Outlook, or custom SMTP
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button variant="outline" size="sm">
                                Connect Gmail
                            </Button>
                            <Button variant="outline" size="sm">
                                Add SMTP
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

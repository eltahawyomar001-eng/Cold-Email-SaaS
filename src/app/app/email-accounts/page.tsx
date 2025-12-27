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
    Switch,
    EmptyState,
} from '@/components/ui';
import { Mail, Plus, Settings, RefreshCw, Check, AlertCircle } from 'lucide-react';

// Demo data
const demoAccounts = [
    {
        id: '1',
        name: 'Sales Team',
        email: 'sales@demo-company.com',
        provider: 'gmail',
        status: 'CONNECTED',
        healthScore: 92,
        maxPerDay: 100,
        sentToday: 45,
        warmupEnabled: true,
    },
    {
        id: '2',
        name: 'Marketing',
        email: 'marketing@demo-company.com',
        provider: 'outlook',
        status: 'CONNECTED',
        healthScore: 88,
        maxPerDay: 80,
        sentToday: 32,
        warmupEnabled: true,
    },
];

export default function EmailAccountsPage() {
    const [accounts, setAccounts] = useState(demoAccounts);

    const toggleWarmup = (id: string) => {
        setAccounts(accounts.map(acc =>
            acc.id === id ? { ...acc, warmupEnabled: !acc.warmupEnabled } : acc
        ));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Email Accounts</h1>
                    <p className="text-slate-500 mt-1">
                        Manage your sending accounts and connection status
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4" />
                    Add Account
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-4">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-medium text-blue-900">Demo Mode</p>
                        <p className="text-sm text-blue-700 mt-0.5">
                            Email accounts are simulated. Connect Gmail or add SMTP settings to see how it works.
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
                {accounts.map((account) => (
                    <Card key={account.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                                        {account.provider === 'gmail' ? (
                                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                <path fill="#EA4335" d="M5.27 5.27L12 10.14l6.73-4.87L12 0z" />
                                                <path fill="#34A853" d="M1.98 17.25L6 14.14V6l-4.02 2.91z" />
                                                <path fill="#4285F4" d="M12 24l6-4.35V10.14l-6 4.32z" />
                                                <path fill="#FBBC05" d="M12 24l-6-4.35V10.14l6 4.32z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                <path fill="#0078D4" d="M12 0L0 6v12l12 6 12-6V6z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{account.email}</CardTitle>
                                        <CardDescription className="capitalize">{account.provider}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="success" dot>
                                    Connected
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Health Score</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${account.healthScore >= 80 ? 'bg-emerald-500' :
                                                        account.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${account.healthScore}%` }}
                                            />
                                        </div>
                                        <span className="font-medium text-slate-900">{account.healthScore}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Sent Today</span>
                                    <span className="font-medium text-slate-900">{account.sentToday} / {account.maxPerDay}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Warm-up</span>
                                    <Switch
                                        checked={account.warmupEnabled}
                                        onCheckedChange={() => toggleWarmup(account.id)}
                                    />
                                </div>
                                <div className="pt-2 flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add Account Card */}
                <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <CardContent className="flex flex-col items-center justify-center h-full py-12">
                        <div className="p-3 bg-slate-200 group-hover:bg-blue-100 rounded-full mb-4 transition-colors">
                            <Plus className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <p className="font-medium text-slate-900 mb-1">Add Email Account</p>
                        <p className="text-sm text-slate-500 text-center mb-4">
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

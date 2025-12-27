'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Switch,
} from '@/components/ui';
import { Flame, Mail } from 'lucide-react';

interface WarmupSettings {
    enabled: boolean;
    currentDay: number;
    dailyTarget: number;
    sentToday: number;
    maxDailyLimit: number;
}

interface EmailAccount {
    id: string;
    email: string;
    healthScore: number;
    warmupSettings: WarmupSettings | null;
}

export default function WarmupPage() {
    const [accounts, setAccounts] = useState<EmailAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch from an API
        // For demo, we'll use static demo data
        const demoAccounts: EmailAccount[] = [
            {
                id: '1',
                email: 'sales@demo-company.com',
                healthScore: 92,
                warmupSettings: {
                    enabled: true,
                    currentDay: 12,
                    dailyTarget: 35,
                    sentToday: 28,
                    maxDailyLimit: 50,
                },
            },
            {
                id: '2',
                email: 'outreach@demo-company.com',
                healthScore: 88,
                warmupSettings: {
                    enabled: false,
                    currentDay: 1,
                    dailyTarget: 5,
                    sentToday: 0,
                    maxDailyLimit: 50,
                },
            },
        ];

        setAccounts(demoAccounts);
        setLoading(false);
    }, []);

    const handleToggle = (accountId: string, enabled: boolean) => {
        setAccounts(accounts.map(acc =>
            acc.id === accountId
                ? {
                    ...acc,
                    warmupSettings: acc.warmupSettings
                        ? { ...acc.warmupSettings, enabled }
                        : null
                }
                : acc
        ));
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Email Warm-up</h1>
                    <p className="text-surface-500 mt-1">
                        Gradually increase sending volume to build sender reputation
                    </p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Flame className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="font-medium text-orange-900">How Warm-up Works</p>
                        <p className="text-sm text-orange-700 mt-0.5">
                            We gradually increase your sending volume over time, simulating real email activity
                            to build your sender reputation and improve deliverability.
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.length === 0 ? (
                    <Card className="col-span-2">
                        <CardContent className="py-12 text-center">
                            <Mail className="h-12 w-12 text-surface-300 mx-auto mb-4" />
                            <p className="text-surface-500">No email accounts connected</p>
                            <p className="text-sm text-surface-400 mt-1">
                                Add an email account to enable warm-up
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    accounts.map((account) => (
                        <WarmupAccountCard
                            key={account.id}
                            account={account}
                            onToggle={(enabled) => handleToggle(account.id, enabled)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function WarmupAccountCard({
    account,
    onToggle
}: {
    account: EmailAccount;
    onToggle: (enabled: boolean) => void;
}) {
    const settings = account.warmupSettings;
    const isEnabled = settings?.enabled ?? false;
    const progress = settings ? (settings.sentToday / settings.dailyTarget) * 100 : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isEnabled ? 'bg-orange-100' : 'bg-surface-100'}`}>
                            <Flame className={`h-5 w-5 ${isEnabled ? 'text-orange-600' : 'text-surface-400'}`} />
                        </div>
                        <div>
                            <CardTitle className="text-base">{account.email}</CardTitle>
                            <CardDescription>
                                {isEnabled ? `Day ${settings?.currentDay || 1} of warm-up` : 'Warm-up disabled'}
                            </CardDescription>
                        </div>
                    </div>
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={onToggle}
                    />
                </div>
            </CardHeader>
            {isEnabled && settings && (
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-surface-500">Today&apos;s Progress</span>
                                <span className="font-medium text-surface-900">
                                    {settings.sentToday} / {settings.dailyTarget}
                                </span>
                            </div>
                            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-lg font-bold text-surface-900">{settings.dailyTarget}</p>
                                <p className="text-xs text-surface-500">Daily Target</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-surface-900">{settings.maxDailyLimit}</p>
                                <p className="text-xs text-surface-500">Max Limit</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-green-600">{account.healthScore}%</p>
                                <p className="text-xs text-surface-500">Health</p>
                            </div>
                        </div>

                        {/* Schedule Preview */}
                        <div className="pt-4 border-t border-surface-200">
                            <p className="text-sm font-medium text-surface-700 mb-3">Warm-up Schedule</p>
                            <div className="flex items-end justify-between h-16 gap-1">
                                {[5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50].map((value, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t transition-all ${i < (settings.currentDay || 1) ? 'bg-orange-500' : 'bg-surface-200'
                                            }`}
                                        style={{ height: `${(value / 50) * 100}%` }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-surface-400 mt-2">
                                <span>Day 1</span>
                                <span>Day 16</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

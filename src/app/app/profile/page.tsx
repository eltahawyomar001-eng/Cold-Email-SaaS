'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
    Badge,
} from '@/components/ui';
import {
    User,
    Mail,
    Calendar,
    MapPin,
    Briefcase,
    Link as LinkIcon,
    Edit,
    Settings,
    TrendingUp,
    Send,
    Eye,
    Reply,
} from 'lucide-react';

export default function ProfilePage() {
    const { data: session } = useSession();

    const user = {
        name: session?.user?.name || 'Demo User',
        email: session?.user?.email || 'demo@example.com',
        role: 'Owner',
        joinedDate: 'December 2024',
        timezone: 'America/New_York (EST)',
        company: 'Acme Inc.',
        website: 'https://example.com',
    };

    const stats = [
        { label: 'Emails Sent', value: '12,847', icon: Send, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Open Rate', value: '68.2%', icon: Eye, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
        { label: 'Reply Rate', value: '12.4%', icon: Reply, color: 'from-violet-500 to-violet-600', bgColor: 'bg-violet-50' },
        { label: 'Campaigns', value: '24', icon: TrendingUp, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50' },
    ];

    const recentActivity = [
        { action: 'Launched campaign', target: 'Q4 Sales Outreach', time: '2 hours ago' },
        { action: 'Added', target: '150 new leads', time: '5 hours ago' },
        { action: 'Connected', target: 'sales@company.com', time: '1 day ago' },
        { action: 'Created workspace', target: 'Marketing Team', time: '2 days ago' },
        { action: 'Upgraded to', target: 'Pro Plan', time: '1 week ago' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
                    <p className="text-slate-500 mt-1">
                        View and manage your profile information
                    </p>
                </div>
                <Link href="/app/settings">
                    <Button>
                        <Edit className="h-4 w-4" />
                        Edit Profile
                    </Button>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="pt-8 text-center">
                        {/* Avatar */}
                        <div className="relative inline-block">
                            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25 mx-auto">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h2>
                        <p className="text-slate-500">{user.email}</p>
                        <Badge className="mt-2" variant="secondary">{user.role}</Badge>

                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 text-left">
                            <ProfileDetail icon={Calendar} label="Joined" value={user.joinedDate} />
                            <ProfileDetail icon={MapPin} label="Timezone" value={user.timezone} />
                            <ProfileDetail icon={Briefcase} label="Company" value={user.company} />
                            <ProfileDetail icon={LinkIcon} label="Website" value={user.website} isLink />
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                            <Link href="/app/settings" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat) => (
                            <Card key={stat.label} className="group">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                                            <stat.icon className={`h-5 w-5 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
                                        </div>
                                    </div>
                                    <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest actions and updates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-900">
                                                <span className="text-slate-500">{activity.action}</span>{' '}
                                                <span className="font-medium">{activity.target}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">{activity.time}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Account Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your subscription and usage details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                                    <p className="text-sm text-violet-600 font-medium">Current Plan</p>
                                    <p className="text-2xl font-bold text-violet-900 mt-1">Pro</p>
                                    <p className="text-xs text-violet-500 mt-1">Renews Jan 15, 2025</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                                    <p className="text-sm text-emerald-600 font-medium">Email Credits</p>
                                    <p className="text-2xl font-bold text-emerald-900 mt-1">Unlimited</p>
                                    <p className="text-xs text-emerald-500 mt-1">Pro plan feature</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ProfileDetail({
    icon: Icon,
    label,
    value,
    isLink = false,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    isLink?: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-50">
                <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                {isLink ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                        {value.replace('https://', '')}
                    </a>
                ) : (
                    <p className="text-sm font-medium text-slate-900">{value}</p>
                )}
            </div>
        </div>
    );
}

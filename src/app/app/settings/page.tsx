'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
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
    Bell,
    Shield,
    Globe,
    Moon,
    Sun,
    Smartphone,
    Key,
    Save,
    Check,
} from 'lucide-react';

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Form states
    const [name, setName] = useState(session?.user?.name || '');
    const [email] = useState(session?.user?.email || '');
    const [timezone, setTimezone] = useState('America/New_York');
    const [theme, setTheme] = useState('light');

    // Notification preferences
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [campaignAlerts, setCampaignAlerts] = useState(true);
    const [replyNotifications, setReplyNotifications] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Globe },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500 mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {saved ? (
                        <>
                            <Check className="h-4 w-4" />
                            Saved
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </>
                    )}
                </Button>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <Card className="lg:col-span-1 h-fit">
                    <CardContent className="p-2">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </CardContent>
                </Card>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Update your personal information and how others see you
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/25">
                                            {name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <Button variant="outline" size="sm">
                                                Change Avatar
                                            </Button>
                                            <p className="text-xs text-slate-500 mt-2">
                                                JPG, PNG or GIF. Max 2MB.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                disabled
                                                className="w-full h-11 px-4 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-500 cursor-not-allowed"
                                            />
                                            <Badge className="absolute right-3 top-1/2 -translate-y-1/2" variant="secondary">
                                                Verified
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Email cannot be changed. Contact support if needed.
                                        </p>
                                    </div>

                                    {/* Timezone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Timezone
                                        </label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">London (GMT)</option>
                                            <option value="Europe/Paris">Paris (CET)</option>
                                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Choose how and when you want to be notified
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <NotificationToggle
                                    icon={Mail}
                                    title="Email Notifications"
                                    description="Receive important updates via email"
                                    checked={emailNotifications}
                                    onChange={setEmailNotifications}
                                />
                                <NotificationToggle
                                    icon={Bell}
                                    title="Campaign Alerts"
                                    description="Get notified when campaigns complete or need attention"
                                    checked={campaignAlerts}
                                    onChange={setCampaignAlerts}
                                />
                                <NotificationToggle
                                    icon={Smartphone}
                                    title="Reply Notifications"
                                    description="Instant alerts when you receive email replies"
                                    checked={replyNotifications}
                                    onChange={setReplyNotifications}
                                />
                                <NotificationToggle
                                    icon={Mail}
                                    title="Weekly Digest"
                                    description="Receive a summary of your campaign performance weekly"
                                    checked={weeklyDigest}
                                    onChange={setWeeklyDigest}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password to keep your account secure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <Button variant="outline">
                                        <Key className="h-4 w-4" />
                                        Update Password
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                    <CardDescription>
                                        Add an extra layer of security to your account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-amber-100">
                                                <Shield className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">2FA is not enabled</p>
                                                <p className="text-sm text-slate-500">
                                                    Protect your account with two-factor authentication
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline">Enable 2FA</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Display Preferences</CardTitle>
                                <CardDescription>
                                    Customize how the application looks and feels
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Theme Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-700">
                                        Theme
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'light', label: 'Light', icon: Sun },
                                            { id: 'dark', label: 'Dark', icon: Moon },
                                            { id: 'system', label: 'System', icon: Smartphone },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setTheme(option.id)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === option.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <option.icon className={`h-5 w-5 ${theme === option.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                                <span className={`text-sm font-medium ${theme === option.id ? 'text-blue-600' : 'text-slate-600'}`}>
                                                    {option.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Language
                                    </label>
                                    <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                        <option value="en">English (US)</option>
                                        <option value="en-gb">English (UK)</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                        <option value="de">Deutsch</option>
                                    </select>
                                </div>

                                {/* Date Format */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Date Format
                                    </label>
                                    <select className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                        <option value="mdy">MM/DD/YYYY</option>
                                        <option value="dmy">DD/MM/YYYY</option>
                                        <option value="ymd">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

function NotificationToggle({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-300'
                    }`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
}

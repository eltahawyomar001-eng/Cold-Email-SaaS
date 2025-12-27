import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    Check,
    Play,
    Mail,
    Users,
    Zap,
    BarChart3,
    Shield,
    Globe,
    Star,
    ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8">
                                <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                                    <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)" />
                                    <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                                            <stop stopColor="#3B82F6" />
                                            <stop offset="1" stopColor="#8B5CF6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-slate-900">ColdReach</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Features
                            </Link>
                            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Pricing
                            </Link>
                            <Link href="#resources" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Resources
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">
                                Start for free
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-sm font-medium text-blue-700">AI-Powered Cold Email Platform</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                                <span className="text-slate-900">Find Contacts &</span>
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    Close Your Ideal
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    Clients
                                </span>
                            </h1>

                            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                With 700M+ contacts, AI-powered outreach, unlimited email accounts,
                                and an industry-leading platform, ColdReach transforms cold outreach
                                into warm conversations.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <Link href="/register">
                                    <Button size="lg" className="text-base px-8">
                                        Start for free
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <button className="flex items-center gap-2 px-6 py-3 text-slate-700 hover:text-slate-900 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                                    </div>
                                    <span className="font-medium">Watch demo</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    No credit card required
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    Cancel anytime
                                </div>
                            </div>
                        </div>

                        {/* Right - Dashboard Mockup */}
                        <div className="relative">
                            {/* Person Image */}
                            <div className="absolute -left-12 top-8 z-10">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="avatar-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#60A5FA" />
                                                <stop offset="100%" stopColor="#A78BFA" />
                                            </linearGradient>
                                        </defs>
                                        <rect fill="url(#avatar-bg)" width="100" height="100" />
                                        <circle cx="50" cy="35" r="18" fill="#fff" />
                                        <ellipse cx="50" cy="85" rx="30" ry="25" fill="#fff" />
                                    </svg>
                                </div>
                            </div>

                            {/* Main Dashboard Card */}
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                                {/* Browser Header */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="px-4 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500">
                                            app.coldreach.com
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                                    {/* Stats Row */}
                                    <div className="grid grid-cols-4 gap-3 mb-6">
                                        {[
                                            { label: 'Emails Sent', value: '24.8K', color: 'text-blue-600' },
                                            { label: 'Open Rate', value: '68.2%', color: 'text-emerald-600' },
                                            { label: 'Reply Rate', value: '12.4%', color: 'text-violet-600' },
                                            { label: 'Meetings', value: '156', color: 'text-amber-600' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                                                <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                                                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chart Area */}
                                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm font-semibold text-slate-700">Performance</p>
                                            <div className="flex gap-2 text-xs">
                                                <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-medium">7D</span>
                                                <span className="px-2 py-1 rounded text-slate-500">30D</span>
                                            </div>
                                        </div>
                                        <svg className="w-full h-24" viewBox="0 0 300 80" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0,60 C50,55 70,30 100,35 C130,40 150,20 180,25 C210,30 240,15 270,20 C285,22 295,18 300,15 L300,80 L0,80 Z" fill="url(#chart-gradient)" />
                                            <path d="M0,60 C50,55 70,30 100,35 C130,40 150,20 180,25 C210,30 240,15 270,20 C285,22 295,18 300,15" fill="none" stroke="#3B82F6" strokeWidth="2" />
                                        </svg>
                                    </div>

                                    {/* Campaign List */}
                                    <div className="space-y-2">
                                        {[
                                            { name: 'Q4 Sales Outreach', status: 'Active', sent: 1245 },
                                            { name: 'Product Launch', status: 'Draft', sent: 0 },
                                        ].map((campaign) => (
                                            <div key={campaign.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                                                        <Mail className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">{campaign.name}</p>
                                                        <p className="text-xs text-slate-500">{campaign.sent.toLocaleString()} sent</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats Cards */}
                            <div className="absolute -right-4 top-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-48">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">98.7%</p>
                                        <p className="text-xs text-slate-500">Deliverability</p>
                                    </div>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[98%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                                </div>
                            </div>

                            <div className="absolute -left-8 bottom-16 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-52">
                                <p className="text-xs text-slate-500 mb-2">New reply from</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                                        JD
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">John Doe</p>
                                        <p className="text-xs text-emerald-600">Interested! Let&apos;s talk...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logos Section */}
            <section className="py-12 px-6 border-y border-slate-100 bg-slate-50/50">
                <div className="max-w-6xl mx-auto">
                    <p className="text-center text-sm text-slate-500 mb-8">Trusted by 10,000+ sales teams worldwide</p>
                    <div className="flex items-center justify-center gap-12 opacity-50 grayscale">
                        {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company, i) => (
                            <div key={i} className="text-xl font-bold text-slate-400">{company}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Section 1 - Scale Outreach */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl p-8 shadow-lg border border-slate-100">
                                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                                    <div className="p-4 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-900">Email Accounts</p>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {[
                                            { email: 'sales@company.com', provider: 'Gmail', health: 98 },
                                            { email: 'outreach@company.com', provider: 'Outlook', health: 95 },
                                            { email: 'growth@company.com', provider: 'Gmail', health: 92 },
                                        ].map((account) => (
                                            <div key={account.email} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                                        <Mail className="h-5 w-5 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{account.email}</p>
                                                        <p className="text-xs text-slate-500">{account.provider}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-emerald-600">{account.health}%</p>
                                                    <p className="text-xs text-slate-500">Health</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Unlimited Accounts</span>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">
                                Scale Outreach<br />
                                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                    with Unlimited Email Accounts
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Connect unlimited Gmail, Outlook, or custom SMTP accounts.
                                Rotate sending across accounts to maximize deliverability and scale your outreach.
                            </p>
                            <ul className="space-y-3">
                                {['Google & Outlook OAuth', 'Custom SMTP support', 'Auto account rotation', 'Health monitoring'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-slate-700">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-emerald-600" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section 2 - Warm-up */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-4">
                                <Zap className="h-4 w-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-700">Smart Warm-up</span>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">
                                Maximize Inbox<br />
                                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                                    Deliverability
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Automatically warm up new accounts with gradual volume increase and
                                simulated engagement. Build sender reputation before launching campaigns.
                            </p>
                            <ul className="space-y-3">
                                {['Gradual volume ramp-up', 'Simulated opens & replies', 'Reputation monitoring', 'Automatic pausing'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-slate-700">
                                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-amber-600" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">sales@company.com</p>
                                            <p className="text-sm text-slate-500">Day 12 of warm-up</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-emerald-600">98%</p>
                                        <p className="text-xs text-slate-500">Health Score</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600">Today&apos;s Progress</span>
                                        <span className="font-medium text-slate-900">28 / 35</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-4/5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-sm font-medium text-slate-700 mb-3">Warm-up Schedule</p>
                                    <div className="flex items-end justify-between h-20 gap-1">
                                        {[5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50].map((value, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-t-sm transition-all ${i < 12 ? 'bg-gradient-to-t from-amber-400 to-orange-400' : 'bg-slate-200'
                                                    }`}
                                                style={{ height: `${(value / 50) * 100}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section 3 - Analytics */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="font-semibold text-slate-900">Campaign Analytics</p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">This Week</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: 'Sent', value: '2,847', trend: '+12%' },
                                        { label: 'Opened', value: '1,936', trend: '+8%' },
                                        { label: 'Replied', value: '352', trend: '+24%' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="text-center p-4 rounded-xl bg-slate-50">
                                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                            <p className="text-xs text-slate-500">{stat.label}</p>
                                            <p className="text-xs text-emerald-600 font-medium mt-1">{stat.trend}</p>
                                        </div>
                                    ))}
                                </div>

                                <svg className="w-full h-32" viewBox="0 0 400 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,80 C40,75 80,60 120,50 C160,40 200,55 240,45 C280,35 320,20 360,25 C380,27 395,22 400,20 L400,100 L0,100 Z" fill="url(#area-gradient)" />
                                    <path d="M0,80 C40,75 80,60 120,50 C160,40 200,55 240,45 C280,35 320,20 360,25 C380,27 395,22 400,20" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-4">
                                <BarChart3 className="h-4 w-4 text-violet-600" />
                                <span className="text-sm font-medium text-violet-700">Real-time Analytics</span>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">
                                Drive More Results<br />
                                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    with Rich Analytics & Optimization
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Track every metric that matters. Get real-time insights into opens, clicks,
                                replies, and conversions. Optimize your campaigns with data-driven decisions.
                            </p>
                            <Link href="/register">
                                <Button>
                                    Get started free
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Get started for free
                    </h2>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        Join thousands of sales teams using ColdReach to book more meetings
                        and close more deals. Start your free trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" variant="secondary" className="bg-white text-violet-600 hover:bg-white/90 px-8">
                                Start for free
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors font-medium">
                            <Play className="h-5 w-5" fill="currentColor" />
                            Watch demo
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-8 mt-10 text-white/70 text-sm">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            14-day free trial
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Cancel anytime
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8">
                                    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                                        <circle cx="16" cy="16" r="16" fill="url(#logo-gradient-footer)" />
                                        <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <defs>
                                            <linearGradient id="logo-gradient-footer" x1="0" y1="0" x2="32" y2="32">
                                                <stop stopColor="#3B82F6" />
                                                <stop offset="1" stopColor="#8B5CF6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white">ColdReach</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                The all-in-one cold email platform for modern sales teams.
                            </p>
                        </div>

                        {[
                            { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API'] },
                            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
                            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
                        ].map((section) => (
                            <div key={section.title}>
                                <p className="font-semibold text-white mb-4">{section.title}</p>
                                <ul className="space-y-2">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-400 text-sm">
                            © 2024 ColdReach. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                                <Link key={social} href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                                    {social}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

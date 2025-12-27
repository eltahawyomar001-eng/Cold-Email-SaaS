'use client';

import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
} from '@/components/ui';
import { BarChart3, Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

// Demo data
const demoStats = {
    sent: 12847,
    delivered: 12534,
    opened: 8627,
    clicked: 1927,
    replied: 1593,
    bounced: 313,
    openRate: 0.688,
    clickRate: 0.154,
    replyRate: 0.127,
    bounceRate: 0.024,
};

const demoTimeSeries = [
    { date: '2024-12-21', sent: 412, delivered: 405, opened: 287, clicked: 62, replied: 48, bounced: 7 },
    { date: '2024-12-22', sent: 385, delivered: 379, opened: 256, clicked: 54, replied: 41, bounced: 6 },
    { date: '2024-12-23', sent: 456, delivered: 448, opened: 312, clicked: 71, replied: 55, bounced: 8 },
    { date: '2024-12-24', sent: 298, delivered: 291, opened: 195, clicked: 43, replied: 32, bounced: 7 },
    { date: '2024-12-25', sent: 189, delivered: 185, opened: 124, clicked: 28, replied: 21, bounced: 4 },
    { date: '2024-12-26', sent: 423, delivered: 415, opened: 289, clicked: 65, replied: 49, bounced: 8 },
    { date: '2024-12-27', sent: 478, delivered: 469, opened: 327, clicked: 74, replied: 58, bounced: 9 },
];

export default function StatsPage() {
    const [stats] = useState(demoStats);
    const [timeSeries] = useState(demoTimeSeries);
    const [timeRange, setTimeRange] = useState('7d');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                    <p className="text-slate-500 mt-1">
                        Campaign performance and detailed metrics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                        {['7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === range
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
                <MetricCard
                    label="Total Sent"
                    value={stats.sent.toLocaleString()}
                    change={12.5}
                    isPositive
                    color="blue"
                />
                <MetricCard
                    label="Open Rate"
                    value={`${(stats.openRate * 100).toFixed(1)}%`}
                    change={2.3}
                    isPositive
                    color="emerald"
                />
                <MetricCard
                    label="Reply Rate"
                    value={`${(stats.replyRate * 100).toFixed(1)}%`}
                    change={0.8}
                    isPositive
                    color="violet"
                />
                <MetricCard
                    label="Bounce Rate"
                    value={`${(stats.bounceRate * 100).toFixed(1)}%`}
                    change={-0.5}
                    isPositive={false}
                    color="amber"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sending Activity</CardTitle>
                        <CardDescription>Emails sent over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <SimpleBarChart data={timeSeries} dataKey="sent" color="blue" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Engagement</CardTitle>
                        <CardDescription>Opens and replies over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <SimpleBarChart data={timeSeries} dataKey="opened" color="violet" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Breakdown Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Breakdown</CardTitle>
                    <CardDescription>Detailed metrics by day</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="text-left p-4 font-medium text-slate-500">Date</th>
                                <th className="text-right p-4 font-medium text-slate-500">Sent</th>
                                <th className="text-right p-4 font-medium text-slate-500">Delivered</th>
                                <th className="text-right p-4 font-medium text-slate-500">Opened</th>
                                <th className="text-right p-4 font-medium text-slate-500">Clicked</th>
                                <th className="text-right p-4 font-medium text-slate-500">Replied</th>
                                <th className="text-right p-4 font-medium text-slate-500">Bounced</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeSeries.map((day) => (
                                <tr key={day.date} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-900">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="p-4 text-right text-slate-700">{day.sent}</td>
                                    <td className="p-4 text-right text-slate-700">{day.delivered}</td>
                                    <td className="p-4 text-right text-slate-700">{day.opened}</td>
                                    <td className="p-4 text-right text-slate-700">{day.clicked}</td>
                                    <td className="p-4 text-right text-emerald-600 font-medium">{day.replied}</td>
                                    <td className="p-4 text-right text-red-600">{day.bounced}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-50 font-medium">
                                <td className="p-4 text-slate-900">Total</td>
                                <td className="p-4 text-right text-slate-900">{timeSeries.reduce((sum, d) => sum + d.sent, 0)}</td>
                                <td className="p-4 text-right text-slate-900">{timeSeries.reduce((sum, d) => sum + d.delivered, 0)}</td>
                                <td className="p-4 text-right text-slate-900">{timeSeries.reduce((sum, d) => sum + d.opened, 0)}</td>
                                <td className="p-4 text-right text-slate-900">{timeSeries.reduce((sum, d) => sum + d.clicked, 0)}</td>
                                <td className="p-4 text-right text-emerald-600">{timeSeries.reduce((sum, d) => sum + d.replied, 0)}</td>
                                <td className="p-4 text-right text-red-600">{timeSeries.reduce((sum, d) => sum + d.bounced, 0)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}

function MetricCard({
    label,
    value,
    change,
    isPositive,
    color,
}: {
    label: string;
    value: string;
    change: number;
    isPositive: boolean;
    color: 'blue' | 'emerald' | 'violet' | 'amber';
}) {
    const colorClasses = {
        blue: { bg: 'bg-blue-50', text: 'from-blue-500 to-blue-600' },
        emerald: { bg: 'bg-emerald-50', text: 'from-emerald-500 to-emerald-600' },
        violet: { bg: 'bg-violet-50', text: 'from-violet-500 to-violet-600' },
        amber: { bg: 'bg-amber-50', text: 'from-amber-500 to-amber-600' },
    };

    return (
        <Card className="group">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${colorClasses[color].bg}`}>
                        <BarChart3 className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(change)}%
                    </div>
                </div>
                <p className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color].text} bg-clip-text text-transparent mb-1`}>
                    {value}
                </p>
                <p className="text-sm text-slate-500">{label}</p>
            </CardContent>
        </Card>
    );
}

function SimpleBarChart({
    data,
    dataKey,
    color = 'blue',
}: {
    data: any[];
    dataKey: string;
    color?: 'blue' | 'violet' | 'emerald';
}) {
    const max = Math.max(...data.map((d) => d[dataKey] || 0), 1);

    const colorClasses = {
        blue: 'from-blue-400 to-blue-600',
        violet: 'from-violet-400 to-violet-600',
        emerald: 'from-emerald-400 to-emerald-600',
    };

    return (
        <div className="flex items-end justify-between h-full gap-3">
            {data.map((day: any) => {
                const height = ((day[dataKey] || 0) / max) * 100;
                return (
                    <div key={day.date} className="flex-1 flex flex-col items-center group/bar">
                        <div className="w-full flex flex-col justify-end h-48">
                            <div
                                className={`w-full bg-gradient-to-t ${colorClasses[color]} rounded-t-lg transition-all group-hover/bar:opacity-80`}
                                style={{ height: `${height}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

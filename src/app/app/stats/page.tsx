import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserWorkspaces } from '@/server/rbac';
import { getDashboardStats, getTimeSeriesStats } from '@/server/jobs/handlers/stats-rollup';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
    Select,
} from '@/components/ui';
import { BarChart3, Download, TrendingUp, TrendingDown } from 'lucide-react';

export default async function StatsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const workspaces = await getUserWorkspaces(session.user.id);
    const currentWorkspace = workspaces[0];

    if (!currentWorkspace) {
        return <div>No workspace found</div>;
    }

    const stats = await getDashboardStats(currentWorkspace.id);
    const timeSeries = await getTimeSeriesStats(currentWorkspace.id, 7);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Statistics</h1>
                    <p className="text-surface-500 mt-1">
                        Campaign performance and analytics
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Sent"
                    value={stats.sent.toLocaleString()}
                    change={12.5}
                    isPositive
                />
                <MetricCard
                    label="Open Rate"
                    value={`${(stats.openRate * 100).toFixed(1)}%`}
                    change={2.3}
                    isPositive
                />
                <MetricCard
                    label="Reply Rate"
                    value={`${(stats.replyRate * 100).toFixed(1)}%`}
                    change={0.8}
                    isPositive
                />
                <MetricCard
                    label="Bounce Rate"
                    value={`${(stats.bounceRate * 100).toFixed(1)}%`}
                    change={-0.5}
                    isPositive
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
                            <SimpleBarChart data={timeSeries} dataKey="sent" />
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
                            <SimpleBarChart data={timeSeries} dataKey="opened" color="purple" />
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
                            <tr className="border-b border-surface-200">
                                <th className="text-left p-4 font-medium text-surface-500">Date</th>
                                <th className="text-right p-4 font-medium text-surface-500">Sent</th>
                                <th className="text-right p-4 font-medium text-surface-500">Delivered</th>
                                <th className="text-right p-4 font-medium text-surface-500">Opened</th>
                                <th className="text-right p-4 font-medium text-surface-500">Clicked</th>
                                <th className="text-right p-4 font-medium text-surface-500">Replied</th>
                                <th className="text-right p-4 font-medium text-surface-500">Bounced</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeSeries.map((day: any) => (
                                <tr key={day.date} className="border-b border-surface-100">
                                    <td className="p-4 font-medium text-surface-900">{day.date}</td>
                                    <td className="p-4 text-right text-surface-700">{day.sent}</td>
                                    <td className="p-4 text-right text-surface-700">{day.delivered}</td>
                                    <td className="p-4 text-right text-surface-700">{day.opened}</td>
                                    <td className="p-4 text-right text-surface-700">{day.clicked}</td>
                                    <td className="p-4 text-right text-green-600">{day.replied}</td>
                                    <td className="p-4 text-right text-red-600">{day.bounced}</td>
                                </tr>
                            ))}
                        </tbody>
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
}: {
    label: string;
    value: string;
    change: number;
    isPositive: boolean;
}) {
    return (
        <Card>
            <CardContent className="pt-6">
                <p className="text-sm text-surface-500">{label}</p>
                <div className="flex items-end justify-between mt-2">
                    <p className="text-2xl font-bold text-surface-900">{value}</p>
                    <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(change)}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SimpleBarChart({
    data,
    dataKey,
    color = 'primary',
}: {
    data: any[];
    dataKey: string;
    color?: 'primary' | 'purple' | 'green';
}) {
    const max = Math.max(...data.map((d) => d[dataKey] || 0), 1);

    const colorClasses = {
        primary: 'bg-primary-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
    };

    return (
        <div className="flex items-end justify-between h-full gap-2">
            {data.map((day: any) => {
                const height = (day[dataKey] || 0) / max * 100;
                return (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col justify-end h-48">
                            <div
                                className={`w-full ${colorClasses[color]} rounded-t transition-all`}
                                style={{ height: `${height}%` }}
                            />
                        </div>
                        <p className="text-xs text-surface-500 mt-2">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

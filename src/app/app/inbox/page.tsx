import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserWorkspaces } from '@/server/rbac';
import { getInboxThreads, getInboxStats } from '@/server/simulation/inbox-simulator';
import {
    Card,
    CardContent,
    Button,
    Badge,
    EmptyState,
    RelativeTime,
} from '@/components/ui';
import { Inbox, Reply, Archive } from 'lucide-react';

export default async function InboxPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const workspaces = await getUserWorkspaces(session.user.id);
    const currentWorkspace = workspaces[0];

    if (!currentWorkspace) {
        return <div>No workspace found</div>;
    }

    const { threads } = await getInboxThreads(currentWorkspace.id);
    const stats = await getInboxStats(currentWorkspace.id);

    const categories = [
        { key: 'all', label: 'All', count: stats.total },
        { key: 'unread', label: 'Unread', count: stats.unread },
        { key: 'interested', label: 'Interested', count: stats.interested || 0 },
        { key: 'not_interested', label: 'Not Interested', count: stats.not_interested || 0 },
        { key: 'ooo', label: 'OOO', count: stats.ooo || 0 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Inbox</h1>
                    <p className="text-surface-500 mt-1">
                        Manage replies and conversation across all accounts
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.key}
                        variant={cat.key === 'all' ? 'default' : 'outline'}
                        size="sm"
                        className="whitespace-nowrap"
                    >
                        {cat.label}
                        {cat.count > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                                {cat.count}
                            </span>
                        )}
                    </Button>
                ))}
            </div>

            {/* Threads */}
            <Card>
                <CardContent className="p-0">
                    {threads.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            title="No messages yet"
                            description="When leads reply to your campaigns, their messages will appear here."
                        />
                    ) : (
                        <div className="divide-y divide-surface-200">
                            {threads.map((thread) => (
                                <ThreadRow key={thread.id} thread={thread} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function ThreadRow({ thread }: { thread: any }) {
    const lastMessage = thread.messages?.[0];

    return (
        <div className={`p-4 hover:bg-surface-50 cursor-pointer transition-colors ${!thread.isRead ? 'bg-primary-50/30' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                    {/* Unread indicator */}
                    <div className="pt-2">
                        {!thread.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <p className={`font-medium ${!thread.isRead ? 'text-surface-900' : 'text-surface-700'}`}>
                                {thread.leadName || thread.leadEmail}
                            </p>
                            <CategoryBadge category={thread.category} />
                        </div>
                        <p className={`text-sm ${!thread.isRead ? 'font-medium text-surface-800' : 'text-surface-600'} truncate`}>
                            {thread.subject}
                        </p>
                        {lastMessage && (
                            <p className="text-sm text-surface-500 truncate mt-1">
                                {lastMessage.body?.slice(0, 100)}...
                            </p>
                        )}
                        {thread.campaignName && (
                            <p className="text-xs text-surface-400 mt-1">
                                via {thread.campaignName} • {thread.emailAccount?.email}
                            </p>
                        )}
                    </div>
                </div>

                <div className="text-right ml-4 shrink-0">
                    <RelativeTime
                        date={thread.lastMessageAt}
                        className="text-xs text-surface-500"
                    />
                    <div className="flex items-center justify-end space-x-1 mt-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Archive className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CategoryBadge({ category }: { category: string }) {
    const config: Record<string, { variant: 'success' | 'destructive' | 'warning' | 'secondary'; label: string }> = {
        INTERESTED: { variant: 'success', label: 'Interested' },
        NOT_INTERESTED: { variant: 'destructive', label: 'Not Interested' },
        OOO: { variant: 'warning', label: 'OOO' },
        BOUNCE: { variant: 'secondary', label: 'Bounce' },
        SPAM: { variant: 'destructive', label: 'Spam' },
        NEUTRAL: { variant: 'secondary', label: 'Neutral' },
    };

    const { variant, label } = config[category] || { variant: 'secondary' as const, label: category };

    return (
        <Badge variant={variant} className="text-xs">
            {label}
        </Badge>
    );
}

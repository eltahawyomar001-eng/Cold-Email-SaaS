import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getUserWorkspaces } from '@/server/rbac';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    EmptyState,
} from '@/components/ui';
import { Users, Plus, Upload, Search } from 'lucide-react';
import Link from 'next/link';

export default async function LeadsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const workspaces = await getUserWorkspaces(session.user.id);
    const currentWorkspace = workspaces[0];

    if (!currentWorkspace) {
        return <div>No workspace found</div>;
    }

    const leads = await prisma.lead.findMany({
        where: { workspaceId: currentWorkspace.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    const totalLeads = await prisma.lead.count({
        where: { workspaceId: currentWorkspace.id },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Leads</h1>
                    <p className="text-surface-500 mt-1">
                        Manage your contacts and prospects ({totalLeads.toLocaleString()} total)
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import CSV
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lead
                    </Button>
                </div>
            </div>

            {/* Leads Table */}
            <Card>
                <CardContent className="p-0">
                    {leads.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No leads yet"
                            description="Import leads from a CSV file or add them manually."
                            action={
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Lead
                                </Button>
                            }
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Added</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="font-medium">{lead.email}</TableCell>
                                        <TableCell>
                                            {lead.firstName || lead.lastName
                                                ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim()
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{lead.company || '-'}</TableCell>
                                        <TableCell>
                                            <LeadStatusBadge status={lead.status} />
                                        </TableCell>
                                        <TableCell className="text-surface-500">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function LeadStatusBadge({ status }: { status: string }) {
    const variants: Record<string, 'default' | 'success' | 'destructive' | 'warning' | 'secondary'> = {
        ACTIVE: 'success',
        BOUNCED: 'destructive',
        UNSUBSCRIBED: 'warning',
        COMPLAINED: 'destructive',
    };

    return (
        <Badge variant={variants[status] || 'secondary'}>
            {status.toLowerCase()}
        </Badge>
    );
}

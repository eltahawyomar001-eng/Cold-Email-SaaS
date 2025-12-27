'use client';

import { useState } from 'react';
import {
    Card,
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
import { Users, Plus, Upload, Search, MoreVertical, Filter, Download } from 'lucide-react';
import Link from 'next/link';

// Demo data
const demoLeads = [
    { id: '1', email: 'john.smith@techcorp.com', firstName: 'John', lastName: 'Smith', company: 'TechCorp', status: 'ACTIVE', createdAt: new Date('2024-12-20') },
    { id: '2', email: 'sarah.johnson@startup.io', firstName: 'Sarah', lastName: 'Johnson', company: 'Startup.io', status: 'ACTIVE', createdAt: new Date('2024-12-19') },
    { id: '3', email: 'mike.wilson@enterprise.com', firstName: 'Mike', lastName: 'Wilson', company: 'Enterprise Inc', status: 'CONTACTED', createdAt: new Date('2024-12-18') },
    { id: '4', email: 'emma.davis@agency.co', firstName: 'Emma', lastName: 'Davis', company: 'Creative Agency', status: 'REPLIED', createdAt: new Date('2024-12-17') },
    { id: '5', email: 'alex.brown@consulting.com', firstName: 'Alex', lastName: 'Brown', company: 'Brown Consulting', status: 'ACTIVE', createdAt: new Date('2024-12-16') },
    { id: '6', email: 'lisa.martinez@retail.com', firstName: 'Lisa', lastName: 'Martinez', company: 'Retail Plus', status: 'BOUNCED', createdAt: new Date('2024-12-15') },
    { id: '7', email: 'david.lee@fintech.io', firstName: 'David', lastName: 'Lee', company: 'FinTech Solutions', status: 'ACTIVE', createdAt: new Date('2024-12-14') },
    { id: '8', email: 'jennifer.white@healthcare.org', firstName: 'Jennifer', lastName: 'White', company: 'Healthcare Plus', status: 'CONTACTED', createdAt: new Date('2024-12-13') },
];

export default function LeadsPage() {
    const [leads] = useState(demoLeads);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLeads = leads.filter(lead =>
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
                    <p className="text-slate-500 mt-1">
                        Manage your contacts and prospects ({leads.length.toLocaleString()} total)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline">
                        <Upload className="h-4 w-4" />
                        Import CSV
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4" />
                        Add Lead
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* Leads Table */}
            <Card>
                <CardContent className="p-0">
                    {filteredLeads.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No leads found"
                            description={searchQuery ? "No leads match your search criteria." : "Import leads from a CSV file or add them manually."}
                            action={
                                !searchQuery && (
                                    <Button>
                                        <Plus className="h-4 w-4" />
                                        Add Your First Lead
                                    </Button>
                                )
                            }
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <input type="checkbox" className="rounded border-slate-300" />
                                        </TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Added</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeads.map((lead) => (
                                        <TableRow key={lead.id} className="group hover:bg-slate-50">
                                            <TableCell>
                                                <input type="checkbox" className="rounded border-slate-300" />
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-slate-900">{lead.email}</span>
                                            </TableCell>
                                            <TableCell>
                                                {lead.firstName || lead.lastName
                                                    ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{lead.company || '-'}</TableCell>
                                            <TableCell>
                                                <LeadStatusBadge status={lead.status} />
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
                                                    <MoreVertical className="h-4 w-4 text-slate-400" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function LeadStatusBadge({ status }: { status: string }) {
    const config: Record<string, { variant: 'default' | 'success' | 'destructive' | 'warning' | 'secondary'; label: string }> = {
        ACTIVE: { variant: 'secondary', label: 'Active' },
        CONTACTED: { variant: 'default', label: 'Contacted' },
        REPLIED: { variant: 'success', label: 'Replied' },
        BOUNCED: { variant: 'destructive', label: 'Bounced' },
        UNSUBSCRIBED: { variant: 'warning', label: 'Unsubscribed' },
    };

    const { variant, label } = config[status] || { variant: 'secondary' as const, label: status.toLowerCase() };

    return (
        <Badge variant={variant} dot>
            {label}
        </Badge>
    );
}

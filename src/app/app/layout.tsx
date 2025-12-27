import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Sidebar, Header } from '@/components/layout';
import { getUserWorkspaces } from '@/server/rbac';

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    // Get user's workspaces
    const workspaces = await getUserWorkspaces(session.user.id);

    // Use the first workspace as current
    const currentWorkspace = workspaces[0] || null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <Header
                workspaces={workspaces.map((w) => ({
                    id: w.id,
                    name: w.name,
                    role: 'OWNER',
                }))}
                currentWorkspace={currentWorkspace ? {
                    id: currentWorkspace.id,
                    name: currentWorkspace.name,
                    role: 'OWNER',
                } : null}
            />
            <main className="ml-64 pt-16 min-h-screen">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

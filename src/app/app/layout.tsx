import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Sidebar, Header } from '@/components/layout';

// Demo workspace data for when database is not available
const DEMO_WORKSPACE = {
    id: 'demo-workspace',
    name: 'Demo Workspace',
    role: 'OWNER' as const,
};

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check for demo mode cookie
    const cookieStore = await cookies();
    const isDemoMode = cookieStore.get('demo_mode')?.value === 'true';

    // Try to get real session if not in demo mode
    let workspaces = [DEMO_WORKSPACE];
    let currentWorkspace = DEMO_WORKSPACE;

    if (!isDemoMode) {
        try {
            const session = await getServerSession(authOptions);

            if (!session?.user) {
                redirect('/login');
            }

            // Try to fetch real workspaces
            const { getUserWorkspaces } = await import('@/server/rbac');
            const realWorkspaces = await getUserWorkspaces(session.user.id);

            if (realWorkspaces.length > 0) {
                workspaces = realWorkspaces.map((w) => ({
                    id: w.id,
                    name: w.name,
                    role: 'OWNER' as const,
                }));
                currentWorkspace = workspaces[0];
            }
        } catch (error) {
            // Database not available - redirect to login for demo mode
            redirect('/login');
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {isDemoMode && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-1.5 text-sm font-medium">
                    Demo Mode - This is a preview with simulated data
                </div>
            )}
            <Sidebar />
            <Header
                workspaces={workspaces}
                currentWorkspace={currentWorkspace}
            />
            <main className={`ml-64 pt-16 min-h-screen ${isDemoMode ? 'mt-8' : ''}`}>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

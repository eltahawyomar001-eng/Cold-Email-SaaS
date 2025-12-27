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
                <div className="fixed top-0 left-0 right-0 z-[100] h-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium shadow-lg flex items-center justify-center">
                    <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Demo Mode - This is a preview with simulated data
                    </span>
                </div>
            )}
            <Sidebar isDemoMode={isDemoMode} />
            <Header
                workspaces={workspaces}
                currentWorkspace={currentWorkspace}
                isDemoMode={isDemoMode}
            />
            <main className={`ml-64 min-h-screen ${isDemoMode ? 'pt-[104px]' : 'pt-16'}`}>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

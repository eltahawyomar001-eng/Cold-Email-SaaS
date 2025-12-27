import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Permission, ROLE_PERMISSIONS, Role, PLAN_LIMITS, PlanType } from '@/lib/constants';

// =============================================================================
// SESSION HELPERS
// =============================================================================

/**
 * Get the current authenticated user from session
 */
export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            subscriptions: {
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });

    return user;
}

/**
 * Get the current user's active subscription and plan
 */
export async function getCurrentUserPlan(userId: string): Promise<PlanType> {
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
    });

    return (subscription?.plan as PlanType) || 'FREE';
}

// =============================================================================
// WORKSPACE ACCESS
// =============================================================================

/**
 * Get workspace member with role for a user
 */
export async function getWorkspaceMember(userId: string, workspaceId: string) {
    return prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: { userId, workspaceId },
        },
        include: {
            workspace: true,
        },
    });
}

/**
 * Get all workspaces for a user
 */
export async function getUserWorkspaces(userId: string) {
    const memberships = await prisma.workspaceMember.findMany({
        where: { userId },
        include: {
            workspace: {
                include: {
                    _count: {
                        select: {
                            members: true,
                            leads: true,
                            campaigns: true,
                            emailAccounts: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => ({
        ...m.workspace,
        role: m.role as Role,
        memberCount: m.workspace._count.members,
        leadCount: m.workspace._count.leads,
        campaignCount: m.workspace._count.campaigns,
        accountCount: m.workspace._count.emailAccounts,
    }));
}

// =============================================================================
// PERMISSION CHECKS
// =============================================================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
}

/**
 * Check if user has permission in workspace
 */
export async function checkPermission(
    userId: string,
    workspaceId: string,
    permission: Permission
): Promise<boolean> {
    const member = await getWorkspaceMember(userId, workspaceId);
    if (!member) return false;

    return hasPermission(member.role as Role, permission);
}

/**
 * Require permission - throws if not allowed
 */
export async function requirePermission(
    userId: string,
    workspaceId: string,
    permission: Permission
): Promise<void> {
    const allowed = await checkPermission(userId, workspaceId, permission);
    if (!allowed) {
        throw new Error(`Permission denied: ${permission}`);
    }
}

/**
 * Get the user's role in a workspace
 */
export async function getUserRole(userId: string, workspaceId: string): Promise<Role | null> {
    const member = await getWorkspaceMember(userId, workspaceId);
    return member ? (member.role as Role) : null;
}

// =============================================================================
// PLAN LIMIT CHECKS
// =============================================================================

/**
 * Check if user can create more of a resource
 */
export async function checkPlanLimit(
    userId: string,
    resource: 'workspaces' | 'emailAccounts' | 'campaigns' | 'leads' | 'teamMembers',
    workspaceId?: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
    const plan = await getCurrentUserPlan(userId);
    const limits = PLAN_LIMITS[plan];
    const limit = limits[resource === 'leads' ? 'leadsPerWorkspace' : resource];

    // Unlimited (-1)
    if (limit === -1) {
        return { allowed: true, current: 0, limit: -1 };
    }

    let current = 0;

    switch (resource) {
        case 'workspaces':
            current = await prisma.workspaceMember.count({
                where: { userId, role: 'OWNER' },
            });
            break;

        case 'emailAccounts':
            if (!workspaceId) throw new Error('workspaceId required');
            current = await prisma.emailAccount.count({
                where: { workspaceId },
            });
            break;

        case 'campaigns':
            if (!workspaceId) throw new Error('workspaceId required');
            current = await prisma.campaign.count({
                where: { workspaceId },
            });
            break;

        case 'leads':
            if (!workspaceId) throw new Error('workspaceId required');
            current = await prisma.lead.count({
                where: { workspaceId },
            });
            break;

        case 'teamMembers':
            if (!workspaceId) throw new Error('workspaceId required');
            current = await prisma.workspaceMember.count({
                where: { workspaceId },
            });
            break;
    }

    return {
        allowed: current < limit,
        current,
        limit,
    };
}

/**
 * Check if a feature is available for the user's plan
 */
export async function checkFeatureAccess(
    userId: string,
    feature: keyof typeof PLAN_LIMITS.FREE.features
): Promise<boolean> {
    const plan = await getCurrentUserPlan(userId);
    return PLAN_LIMITS[plan].features[feature];
}

// =============================================================================
// API ROUTE HELPERS
// =============================================================================

/**
 * Require authentication - returns user or throws
 */
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Authentication required');
    }
    return user;
}

/**
 * Require workspace access - returns member or throws
 */
export async function requireWorkspaceAccess(workspaceId: string) {
    const user = await requireAuth();
    const member = await getWorkspaceMember(user.id, workspaceId);

    if (!member) {
        throw new Error('Workspace access denied');
    }

    return { user, member, role: member.role as Role };
}

/**
 * Require workspace permission - returns context or throws
 */
export async function requireWorkspacePermission(
    workspaceId: string,
    permission: Permission
) {
    const { user, member, role } = await requireWorkspaceAccess(workspaceId);

    if (!hasPermission(role, permission)) {
        throw new Error(`Permission denied: ${permission}`);
    }

    return { user, member, role };
}

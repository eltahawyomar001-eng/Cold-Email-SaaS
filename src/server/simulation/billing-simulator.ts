import { prisma } from '@/lib/db';
import { PlanType, PLAN_LIMITS, PLAN_PRICES } from '@/lib/constants';
import { v4 as uuid } from 'uuid';

// =============================================================================
// PLAN INFORMATION
// =============================================================================

export interface PlanInfo {
    id: PlanType;
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    limits: typeof PLAN_LIMITS.FREE;
    popular?: boolean;
}

export const PLANS: PlanInfo[] = [
    {
        id: 'FREE',
        name: 'Free',
        description: 'Perfect for trying out the platform',
        priceMonthly: PLAN_PRICES.FREE.monthly,
        priceYearly: PLAN_PRICES.FREE.yearly,
        limits: PLAN_LIMITS.FREE,
    },
    {
        id: 'STARTER',
        name: 'Starter',
        description: 'For small teams getting started with outreach',
        priceMonthly: PLAN_PRICES.STARTER.monthly,
        priceYearly: PLAN_PRICES.STARTER.yearly,
        limits: PLAN_LIMITS.STARTER,
        popular: true,
    },
    {
        id: 'PRO',
        name: 'Pro',
        description: 'For growing teams that need more power',
        priceMonthly: PLAN_PRICES.PRO.monthly,
        priceYearly: PLAN_PRICES.PRO.yearly,
        limits: PLAN_LIMITS.PRO,
    },
];

// =============================================================================
// SUBSCRIPTION MANAGEMENT
// =============================================================================

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
    });

    return subscription;
}

/**
 * Get current plan info for user
 */
export async function getUserPlanInfo(userId: string): Promise<PlanInfo> {
    const subscription = await getUserSubscription(userId);
    const planId = (subscription?.plan as PlanType) || 'FREE';

    return PLANS.find((p) => p.id === planId) || PLANS[0];
}

/**
 * Simulate checkout for a plan
 */
export async function simulateCheckout(
    userId: string,
    plan: PlanType,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
): Promise<{
    success: boolean;
    subscriptionId: string;
    message: string;
}> {
    // Cancel any existing active subscriptions
    await prisma.subscription.updateMany({
        where: {
            userId,
            status: 'ACTIVE',
        },
        data: {
            status: 'CANCELED',
            canceledAt: new Date(),
        },
    });

    // Calculate billing period
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
        data: {
            userId,
            plan,
            status: 'ACTIVE',
            stripeCustomerId: `cus_${uuid().slice(0, 14)}`,
            stripeSubscriptionId: `sub_${uuid().slice(0, 14)}`,
            stripePriceId: `price_${plan.toLowerCase()}_${billingCycle}`,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
        },
    });

    return {
        success: true,
        subscriptionId: subscription.id,
        message: `Successfully upgraded to ${plan} plan!`,
    };
}

/**
 * Simulate canceling a subscription
 */
export async function simulateCancelSubscription(
    userId: string
): Promise<{
    success: boolean;
    message: string;
}> {
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
        return {
            success: false,
            message: 'No active subscription found',
        };
    }

    if (subscription.plan === 'FREE') {
        return {
            success: false,
            message: 'Cannot cancel free plan',
        };
    }

    // Mark as canceled (will remain active until period end)
    await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
            canceledAt: new Date(),
        },
    });

    return {
        success: true,
        message: 'Subscription canceled. You will have access until the end of your billing period.',
    };
}

/**
 * Simulate downgrade to free plan
 */
export async function simulateDowngradeToFree(userId: string): Promise<void> {
    // Cancel existing subscription
    await prisma.subscription.updateMany({
        where: {
            userId,
            status: 'ACTIVE',
        },
        data: {
            status: 'CANCELED',
            canceledAt: new Date(),
        },
    });

    // Create free subscription
    await prisma.subscription.create({
        data: {
            userId,
            plan: 'FREE',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
        },
    });
}

// =============================================================================
// BILLING WEBHOOK SIMULATION
// =============================================================================

/**
 * Simulate processing a Stripe webhook event
 */
export async function processWebhookEvent(
    eventType: string,
    payload: Record<string, unknown>
): Promise<{
    processed: boolean;
    message: string;
}> {
    switch (eventType) {
        case 'invoice.payment_succeeded': {
            const subscriptionId = payload.subscriptionId as string;
            if (subscriptionId) {
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscriptionId },
                    data: { status: 'ACTIVE' },
                });
            }
            return { processed: true, message: 'Payment succeeded, subscription activated' };
        }

        case 'invoice.payment_failed': {
            const subscriptionId = payload.subscriptionId as string;
            if (subscriptionId) {
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscriptionId },
                    data: { status: 'PAST_DUE' },
                });
            }
            return { processed: true, message: 'Payment failed, subscription marked as past due' };
        }

        case 'customer.subscription.deleted': {
            const subscriptionId = payload.subscriptionId as string;
            if (subscriptionId) {
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscriptionId },
                    data: { status: 'CANCELED', canceledAt: new Date() },
                });
            }
            return { processed: true, message: 'Subscription canceled' };
        }

        default:
            return { processed: false, message: `Unknown event type: ${eventType}` };
    }
}

// =============================================================================
// USAGE TRACKING
// =============================================================================

/**
 * Get usage statistics for billing display
 */
export async function getUsageStats(userId: string, workspaceId: string) {
    const [
        emailAccountCount,
        campaignCount,
        leadCount,
        memberCount,
    ] = await Promise.all([
        prisma.emailAccount.count({ where: { workspaceId } }),
        prisma.campaign.count({ where: { workspaceId } }),
        prisma.lead.count({ where: { workspaceId } }),
        prisma.workspaceMember.count({ where: { workspaceId } }),
    ]);

    const planInfo = await getUserPlanInfo(userId);

    return {
        emailAccounts: {
            used: emailAccountCount,
            limit: planInfo.limits.emailAccounts,
        },
        campaigns: {
            used: campaignCount,
            limit: planInfo.limits.campaigns,
        },
        leads: {
            used: leadCount,
            limit: planInfo.limits.leadsPerWorkspace,
        },
        teamMembers: {
            used: memberCount,
            limit: planInfo.limits.teamMembers,
        },
    };
}

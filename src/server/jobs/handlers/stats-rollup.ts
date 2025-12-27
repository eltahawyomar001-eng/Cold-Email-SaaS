import { prisma } from '@/lib/db';
import { updateAccountHealth } from '@/server/simulation/email-simulator';

/**
 * Process stats rollup for a workspace
 */
export async function processStatsRollup(
    payload: Record<string, unknown>
): Promise<{ campaignsUpdated: number }> {
    const workspaceId = payload.workspaceId as string;

    // Get all campaigns for this workspace
    const campaigns = await prisma.campaign.findMany({
        where: { workspaceId },
        select: { id: true, emailAccountId: true },
    });

    let updated = 0;

    for (const campaign of campaigns) {
        // Aggregate events for this campaign
        const events = await prisma.emailEvent.groupBy({
            by: ['type'],
            where: {
                campaignLead: {
                    campaignId: campaign.id,
                },
            },
            _count: true,
        });

        const counts: Record<string, number> = {};
        events.forEach((e) => {
            counts[e.type] = e._count;
        });

        // Get total leads
        const totalLeads = await prisma.campaignLead.count({
            where: { campaignId: campaign.id },
        });

        // Update campaign stats
        await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
                totalLeads,
                sentCount: counts['SENT'] || 0,
                deliveredCount: counts['DELIVERED'] || 0,
                openedCount: counts['OPENED'] || 0,
                clickedCount: counts['CLICKED'] || 0,
                repliedCount: counts['REPLIED'] || 0,
                bouncedCount: counts['BOUNCED'] || 0,
            },
        });

        // Update account health if applicable
        if (campaign.emailAccountId) {
            await updateAccountHealth(campaign.emailAccountId);
        }

        updated++;
    }

    return { campaignsUpdated: updated };
}

/**
 * Get aggregated stats for dashboard
 */
export async function getDashboardStats(workspaceId: string) {
    // Get campaign totals
    const campaigns = await prisma.campaign.aggregate({
        where: { workspaceId },
        _sum: {
            sentCount: true,
            deliveredCount: true,
            openedCount: true,
            clickedCount: true,
            repliedCount: true,
            bouncedCount: true,
        },
        _count: true,
    });

    // Calculate rates
    const sent = campaigns._sum.sentCount || 0;
    const delivered = campaigns._sum.deliveredCount || 0;
    const opened = campaigns._sum.openedCount || 0;
    const clicked = campaigns._sum.clickedCount || 0;
    const replied = campaigns._sum.repliedCount || 0;
    const bounced = campaigns._sum.bouncedCount || 0;

    return {
        totalCampaigns: campaigns._count,
        sent,
        delivered,
        opened,
        clicked,
        replied,
        bounced,
        deliveryRate: sent > 0 ? delivered / sent : 0,
        openRate: delivered > 0 ? opened / delivered : 0,
        clickRate: opened > 0 ? clicked / opened : 0,
        replyRate: delivered > 0 ? replied / delivered : 0,
        bounceRate: sent > 0 ? bounced / sent : 0,
    };
}

/**
 * Get stats for a specific campaign
 */
export async function getCampaignStats(campaignId: string) {
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: {
            sentCount: true,
            deliveredCount: true,
            openedCount: true,
            clickedCount: true,
            repliedCount: true,
            bouncedCount: true,
            totalLeads: true,
        },
    });

    if (!campaign) return null;

    const { sentCount, deliveredCount, openedCount, clickedCount, repliedCount, bouncedCount, totalLeads } = campaign;

    return {
        totalLeads,
        sent: sentCount,
        delivered: deliveredCount,
        opened: openedCount,
        clicked: clickedCount,
        replied: repliedCount,
        bounced: bouncedCount,
        deliveryRate: sentCount > 0 ? deliveredCount / sentCount : 0,
        openRate: deliveredCount > 0 ? openedCount / deliveredCount : 0,
        clickRate: openedCount > 0 ? clickedCount / openedCount : 0,
        replyRate: deliveredCount > 0 ? repliedCount / deliveredCount : 0,
        bounceRate: sentCount > 0 ? bouncedCount / sentCount : 0,
    };
}

/**
 * Get time series data for charts
 */
export async function getTimeSeriesStats(
    workspaceId: string,
    days: number = 7
) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get events grouped by date
    const events = await prisma.emailEvent.findMany({
        where: {
            campaignLead: {
                campaign: { workspaceId },
            },
            occurredAt: { gte: startDate },
        },
        select: {
            type: true,
            occurredAt: true,
        },
    });

    // Group by date and type
    const byDate: Record<string, Record<string, number>> = {};

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        byDate[dateStr] = {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
            bounced: 0,
        };
    }

    events.forEach((event) => {
        const dateStr = event.occurredAt.toISOString().split('T')[0];
        if (byDate[dateStr]) {
            const key = event.type.toLowerCase();
            if (byDate[dateStr][key] !== undefined) {
                byDate[dateStr][key]++;
            }
        }
    });

    // Convert to array
    return Object.entries(byDate).map(([date, counts]) => ({
        date,
        ...counts,
    }));
}

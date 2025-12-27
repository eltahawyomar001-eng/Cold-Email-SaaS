import { prisma } from '@/lib/db';
import { createSimulatedReply } from '@/server/simulation/inbox-simulator';
import { ThreadCategory, REPLY_CATEGORY_PROBABILITIES } from '@/lib/constants';

/**
 * Weighted random selection for category
 */
function weightedRandom<T extends string>(weights: Record<T, number>): T {
    const entries = Object.entries(weights) as [T, number][];
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let random = Math.random() * total;

    for (const [key, weight] of entries) {
        random -= weight;
        if (random <= 0) {
            return key;
        }
    }

    return entries[0][0];
}

/**
 * Process generating a simulated reply
 */
export async function processGenerateReply(
    payload: Record<string, unknown>
): Promise<{ generated: boolean; category: ThreadCategory }> {
    const campaignLeadId = payload.campaignLeadId as string;

    // Get campaign lead with campaign and account info
    const campaignLead = await prisma.campaignLead.findUnique({
        where: { id: campaignLeadId },
        include: {
            lead: true,
            campaign: {
                include: {
                    emailAccount: true,
                    workspace: true,
                    steps: { orderBy: { order: 'asc' }, take: 1 },
                },
            },
        },
    });

    if (!campaignLead || !campaignLead.campaign.emailAccount) {
        return { generated: false, category: 'NEUTRAL' };
    }

    // Check if a reply event exists
    const replyEvent = await prisma.emailEvent.findFirst({
        where: {
            campaignLeadId,
            type: 'REPLIED',
        },
        orderBy: { occurredAt: 'desc' },
    });

    // Determine category from event metadata or randomly
    let category: ThreadCategory;

    if (replyEvent?.metadata) {
        try {
            const meta = JSON.parse(replyEvent.metadata);
            category = meta.category as ThreadCategory || weightedRandom(REPLY_CATEGORY_PROBABILITIES);
        } catch {
            category = weightedRandom(REPLY_CATEGORY_PROBABILITIES);
        }
    } else {
        category = weightedRandom(REPLY_CATEGORY_PROBABILITIES);
    }

    const { campaign, lead } = campaignLead;
    const step = campaign.steps[0];

    // Create the reply
    await createSimulatedReply(
        campaign.workspaceId,
        campaign.emailAccount.id,
        campaign.id,
        campaign.name,
        lead.email,
        lead.firstName || lead.company || null,
        campaign.emailAccount.email,
        campaign.emailAccount.name,
        step?.subject || 'Your email',
        category
    );

    return { generated: true, category };
}

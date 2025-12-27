import { prisma } from '@/lib/db';
import {
    simulateEmailSend,
    canSendEmail,
    incrementSendCount,
    isWithinSendingWindow,
    calculateNextStepTime
} from '@/server/simulation/email-simulator';
import { createJob, scheduleReplyGeneration } from '../runner';
import { safeJsonParse } from '@/lib/utils';

/**
 * Process campaign tick - check for due sends and schedule them
 */
export async function processCampaignTick(
    payload: Record<string, unknown>
): Promise<{ processed: number; scheduled: number }> {
    const campaignId = payload.campaignId as string;

    // Get campaign with account
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
            emailAccount: true,
            steps: { orderBy: { order: 'asc' } },
        },
    });

    if (!campaign || campaign.status !== 'ACTIVE') {
        return { processed: 0, scheduled: 0 };
    }

    // Check sending window
    const sendingDays = safeJsonParse<number[]>(campaign.sendingDays, [1, 2, 3, 4, 5]);
    if (!isWithinSendingWindow(
        sendingDays,
        campaign.sendingStartHour,
        campaign.sendingEndHour,
        campaign.timezone
    )) {
        // Schedule next tick for later
        await createJob(
            'CAMPAIGN_TICK',
            { campaignId },
            {
                workspaceId: campaign.workspaceId,
                runAt: new Date(Date.now() + 60000) // Check again in 1 minute
            }
        );
        return { processed: 0, scheduled: 0 };
    }

    // Check if we can send
    if (!campaign.emailAccountId || !campaign.emailAccount) {
        return { processed: 0, scheduled: 0 };
    }

    const canSend = await canSendEmail(campaign.emailAccountId);
    if (!canSend.canSend) {
        // Schedule next tick for later
        await createJob(
            'CAMPAIGN_TICK',
            { campaignId },
            {
                workspaceId: campaign.workspaceId,
                runAt: new Date(Date.now() + 60000)
            }
        );
        return { processed: 0, scheduled: 0 };
    }

    // Get campaign leads that are due for next step
    const now = new Date();
    const dueLeads = await prisma.campaignLead.findMany({
        where: {
            campaignId,
            status: 'ACTIVE',
            OR: [
                { nextStepAt: null, currentStep: 0 },
                { nextStepAt: { lte: now } },
            ],
        },
        include: { lead: true },
        take: 10, // Process up to 10 leads per tick
    });

    let processed = 0;
    let scheduled = 0;

    for (const campaignLead of dueLeads) {
        // Recheck send limits (they might have been used up)
        const stillCanSend = await canSendEmail(campaign.emailAccountId);
        if (!stillCanSend.canSend) {
            break;
        }

        // Get the next step
        const nextStepIndex = campaignLead.currentStep;
        const step = campaign.steps[nextStepIndex];

        if (!step) {
            // No more steps - mark as completed
            await prisma.campaignLead.update({
                where: { id: campaignLead.id },
                data: {
                    status: 'COMPLETED',
                    completedAt: now,
                },
            });
            processed++;
            continue;
        }

        // Schedule send job
        await createJob(
            'SEND_EMAIL_STEP',
            {
                campaignLeadId: campaignLead.id,
                campaignId,
                stepId: step.id,
                stepNumber: nextStepIndex + 1,
                emailAccountId: campaign.emailAccountId,
                leadEmail: campaignLead.lead.email,
                leadName: campaignLead.lead.firstName || campaignLead.lead.company,
                subject: step.subject,
                body: step.body,
            },
            { workspaceId: campaign.workspaceId }
        );

        scheduled++;
    }

    // Schedule next tick if there might be more work
    const remainingLeads = await prisma.campaignLead.count({
        where: {
            campaignId,
            status: 'ACTIVE',
        },
    });

    if (remainingLeads > 0) {
        await createJob(
            'CAMPAIGN_TICK',
            { campaignId },
            {
                workspaceId: campaign.workspaceId,
                runAt: new Date(Date.now() + 10000) // Next tick in 10 seconds
            }
        );
    } else {
        // Check if campaign is complete
        const pendingCount = await prisma.campaignLead.count({
            where: {
                campaignId,
                status: { in: ['PENDING', 'ACTIVE'] },
            },
        });

        if (pendingCount === 0) {
            await prisma.campaign.update({
                where: { id: campaignId },
                data: {
                    status: 'COMPLETED',
                    completedAt: now,
                },
            });
        }
    }

    return { processed, scheduled };
}

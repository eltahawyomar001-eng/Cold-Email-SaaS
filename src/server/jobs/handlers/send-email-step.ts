import { prisma } from '@/lib/db';
import {
    simulateEmailSend,
    saveEmailEvents,
    incrementSendCount,
    calculateNextStepTime
} from '@/server/simulation/email-simulator';
import { scheduleReplyGeneration, scheduleStatsRollup } from '../runner';
import { ThreadCategory } from '@/lib/constants';

/**
 * Process sending an email step
 */
export async function processSendEmailStep(
    payload: Record<string, unknown>
): Promise<{ sent: boolean; events: number }> {
    const {
        campaignLeadId,
        campaignId,
        stepId,
        stepNumber,
        emailAccountId,
        leadEmail,
        leadName,
    } = payload as {
        campaignLeadId: string;
        campaignId: string;
        stepId: string;
        stepNumber: number;
        emailAccountId: string;
        leadEmail: string;
        leadName: string;
    };

    // Get campaign and step
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
            steps: { orderBy: { order: 'asc' } },
            workspace: true,
        },
    });

    if (!campaign) {
        throw new Error('Campaign not found');
    }

    // Simulate email send
    const result = await simulateEmailSend(campaignLeadId, stepNumber, emailAccountId);

    // Save events with correct step number
    const eventsWithStep = result.events.map((e) => ({
        ...e,
        stepNumber,
    }));

    await prisma.emailEvent.createMany({
        data: eventsWithStep.map((event) => ({
            campaignLeadId,
            type: event.type,
            stepNumber: event.stepNumber || stepNumber,
            occurredAt: event.occurredAt,
            metadata: JSON.stringify(event.metadata || {}),
        })),
    });

    // Increment account send count
    await incrementSendCount(emailAccountId);

    // Update campaign stats
    await prisma.campaign.update({
        where: { id: campaignId },
        data: {
            sentCount: { increment: 1 },
            deliveredCount: result.events.some((e) => e.type === 'DELIVERED')
                ? { increment: 1 }
                : undefined,
            openedCount: result.events.some((e) => e.type === 'OPENED')
                ? { increment: 1 }
                : undefined,
            clickedCount: result.events.some((e) => e.type === 'CLICKED')
                ? { increment: 1 }
                : undefined,
            repliedCount: result.events.some((e) => e.type === 'REPLIED')
                ? { increment: 1 }
                : undefined,
            bouncedCount: result.events.some((e) => e.type === 'BOUNCED')
                ? { increment: 1 }
                : undefined,
        },
    });

    // Determine next status and step
    const hasBounce = result.events.some((e) => e.type === 'BOUNCED');
    const hasReply = result.events.some((e) => e.type === 'REPLIED');
    const hasSpam = result.events.some((e) => e.type === 'SPAM');

    let newStatus = 'ACTIVE';
    let nextStepAt: Date | null = null;

    if (hasBounce && campaign.stopOnBounce) {
        newStatus = 'BOUNCED';
    } else if (hasReply && campaign.stopOnReply) {
        newStatus = 'REPLIED';
    } else if (hasSpam) {
        newStatus = 'COMPLETED';
    } else {
        // Check if there's a next step
        const currentStepIndex = stepNumber - 1;
        const nextStep = campaign.steps[currentStepIndex + 1];

        if (nextStep) {
            nextStepAt = calculateNextStepTime(
                nextStep.delayAmount,
                nextStep.delayUnit as 'minutes' | 'hours' | 'days'
            );
        } else {
            newStatus = 'COMPLETED';
        }
    }

    // Update campaign lead
    await prisma.campaignLead.update({
        where: { id: campaignLeadId },
        data: {
            status: newStatus,
            currentStep: stepNumber,
            lastStepAt: new Date(),
            nextStepAt,
            completedAt: newStatus === 'COMPLETED' || newStatus === 'BOUNCED'
                ? new Date()
                : undefined,
        },
    });

    // If reply should be generated, schedule it
    if (result.shouldGenerateReply && result.replyCategory) {
        await scheduleReplyGeneration(
            campaignLeadId,
            campaign.workspaceId,
            Math.random() * 60000 + 30000 // 30 seconds to 1.5 minutes delay
        );
    }

    // Schedule stats rollup
    await scheduleStatsRollup(campaign.workspaceId);

    return {
        sent: true,
        events: result.events.length,
    };
}

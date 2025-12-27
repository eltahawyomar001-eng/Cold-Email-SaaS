import { prisma } from '@/lib/db';
import { JobType } from '@/lib/constants';
import { processCampaignTick } from './handlers/campaign-tick';
import { processSendEmailStep } from './handlers/send-email-step';
import { processGenerateReply } from './handlers/generate-reply';
import { processWarmupTick } from './handlers/warmup-tick';
import { processStatsRollup } from './handlers/stats-rollup';

// =============================================================================
// JOB RUNNER
// =============================================================================

let isRunning = false;
let runnerInterval: NodeJS.Timeout | null = null;

/**
 * Job handler type
 */
type JobHandler = (payload: Record<string, unknown>) => Promise<Record<string, unknown> | void>;

/**
 * Job handlers registry
 */
const handlers: Record<JobType, JobHandler> = {
    CAMPAIGN_TICK: processCampaignTick,
    SEND_EMAIL_STEP: processSendEmailStep,
    GENERATE_REPLY: processGenerateReply,
    WARMUP_TICK: processWarmupTick,
    STATS_ROLLUP: processStatsRollup,
    INBOX_SYNC: async () => { }, // No-op for demo - inbox is simulated
};

/**
 * Start the job runner
 */
export function startJobRunner(intervalMs: number = 5000): void {
    if (isRunning) {
        console.log('[JobRunner] Already running');
        return;
    }

    isRunning = true;
    console.log(`[JobRunner] Started with ${intervalMs}ms interval`);

    // Initial run
    processJobs();

    // Set up interval
    runnerInterval = setInterval(processJobs, intervalMs);
}

/**
 * Stop the job runner
 */
export function stopJobRunner(): void {
    if (!isRunning) {
        console.log('[JobRunner] Not running');
        return;
    }

    if (runnerInterval) {
        clearInterval(runnerInterval);
        runnerInterval = null;
    }

    isRunning = false;
    console.log('[JobRunner] Stopped');
}

/**
 * Check if job runner is running
 */
export function isJobRunnerRunning(): boolean {
    return isRunning;
}

/**
 * Process pending jobs
 */
async function processJobs(): Promise<void> {
    try {
        const now = new Date();

        // Fetch due jobs
        const jobs = await prisma.job.findMany({
            where: {
                status: 'PENDING',
                runAt: { lte: now },
            },
            orderBy: { runAt: 'asc' },
            take: 10, // Process up to 10 jobs at a time
        });

        if (jobs.length === 0) {
            return;
        }

        console.log(`[JobRunner] Processing ${jobs.length} jobs`);

        // Process each job
        for (const job of jobs) {
            await processJob(job.id, job.type as JobType, job.payload);
        }
    } catch (error) {
        console.error('[JobRunner] Error processing jobs:', error);
    }
}

/**
 * Process a single job
 */
async function processJob(
    jobId: string,
    type: JobType,
    payloadJson: string
): Promise<void> {
    try {
        // Mark as in progress
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
            },
        });

        // Parse payload
        const payload = JSON.parse(payloadJson) as Record<string, unknown>;

        // Get handler
        const handler = handlers[type];
        if (!handler) {
            throw new Error(`No handler for job type: ${type}`);
        }

        // Execute handler
        const result = await handler(payload);

        // Mark as done
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: 'DONE',
                completedAt: new Date(),
                result: result ? JSON.stringify(result) : null,
            },
        });

        console.log(`[JobRunner] Job ${jobId} (${type}) completed`);
    } catch (error) {
        console.error(`[JobRunner] Job ${jobId} failed:`, error);

        // Get current job to check retries
        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (job && job.retries < job.maxRetries) {
            // Retry later
            await prisma.job.update({
                where: { id: jobId },
                data: {
                    status: 'PENDING',
                    retries: { increment: 1 },
                    runAt: new Date(Date.now() + 60000), // Retry in 1 minute
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        } else {
            // Mark as failed
            await prisma.job.update({
                where: { id: jobId },
                data: {
                    status: 'FAILED',
                    completedAt: new Date(),
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        }
    }
}

// =============================================================================
// JOB CREATION HELPERS
// =============================================================================

/**
 * Create a new job
 */
export async function createJob(
    type: JobType,
    payload: Record<string, unknown>,
    options: {
        runAt?: Date;
        workspaceId?: string;
        maxRetries?: number;
    } = {}
): Promise<string> {
    const job = await prisma.job.create({
        data: {
            type,
            payload: JSON.stringify(payload),
            runAt: options.runAt || new Date(),
            workspaceId: options.workspaceId,
            maxRetries: options.maxRetries || 3,
        },
    });

    return job.id;
}

/**
 * Schedule a campaign tick job
 */
export async function scheduleCampaignTick(
    campaignId: string,
    workspaceId: string
): Promise<void> {
    // Check if there's already a pending tick for this campaign
    const existing = await prisma.job.findFirst({
        where: {
            type: 'CAMPAIGN_TICK',
            status: 'PENDING',
            payload: { contains: campaignId },
        },
    });

    if (!existing) {
        await createJob('CAMPAIGN_TICK', { campaignId }, { workspaceId });
    }
}

/**
 * Schedule reply generation
 */
export async function scheduleReplyGeneration(
    campaignLeadId: string,
    workspaceId: string,
    delayMs: number = 5000
): Promise<void> {
    await createJob(
        'GENERATE_REPLY',
        { campaignLeadId },
        {
            workspaceId,
            runAt: new Date(Date.now() + delayMs),
        }
    );
}

/**
 * Schedule stats rollup
 */
export async function scheduleStatsRollup(workspaceId: string): Promise<void> {
    const existing = await prisma.job.findFirst({
        where: {
            type: 'STATS_ROLLUP',
            status: 'PENDING',
            workspaceId,
        },
    });

    if (!existing) {
        await createJob('STATS_ROLLUP', { workspaceId }, { workspaceId });
    }
}

/**
 * Schedule warmup tick
 */
export async function scheduleWarmupTick(
    emailAccountId: string,
    workspaceId: string
): Promise<void> {
    await createJob('WARMUP_TICK', { emailAccountId }, { workspaceId });
}

// =============================================================================
// CLEANUP
// =============================================================================

/**
 * Clean up old completed/failed jobs
 */
export async function cleanupOldJobs(daysOld: number = 7): Promise<number> {
    const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const result = await prisma.job.deleteMany({
        where: {
            status: { in: ['DONE', 'FAILED'] },
            completedAt: { lt: cutoff },
        },
    });

    return result.count;
}

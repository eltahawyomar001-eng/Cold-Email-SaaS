import { prisma } from '@/lib/db';
import {
    DEFAULT_SIMULATION_RATES,
    EmailEventType,
    REPLY_CATEGORY_PROBABILITIES,
    ThreadCategory
} from '@/lib/constants';

// =============================================================================
// TYPES
// =============================================================================

interface SimulationConfig {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
    bounceRate: number;
    spamRate: number;
}

interface SendResult {
    events: Array<{
        type: EmailEventType;
        occurredAt: Date;
        metadata?: Record<string, unknown>;
    }>;
    shouldGenerateReply: boolean;
    replyCategory?: ThreadCategory;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Get simulation configuration from environment or defaults
 */
export function getSimulationConfig(): SimulationConfig {
    return {
        deliveryRate: parseFloat(process.env.SIMULATION_DELIVERY_RATE || String(DEFAULT_SIMULATION_RATES.deliveryRate)),
        openRate: parseFloat(process.env.SIMULATION_OPEN_RATE || String(DEFAULT_SIMULATION_RATES.openRate)),
        clickRate: parseFloat(process.env.SIMULATION_CLICK_RATE || String(DEFAULT_SIMULATION_RATES.clickRate)),
        replyRate: parseFloat(process.env.SIMULATION_REPLY_RATE || String(DEFAULT_SIMULATION_RATES.replyRate)),
        bounceRate: parseFloat(process.env.SIMULATION_BOUNCE_RATE || String(DEFAULT_SIMULATION_RATES.bounceRate)),
        spamRate: parseFloat(process.env.SIMULATION_SPAM_RATE || String(DEFAULT_SIMULATION_RATES.spamRate)),
    };
}

// =============================================================================
// RANDOM HELPERS
// =============================================================================

/**
 * Random chance check
 */
function chance(probability: number): boolean {
    return Math.random() < probability;
}

/**
 * Random delay in milliseconds
 */
function randomDelay(minMs: number, maxMs: number): number {
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Weighted random selection
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

// =============================================================================
// EMAIL SENDING SIMULATION
// =============================================================================

/**
 * Simulate sending an email and generating events
 */
export async function simulateEmailSend(
    campaignLeadId: string,
    stepNumber: number,
    emailAccountId: string
): Promise<SendResult> {
    const config = getSimulationConfig();
    const events: SendResult['events'] = [];
    const now = new Date();

    // Always create SENT event
    events.push({
        type: 'SENT',
        occurredAt: now,
    });

    // Check for bounce (happens immediately)
    if (chance(config.bounceRate)) {
        events.push({
            type: 'BOUNCED',
            occurredAt: new Date(now.getTime() + randomDelay(1000, 5000)),
            metadata: { reason: getRandomBounceReason() },
        });

        return { events, shouldGenerateReply: false };
    }

    // Check for spam complaint
    if (chance(config.spamRate)) {
        events.push({
            type: 'SPAM',
            occurredAt: new Date(now.getTime() + randomDelay(60000, 300000)),
            metadata: { reason: 'Marked as spam by recipient' },
        });

        return { events, shouldGenerateReply: false };
    }

    // Delivery (most emails get delivered)
    if (chance(config.deliveryRate)) {
        events.push({
            type: 'DELIVERED',
            occurredAt: new Date(now.getTime() + randomDelay(1000, 10000)),
        });

        // Open (some time after delivery)
        if (chance(config.openRate)) {
            const openTime = new Date(now.getTime() + randomDelay(60000, 86400000)); // 1 min to 24 hours
            events.push({
                type: 'OPENED',
                occurredAt: openTime,
            });

            // Click (if opened and has links)
            if (chance(config.clickRate)) {
                events.push({
                    type: 'CLICKED',
                    occurredAt: new Date(openTime.getTime() + randomDelay(5000, 60000)),
                    metadata: { link: 'https://example.com/link' },
                });
            }
        }

        // Reply (independent of open - some reply without us knowing they opened)
        if (chance(config.replyRate)) {
            const replyCategory = weightedRandom(REPLY_CATEGORY_PROBABILITIES);

            events.push({
                type: 'REPLIED',
                occurredAt: new Date(now.getTime() + randomDelay(300000, 172800000)), // 5 min to 48 hours
                metadata: { category: replyCategory },
            });

            return {
                events,
                shouldGenerateReply: true,
                replyCategory,
            };
        }
    }

    return { events, shouldGenerateReply: false };
}

/**
 * Save simulated events to database
 */
export async function saveEmailEvents(
    campaignLeadId: string,
    events: SendResult['events']
): Promise<void> {
    await prisma.emailEvent.createMany({
        data: events.map((event) => ({
            campaignLeadId,
            type: event.type,
            stepNumber: 1, // Will be updated by caller
            occurredAt: event.occurredAt,
            metadata: JSON.stringify(event.metadata || {}),
        })),
    });
}

// =============================================================================
// THROTTLING
// =============================================================================

/**
 * Check if email account can send (within limits)
 */
export async function canSendEmail(emailAccountId: string): Promise<{
    canSend: boolean;
    reason?: string;
}> {
    const account = await prisma.emailAccount.findUnique({
        where: { id: emailAccountId },
    });

    if (!account) {
        return { canSend: false, reason: 'Account not found' };
    }

    if (account.status !== 'CONNECTED') {
        return { canSend: false, reason: 'Account not connected' };
    }

    const now = new Date();

    // Check hourly limit
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    if (account.lastHourReset && account.lastHourReset < hourAgo) {
        // Reset hourly counter
        await prisma.emailAccount.update({
            where: { id: emailAccountId },
            data: { sentThisHour: 0, lastHourReset: now },
        });
    } else if (account.sentThisHour >= account.maxPerHour) {
        return { canSend: false, reason: 'Hourly limit reached' };
    }

    // Check daily limit
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (account.lastDayReset && account.lastDayReset < dayAgo) {
        // Reset daily counter
        await prisma.emailAccount.update({
            where: { id: emailAccountId },
            data: { sentToday: 0, lastDayReset: now },
        });
    } else if (account.sentToday >= account.maxPerDay) {
        return { canSend: false, reason: 'Daily limit reached' };
    }

    return { canSend: true };
}

/**
 * Increment send counters for email account
 */
export async function incrementSendCount(emailAccountId: string): Promise<void> {
    await prisma.emailAccount.update({
        where: { id: emailAccountId },
        data: {
            sentThisHour: { increment: 1 },
            sentToday: { increment: 1 },
            lastSentAt: new Date(),
        },
    });
}

// =============================================================================
// SCHEDULING
// =============================================================================

/**
 * Check if current time is within sending window
 */
export function isWithinSendingWindow(
    sendingDays: number[],
    startHour: number,
    endHour: number,
    timezone: string = 'UTC'
): boolean {
    const now = new Date();

    // Simple timezone handling - in production you'd use a proper library
    const utcHour = now.getUTCHours();
    const utcDay = now.getUTCDay();

    // For demo, just use UTC
    const currentDay = utcDay;
    const currentHour = utcHour;

    // Check if it's a sending day
    if (!sendingDays.includes(currentDay)) {
        return false;
    }

    // Check if within hours
    if (currentHour < startHour || currentHour >= endHour) {
        return false;
    }

    return true;
}

/**
 * Calculate next send time for a sequence step
 */
export function calculateNextStepTime(
    delayAmount: number,
    delayUnit: 'minutes' | 'hours' | 'days',
    fromTime: Date = new Date()
): Date {
    const multipliers = {
        minutes: 60 * 1000,
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
    };

    return new Date(fromTime.getTime() + delayAmount * multipliers[delayUnit]);
}

// =============================================================================
// HELPERS
// =============================================================================

function getRandomBounceReason(): string {
    const reasons = [
        'Mailbox not found',
        'Domain does not exist',
        'Mailbox full',
        'Temporary delivery failure',
        'Blocked by recipient server',
        'Invalid email address',
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
}

/**
 * Update email account health metrics based on events
 */
export async function updateAccountHealth(emailAccountId: string): Promise<void> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get recent events for campaigns using this account
    const campaigns = await prisma.campaign.findMany({
        where: { emailAccountId },
        select: { id: true },
    });

    if (campaigns.length === 0) return;

    const campaignIds = campaigns.map((c) => c.id);

    const events = await prisma.emailEvent.groupBy({
        by: ['type'],
        where: {
            campaignLead: {
                campaignId: { in: campaignIds },
            },
            occurredAt: { gte: thirtyDaysAgo },
        },
        _count: true,
    });

    const counts: Record<string, number> = {};
    events.forEach((e) => {
        counts[e.type] = e._count;
    });

    const sent = counts['SENT'] || 0;
    const bounced = counts['BOUNCED'] || 0;
    const spam = counts['SPAM'] || 0;

    if (sent === 0) return;

    const bounceRate = bounced / sent;
    const spamRate = spam / sent;

    // Health score: 100 base, -20 for every 1% bounce, -30 for every 1% spam
    let healthScore = 100 - Math.round(bounceRate * 2000) - Math.round(spamRate * 3000);
    healthScore = Math.max(0, Math.min(100, healthScore));

    await prisma.emailAccount.update({
        where: { id: emailAccountId },
        data: {
            bounceRate,
            spamRate,
            healthScore,
        },
    });
}

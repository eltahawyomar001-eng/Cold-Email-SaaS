import { prisma } from '@/lib/db';
import { DEFAULT_WARMUP_SCHEDULE } from '@/lib/constants';

/**
 * Process warmup tick for an email account
 */
export async function processWarmupTick(
    payload: Record<string, unknown>
): Promise<{ sent: number; newDailyLimit: number }> {
    const emailAccountId = payload.emailAccountId as string;

    // Get account and warmup settings
    const account = await prisma.emailAccount.findUnique({
        where: { id: emailAccountId },
        include: { warmupSettings: true },
    });

    if (!account || !account.warmupEnabled || !account.warmupSettings) {
        return { sent: 0, newDailyLimit: 0 };
    }

    const settings = account.warmupSettings;

    // Check if we need to reset daily count
    const now = new Date();
    const lastReset = new Date(settings.lastResetAt);
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
        // New day - increase daily limit and reset counter
        const newDailyTarget = Math.min(
            settings.dailyTarget + settings.rampIncrement,
            settings.maxDailyLimit
        );

        await prisma.warmupSettings.update({
            where: { id: settings.id },
            data: {
                currentDay: { increment: 1 },
                dailyTarget: newDailyTarget,
                sentToday: 0,
                lastResetAt: now,
            },
        });

        return { sent: 0, newDailyLimit: newDailyTarget };
    }

    // Check if we can send more warmup emails today
    if (settings.sentToday >= settings.dailyTarget) {
        return { sent: 0, newDailyLimit: settings.dailyTarget };
    }

    // Simulate sending warmup emails (1-3 at a time)
    const toSend = Math.min(
        Math.floor(Math.random() * 3) + 1,
        settings.dailyTarget - settings.sentToday
    );

    // Update warmup count
    await prisma.warmupSettings.update({
        where: { id: settings.id },
        data: {
            sentToday: { increment: toSend },
        },
    });

    // Also update main account counters
    await prisma.emailAccount.update({
        where: { id: emailAccountId },
        data: {
            sentToday: { increment: toSend },
            lastSentAt: now,
        },
    });

    return { sent: toSend, newDailyLimit: settings.dailyTarget };
}

/**
 * Get warmup statistics for an account
 */
export async function getWarmupStats(emailAccountId: string) {
    const settings = await prisma.warmupSettings.findUnique({
        where: { emailAccountId },
    });

    if (!settings) {
        return null;
    }

    return {
        enabled: settings.enabled,
        currentDay: settings.currentDay,
        dailyTarget: settings.dailyTarget,
        sentToday: settings.sentToday,
        rampIncrement: settings.rampIncrement,
        maxDailyLimit: settings.maxDailyLimit,
        progress: Math.round((settings.sentToday / settings.dailyTarget) * 100),
        daysUntilMax: Math.ceil(
            (settings.maxDailyLimit - settings.dailyTarget) / settings.rampIncrement
        ),
    };
}

/**
 * Update warmup settings for an account
 */
export async function updateWarmupSettings(
    emailAccountId: string,
    data: {
        enabled?: boolean;
        dailyTarget?: number;
        rampIncrement?: number;
        maxDailyLimit?: number;
    }
): Promise<void> {
    await prisma.warmupSettings.update({
        where: { emailAccountId },
        data,
    });

    // Also update main account warmup flag
    if (typeof data.enabled === 'boolean') {
        await prisma.emailAccount.update({
            where: { id: emailAccountId },
            data: { warmupEnabled: data.enabled },
        });
    }
}

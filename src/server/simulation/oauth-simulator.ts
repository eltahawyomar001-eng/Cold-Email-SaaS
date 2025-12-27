import { prisma } from '@/lib/db';
import { v4 as uuid } from 'uuid';

// =============================================================================
// GOOGLE OAUTH SIMULATION
// =============================================================================

/**
 * Simulate Google OAuth consent flow
 * In a real app, this would redirect to Google's OAuth consent screen
 */
export async function initiateGoogleOAuth(workspaceId: string): Promise<{
    authUrl: string;
    state: string;
}> {
    // Generate a state token for CSRF protection
    const state = uuid();

    // In demo, return a fake auth URL that points to our callback
    const authUrl = `/api/oauth/google/callback?state=${state}&code=fake_auth_code_${uuid()}`;

    return { authUrl, state };
}

/**
 * Complete OAuth flow and create email account
 */
export async function completeGoogleOAuth(
    workspaceId: string,
    code: string
): Promise<{
    emailAccountId: string;
    email: string;
}> {
    // Simulate token exchange
    const fakeTokens = generateFakeTokens();

    // Generate a realistic-looking Gmail address
    const email = generateFakeGmailAddress();

    // Create the email account
    const account = await prisma.emailAccount.create({
        data: {
            workspaceId,
            name: email.split('@')[0],
            email,
            provider: 'GMAIL',
            status: 'CONNECTED',
            accessToken: fakeTokens.accessToken,
            refreshToken: fakeTokens.refreshToken,
            tokenExpiresAt: fakeTokens.expiresAt,
            maxPerHour: 20,
            maxPerDay: 100,
            lastHourReset: new Date(),
            lastDayReset: new Date(),
        },
    });

    // Create warmup settings
    await prisma.warmupSettings.create({
        data: {
            emailAccountId: account.id,
            enabled: false,
            currentDay: 1,
            dailyTarget: 5,
            rampIncrement: 3,
            maxDailyLimit: 50,
        },
    });

    return {
        emailAccountId: account.id,
        email: account.email,
    };
}

/**
 * Simulate OAuth token refresh
 */
export async function refreshGoogleToken(emailAccountId: string): Promise<void> {
    const fakeTokens = generateFakeTokens();

    await prisma.emailAccount.update({
        where: { id: emailAccountId },
        data: {
            accessToken: fakeTokens.accessToken,
            tokenExpiresAt: fakeTokens.expiresAt,
        },
    });
}

/**
 * Disconnect Google account
 */
export async function disconnectGoogleAccount(emailAccountId: string): Promise<void> {
    await prisma.emailAccount.update({
        where: { id: emailAccountId },
        data: {
            status: 'DISCONNECTED',
            accessToken: null,
            refreshToken: null,
            tokenExpiresAt: null,
        },
    });
}

// =============================================================================
// OUTLOOK OAUTH SIMULATION (SIMILAR STRUCTURE)
// =============================================================================

export async function initiateOutlookOAuth(workspaceId: string): Promise<{
    authUrl: string;
    state: string;
}> {
    const state = uuid();
    const authUrl = `/api/oauth/outlook/callback?state=${state}&code=fake_auth_code_${uuid()}`;
    return { authUrl, state };
}

export async function completeOutlookOAuth(
    workspaceId: string,
    code: string
): Promise<{
    emailAccountId: string;
    email: string;
}> {
    const fakeTokens = generateFakeTokens();
    const email = generateFakeOutlookAddress();

    const account = await prisma.emailAccount.create({
        data: {
            workspaceId,
            name: email.split('@')[0],
            email,
            provider: 'OUTLOOK',
            status: 'CONNECTED',
            accessToken: fakeTokens.accessToken,
            refreshToken: fakeTokens.refreshToken,
            tokenExpiresAt: fakeTokens.expiresAt,
            maxPerHour: 20,
            maxPerDay: 100,
            lastHourReset: new Date(),
            lastDayReset: new Date(),
        },
    });

    await prisma.warmupSettings.create({
        data: {
            emailAccountId: account.id,
            enabled: false,
            currentDay: 1,
            dailyTarget: 5,
            rampIncrement: 3,
            maxDailyLimit: 50,
        },
    });

    return {
        emailAccountId: account.id,
        email: account.email,
    };
}

// =============================================================================
// SMTP ACCOUNT SIMULATION
// =============================================================================

/**
 * Simulate SMTP connection test
 */
export async function testSmtpConnection(config: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
}): Promise<{
    success: boolean;
    error?: string;
}> {
    // Simulate connection test with random success/failure
    // Most should succeed for demo purposes
    const success = Math.random() > 0.1;

    if (!success) {
        const errors = [
            'Connection refused',
            'Authentication failed',
            'Host not found',
            'Timeout connecting to server',
        ];
        return {
            success: false,
            error: errors[Math.floor(Math.random() * errors.length)],
        };
    }

    return { success: true };
}

/**
 * Create SMTP email account
 */
export async function createSmtpAccount(
    workspaceId: string,
    config: {
        name: string;
        email: string;
        smtpHost: string;
        smtpPort: number;
        smtpUser: string;
        smtpPass: string;
        imapHost?: string;
        imapPort?: number;
    }
): Promise<{ emailAccountId: string }> {
    const account = await prisma.emailAccount.create({
        data: {
            workspaceId,
            name: config.name,
            email: config.email,
            provider: 'SMTP',
            status: 'CONNECTED',
            smtpHost: config.smtpHost,
            smtpPort: config.smtpPort,
            smtpUser: config.smtpUser,
            smtpPass: config.smtpPass,
            imapHost: config.imapHost,
            imapPort: config.imapPort,
            maxPerHour: 20,
            maxPerDay: 100,
            lastHourReset: new Date(),
            lastDayReset: new Date(),
        },
    });

    await prisma.warmupSettings.create({
        data: {
            emailAccountId: account.id,
            enabled: false,
            currentDay: 1,
            dailyTarget: 5,
            rampIncrement: 3,
            maxDailyLimit: 50,
        },
    });

    return { emailAccountId: account.id };
}

// =============================================================================
// HELPERS
// =============================================================================

function generateFakeTokens() {
    return {
        accessToken: `ya29.${uuid().replace(/-/g, '')}`,
        refreshToken: `1//${uuid().replace(/-/g, '')}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    };
}

function generateFakeGmailAddress(): string {
    const names = ['john.doe', 'jane.smith', 'sales', 'marketing', 'outreach', 'hello'];
    const domains = ['gmail.com'];
    const name = names[Math.floor(Math.random() * names.length)];
    const suffix = Math.floor(Math.random() * 1000);
    return `${name}${suffix}@${domains[0]}`;
}

function generateFakeOutlookAddress(): string {
    const names = ['john.doe', 'jane.smith', 'sales', 'marketing', 'outreach'];
    const domains = ['outlook.com', 'hotmail.com'];
    const name = names[Math.floor(Math.random() * names.length)];
    const suffix = Math.floor(Math.random() * 1000);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name}${suffix}@${domain}`;
}

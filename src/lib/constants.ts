// =============================================================================
// PLAN DEFINITIONS
// =============================================================================

export type PlanType = 'FREE' | 'STARTER' | 'PRO';

export interface PlanLimits {
    workspaces: number;
    emailAccounts: number;
    campaigns: number;
    leadsPerWorkspace: number;
    teamMembers: number;
    features: {
        warmup: boolean;
        analytics: boolean;
        csvExport: boolean;
        apiAccess: boolean;
        customDomains: boolean;
        prioritySupport: boolean;
    };
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    FREE: {
        workspaces: 1,
        emailAccounts: 1,
        campaigns: 1,
        leadsPerWorkspace: 100,
        teamMembers: 1,
        features: {
            warmup: false,
            analytics: false,
            csvExport: false,
            apiAccess: false,
            customDomains: false,
            prioritySupport: false,
        },
    },
    STARTER: {
        workspaces: 3,
        emailAccounts: 3,
        campaigns: 3,
        leadsPerWorkspace: 1000,
        teamMembers: 3,
        features: {
            warmup: true,
            analytics: true,
            csvExport: true,
            apiAccess: false,
            customDomains: false,
            prioritySupport: false,
        },
    },
    PRO: {
        workspaces: -1, // unlimited
        emailAccounts: -1,
        campaigns: -1,
        leadsPerWorkspace: -1,
        teamMembers: -1,
        features: {
            warmup: true,
            analytics: true,
            csvExport: true,
            apiAccess: true,
            customDomains: true,
            prioritySupport: true,
        },
    },
};

export const PLAN_PRICES: Record<PlanType, { monthly: number; yearly: number }> = {
    FREE: { monthly: 0, yearly: 0 },
    STARTER: { monthly: 29, yearly: 290 },
    PRO: { monthly: 79, yearly: 790 },
};

// =============================================================================
// ROLES & PERMISSIONS
// =============================================================================

export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';

export const ROLE_HIERARCHY: Record<Role, number> = {
    OWNER: 3,
    ADMIN: 2,
    MEMBER: 1,
};

export type Permission =
    | 'workspace:read'
    | 'workspace:update'
    | 'workspace:delete'
    | 'team:read'
    | 'team:invite'
    | 'team:remove'
    | 'team:update_role'
    | 'leads:read'
    | 'leads:create'
    | 'leads:update'
    | 'leads:delete'
    | 'leads:import'
    | 'leads:export'
    | 'accounts:read'
    | 'accounts:create'
    | 'accounts:update'
    | 'accounts:delete'
    | 'campaigns:read'
    | 'campaigns:create'
    | 'campaigns:update'
    | 'campaigns:delete'
    | 'campaigns:start'
    | 'campaigns:pause'
    | 'inbox:read'
    | 'inbox:reply'
    | 'inbox:update_status'
    | 'stats:read'
    | 'stats:export'
    | 'warmup:read'
    | 'warmup:update'
    | 'billing:read'
    | 'billing:update'
    | 'integrations:read'
    | 'integrations:manage';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    OWNER: [
        'workspace:read',
        'workspace:update',
        'workspace:delete',
        'team:read',
        'team:invite',
        'team:remove',
        'team:update_role',
        'leads:read',
        'leads:create',
        'leads:update',
        'leads:delete',
        'leads:import',
        'leads:export',
        'accounts:read',
        'accounts:create',
        'accounts:update',
        'accounts:delete',
        'campaigns:read',
        'campaigns:create',
        'campaigns:update',
        'campaigns:delete',
        'campaigns:start',
        'campaigns:pause',
        'inbox:read',
        'inbox:reply',
        'inbox:update_status',
        'stats:read',
        'stats:export',
        'warmup:read',
        'warmup:update',
        'billing:read',
        'billing:update',
        'integrations:read',
        'integrations:manage',
    ],
    ADMIN: [
        'workspace:read',
        'workspace:update',
        'team:read',
        'team:invite',
        'leads:read',
        'leads:create',
        'leads:update',
        'leads:delete',
        'leads:import',
        'leads:export',
        'accounts:read',
        'accounts:create',
        'accounts:update',
        'accounts:delete',
        'campaigns:read',
        'campaigns:create',
        'campaigns:update',
        'campaigns:delete',
        'campaigns:start',
        'campaigns:pause',
        'inbox:read',
        'inbox:reply',
        'inbox:update_status',
        'stats:read',
        'stats:export',
        'warmup:read',
        'warmup:update',
        'integrations:read',
        'integrations:manage',
    ],
    MEMBER: [
        'workspace:read',
        'team:read',
        'leads:read',
        'accounts:read',
        'campaigns:read',
        'inbox:read',
        'stats:read',
        'warmup:read',
    ],
};

// =============================================================================
// EMAIL EVENT TYPES
// =============================================================================

export type EmailEventType =
    | 'SENT'
    | 'DELIVERED'
    | 'OPENED'
    | 'CLICKED'
    | 'REPLIED'
    | 'BOUNCED'
    | 'SPAM'
    | 'UNSUBSCRIBED';

export const EMAIL_EVENT_COLORS: Record<EmailEventType, string> = {
    SENT: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-green-100 text-green-800',
    OPENED: 'bg-purple-100 text-purple-800',
    CLICKED: 'bg-indigo-100 text-indigo-800',
    REPLIED: 'bg-emerald-100 text-emerald-800',
    BOUNCED: 'bg-red-100 text-red-800',
    SPAM: 'bg-orange-100 text-orange-800',
    UNSUBSCRIBED: 'bg-gray-100 text-gray-800',
};

// =============================================================================
// THREAD CATEGORIES
// =============================================================================

export type ThreadCategory =
    | 'INTERESTED'
    | 'NOT_INTERESTED'
    | 'OOO'
    | 'BOUNCE'
    | 'SPAM'
    | 'NEUTRAL';

export const THREAD_CATEGORY_LABELS: Record<ThreadCategory, string> = {
    INTERESTED: 'Interested',
    NOT_INTERESTED: 'Not Interested',
    OOO: 'Out of Office',
    BOUNCE: 'Bounce',
    SPAM: 'Spam/Complaint',
    NEUTRAL: 'Neutral',
};

export const THREAD_CATEGORY_COLORS: Record<ThreadCategory, string> = {
    INTERESTED: 'bg-green-100 text-green-800 border-green-200',
    NOT_INTERESTED: 'bg-red-100 text-red-800 border-red-200',
    OOO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    BOUNCE: 'bg-gray-100 text-gray-800 border-gray-200',
    SPAM: 'bg-orange-100 text-orange-800 border-orange-200',
    NEUTRAL: 'bg-blue-100 text-blue-800 border-blue-200',
};

// =============================================================================
// JOB TYPES
// =============================================================================

export type JobType =
    | 'CAMPAIGN_TICK'
    | 'SEND_EMAIL_STEP'
    | 'GENERATE_REPLY'
    | 'WARMUP_TICK'
    | 'STATS_ROLLUP'
    | 'INBOX_SYNC';

export const JOB_INTERVALS: Record<JobType, number> = {
    CAMPAIGN_TICK: 10000, // 10 seconds
    SEND_EMAIL_STEP: 0, // immediate
    GENERATE_REPLY: 5000, // 5 seconds delay
    WARMUP_TICK: 60000, // 1 minute
    STATS_ROLLUP: 30000, // 30 seconds
    INBOX_SYNC: 15000, // 15 seconds
};

// =============================================================================
// SIMULATION SETTINGS
// =============================================================================

export const DEFAULT_SIMULATION_RATES = {
    deliveryRate: 0.95,
    openRate: 0.4,
    clickRate: 0.15,
    replyRate: 0.05,
    bounceRate: 0.03,
    spamRate: 0.02,
};

export const REPLY_CATEGORY_PROBABILITIES: Record<ThreadCategory, number> = {
    INTERESTED: 0.2,
    NOT_INTERESTED: 0.35,
    OOO: 0.15,
    NEUTRAL: 0.25,
    BOUNCE: 0.03,
    SPAM: 0.02,
};

// =============================================================================
// WARMUP SETTINGS
// =============================================================================

export const DEFAULT_WARMUP_SCHEDULE = {
    startingDailyLimit: 5,
    dailyIncrement: 3,
    maxDailyLimit: 50,
};

// =============================================================================
// UI CONSTANTS
// =============================================================================

export const ITEMS_PER_PAGE = 25;

export const DATE_FORMATS = {
    display: 'MMM d, yyyy',
    displayWithTime: 'MMM d, yyyy h:mm a',
    input: 'yyyy-MM-dd',
    iso: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
};

export const TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Australia/Sydney',
];

export const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
];

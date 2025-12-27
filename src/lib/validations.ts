import { z } from 'zod';

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// =============================================================================
// WORKSPACE SCHEMAS
// =============================================================================

export const createWorkspaceSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

export const updateWorkspaceSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    avatarUrl: z.string().url().optional().nullable(),
});

export const inviteMemberSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['ADMIN', 'MEMBER']),
});

export const updateMemberRoleSchema = z.object({
    memberId: z.string(),
    role: z.enum(['ADMIN', 'MEMBER']),
});

// =============================================================================
// LEAD SCHEMAS
// =============================================================================

export const createLeadSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    customFields: z.record(z.string()).optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const importLeadsSchema = z.object({
    leads: z.array(createLeadSchema),
    skipDuplicates: z.boolean().default(true),
});

// =============================================================================
// EMAIL ACCOUNT SCHEMAS
// =============================================================================

export const createEmailAccountSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    provider: z.enum(['SMTP', 'GMAIL', 'OUTLOOK']),
    smtpHost: z.string().optional(),
    smtpPort: z.number().optional(),
    smtpUser: z.string().optional(),
    smtpPass: z.string().optional(),
    imapHost: z.string().optional(),
    imapPort: z.number().optional(),
});

export const updateEmailAccountSchema = z.object({
    name: z.string().min(2).optional(),
    maxPerHour: z.number().min(1).max(100).optional(),
    maxPerDay: z.number().min(1).max(500).optional(),
    warmupEnabled: z.boolean().optional(),
});

// =============================================================================
// CAMPAIGN SCHEMAS
// =============================================================================

export const createCampaignSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    emailAccountId: z.string().optional(),
    timezone: z.string().default('UTC'),
    sendingDays: z.array(z.number().min(0).max(6)).default([1, 2, 3, 4, 5]),
    sendingStartHour: z.number().min(0).max(23).default(9),
    sendingEndHour: z.number().min(0).max(23).default(17),
    stopOnReply: z.boolean().default(true),
    stopOnBounce: z.boolean().default(true),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const createSequenceStepSchema = z.object({
    order: z.number().min(1),
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Body is required'),
    delayAmount: z.number().min(0).default(0),
    delayUnit: z.enum(['minutes', 'hours', 'days']).default('days'),
    waitForOpen: z.boolean().default(false),
});

export const addLeadsToCampaignSchema = z.object({
    leadIds: z.array(z.string()).min(1, 'Select at least one lead'),
});

// =============================================================================
// INBOX SCHEMAS
// =============================================================================

export const updateThreadSchema = z.object({
    status: z.enum(['OPEN', 'REPLIED', 'CLOSED']).optional(),
    category: z.enum(['INTERESTED', 'NOT_INTERESTED', 'OOO', 'BOUNCE', 'SPAM', 'NEUTRAL']).optional(),
    isRead: z.boolean().optional(),
});

export const sendReplySchema = z.object({
    threadId: z.string(),
    body: z.string().min(1, 'Reply cannot be empty'),
});

// =============================================================================
// BILLING SCHEMAS
// =============================================================================

export const updateSubscriptionSchema = z.object({
    plan: z.enum(['FREE', 'STARTER', 'PRO']),
});

// =============================================================================
// WARMUP SCHEMAS
// =============================================================================

export const updateWarmupSettingsSchema = z.object({
    enabled: z.boolean().optional(),
    dailyTarget: z.number().min(1).max(100).optional(),
    rampIncrement: z.number().min(1).max(10).optional(),
    maxDailyLimit: z.number().min(10).max(100).optional(),
});

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateEmailAccountInput = z.infer<typeof createEmailAccountSchema>;
export type UpdateEmailAccountInput = z.infer<typeof updateEmailAccountSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CreateSequenceStepInput = z.infer<typeof createSequenceStepSchema>;
export type UpdateThreadInput = z.infer<typeof updateThreadSchema>;
export type SendReplyInput = z.infer<typeof sendReplySchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

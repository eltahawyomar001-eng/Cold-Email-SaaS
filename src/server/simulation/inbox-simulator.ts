import { prisma } from '@/lib/db';
import { ThreadCategory, THREAD_CATEGORY_LABELS } from '@/lib/constants';

// =============================================================================
// REPLY TEMPLATES
// =============================================================================

const REPLY_TEMPLATES: Record<ThreadCategory, string[]> = {
    INTERESTED: [
        "Hi {{senderName}},\n\nThank you for reaching out! This sounds interesting. I'd love to learn more about what you're offering.\n\nCould we schedule a quick call this week?\n\nBest,\n{{recipientName}}",
        "Hello,\n\nI've been looking for a solution like this. Let's set up a meeting to discuss further.\n\nWhat times work for you?\n\nRegards,\n{{recipientName}}",
        "Hi there,\n\nYour email caught my attention. I'm definitely interested in exploring this.\n\nPlease send me more information about pricing and features.\n\nThanks,\n{{recipientName}}",
        "Hi {{senderName}},\n\nThis is great timing! We've actually been evaluating options in this space.\n\nLet's connect - I'll have my assistant reach out to schedule.\n\nBest,\n{{recipientName}}",
    ],
    NOT_INTERESTED: [
        "Hi,\n\nThanks for thinking of us, but we're not interested at this time.\n\nPlease remove me from your list.\n\nBest,\n{{recipientName}}",
        "Hello,\n\nWe're all set in this area and not looking to make any changes.\n\nThanks anyway.\n\nRegards,\n{{recipientName}}",
        "Hi there,\n\nI appreciate you reaching out, but this isn't a fit for us right now.\n\nGood luck with your outreach!\n\n{{recipientName}}",
        "Thanks, but we're not in the market for this. Please don't follow up.\n\n{{recipientName}}",
    ],
    OOO: [
        "I am currently out of the office and will return on {{returnDate}}.\n\nFor urgent matters, please contact {{alternateContact}}.\n\nI will respond to your email upon my return.\n\nThank you,\n{{recipientName}}",
        "Thank you for your email. I am out of the office with limited access to email until {{returnDate}}.\n\nI will get back to you as soon as possible.\n\nBest regards,\n{{recipientName}}",
        "I'm currently on PTO and will be back on {{returnDate}}. I'll respond to your message when I return.\n\nThanks for your patience!",
    ],
    NEUTRAL: [
        "Hi,\n\nCould you tell me more about how this works? I'm not sure I understand the value proposition.\n\nThanks,\n{{recipientName}}",
        "Hello,\n\nWho else in your company uses this? Any case studies you can share?\n\nRegards,\n{{recipientName}}",
        "Thanks for reaching out. What makes your solution different from others?\n\n{{recipientName}}",
        "Hi,\n\nI need to check with my team on this. Can you send more details I can forward to them?\n\nThanks,\n{{recipientName}}",
    ],
    BOUNCE: [
        "Mail delivery failed: returning message to sender.\n\nThis message was created automatically by mail delivery software.\n\nA message that you sent could not be delivered to one or more of its recipients.",
        "Delivery Status Notification (Failure)\n\nYour message to {{recipientEmail}} couldn't be delivered.\n\nThe email account that you tried to reach does not exist.",
    ],
    SPAM: [
        "This sender has been reported as spam.",
        "Your message was marked as spam by the recipient.",
    ],
};

// =============================================================================
// REPLY GENERATION
// =============================================================================

/**
 * Generate a simulated reply based on category
 */
export function generateReplyContent(
    category: ThreadCategory,
    recipientName: string,
    senderName: string,
    recipientEmail: string
): { subject: string; body: string } {
    const templates = REPLY_TEMPLATES[category];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Generate return date for OOO (1-2 weeks from now)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + Math.floor(Math.random() * 14) + 1);
    const returnDateStr = returnDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });

    const body = template
        .replace(/{{recipientName}}/g, recipientName || 'There')
        .replace(/{{senderName}}/g, senderName || 'there')
        .replace(/{{recipientEmail}}/g, recipientEmail)
        .replace(/{{returnDate}}/g, returnDateStr)
        .replace(/{{alternateContact}}/g, 'support@company.com');

    // Generate appropriate subject
    let subject: string;
    switch (category) {
        case 'INTERESTED':
            subject = 'Re: Your email - Let\'s connect';
            break;
        case 'NOT_INTERESTED':
            subject = 'Re: Your email - Not interested';
            break;
        case 'OOO':
            subject = 'Out of Office Re: Your email';
            break;
        case 'BOUNCE':
            subject = 'Delivery Status Notification (Failure)';
            break;
        case 'SPAM':
            subject = 'Spam Notification';
            break;
        default:
            subject = 'Re: Your email';
    }

    return { subject, body };
}

/**
 * Create a simulated reply thread/message
 */
export async function createSimulatedReply(
    workspaceId: string,
    emailAccountId: string,
    campaignId: string,
    campaignName: string,
    leadEmail: string,
    leadName: string | null,
    senderEmail: string,
    senderName: string | null,
    originalSubject: string,
    category: ThreadCategory
): Promise<void> {
    // Generate reply content
    const { subject, body } = generateReplyContent(
        category,
        leadName || 'Team',
        senderName || 'there',
        leadEmail
    );

    // Check if thread exists for this lead + account combination
    let thread = await prisma.thread.findFirst({
        where: {
            workspaceId,
            emailAccountId,
            leadEmail,
        },
    });

    if (thread) {
        // Update existing thread
        await prisma.thread.update({
            where: { id: thread.id },
            data: {
                category,
                status: 'OPEN',
                isRead: false,
                lastMessageAt: new Date(),
            },
        });
    } else {
        // Create new thread
        thread = await prisma.thread.create({
            data: {
                workspaceId,
                emailAccountId,
                subject: subject || `Re: ${originalSubject}`,
                status: 'OPEN',
                category,
                isRead: false,
                leadEmail,
                leadName,
                campaignId,
                campaignName,
                lastMessageAt: new Date(),
            },
        });
    }

    // Create inbound message
    await prisma.message.create({
        data: {
            threadId: thread.id,
            direction: 'INBOUND',
            fromEmail: leadEmail,
            fromName: leadName,
            toEmail: senderEmail,
            toName: senderName,
            subject: subject || `Re: ${originalSubject}`,
            body,
            isRead: false,
            sentAt: new Date(),
        },
    });
}

// =============================================================================
// INBOX HELPERS
// =============================================================================

/**
 * Get threads with messages for inbox view
 */
export async function getInboxThreads(
    workspaceId: string,
    options: {
        category?: ThreadCategory;
        status?: 'OPEN' | 'REPLIED' | 'CLOSED';
        emailAccountId?: string;
        isRead?: boolean;
        limit?: number;
        offset?: number;
    } = {}
) {
    const { category, status, emailAccountId, isRead, limit = 50, offset = 0 } = options;

    const where: Record<string, unknown> = { workspaceId };

    if (category) where.category = category;
    if (status) where.status = status;
    if (emailAccountId) where.emailAccountId = emailAccountId;
    if (typeof isRead === 'boolean') where.isRead = isRead;

    const threads = await prisma.thread.findMany({
        where,
        include: {
            messages: {
                orderBy: { sentAt: 'desc' },
                take: 1,
            },
            emailAccount: {
                select: { email: true, name: true },
            },
        },
        orderBy: { lastMessageAt: 'desc' },
        take: limit,
        skip: offset,
    });

    const total = await prisma.thread.count({ where });

    return { threads, total };
}

/**
 * Get thread with all messages
 */
export async function getThreadWithMessages(threadId: string) {
    return prisma.thread.findUnique({
        where: { id: threadId },
        include: {
            messages: {
                orderBy: { sentAt: 'asc' },
            },
            emailAccount: {
                select: { id: true, email: true, name: true },
            },
        },
    });
}

/**
 * Send a reply in a thread
 */
export async function sendReplyInThread(
    threadId: string,
    body: string,
    fromEmail: string,
    fromName: string | null
): Promise<void> {
    const thread = await prisma.thread.findUnique({
        where: { id: threadId },
    });

    if (!thread) {
        throw new Error('Thread not found');
    }

    // Create outbound message
    await prisma.message.create({
        data: {
            threadId,
            direction: 'OUTBOUND',
            fromEmail,
            fromName,
            toEmail: thread.leadEmail,
            toName: thread.leadName,
            subject: `Re: ${thread.subject}`,
            body,
            isRead: true,
            sentAt: new Date(),
        },
    });

    // Update thread status
    await prisma.thread.update({
        where: { id: threadId },
        data: {
            status: 'REPLIED',
            lastMessageAt: new Date(),
        },
    });
}

/**
 * Update thread category/status
 */
export async function updateThread(
    threadId: string,
    data: {
        category?: ThreadCategory;
        status?: 'OPEN' | 'REPLIED' | 'CLOSED';
        isRead?: boolean;
    }
): Promise<void> {
    await prisma.thread.update({
        where: { id: threadId },
        data,
    });
}

/**
 * Get inbox stats by category
 */
export async function getInboxStats(workspaceId: string) {
    const stats = await prisma.thread.groupBy({
        by: ['category'],
        where: { workspaceId },
        _count: true,
    });

    const unreadCount = await prisma.thread.count({
        where: { workspaceId, isRead: false },
    });

    const result: Record<string, number> = {
        total: 0,
        unread: unreadCount,
    };

    stats.forEach((s) => {
        result[s.category.toLowerCase()] = s._count;
        result.total += s._count;
    });

    return result;
}

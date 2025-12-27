import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const { hash } = bcrypt;

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Clean existing data
    console.log('Cleaning existing data...');
    await prisma.message.deleteMany();
    await prisma.thread.deleteMany();
    await prisma.emailEvent.deleteMany();
    await prisma.campaignLead.deleteMany();
    await prisma.sequenceStep.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.warmupSettings.deleteMany();
    await prisma.emailAccount.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.invite.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.job.deleteMany();
    await prisma.integration.deleteMany();
    await prisma.exportedSheet.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('Creating users...');
    const passwordHash = await hash('password123', 12);

    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@example.com',
            name: 'Demo User',
            passwordHash,
        },
    });

    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            name: 'Admin User',
            passwordHash,
        },
    });

    const memberUser = await prisma.user.create({
        data: {
            email: 'member@example.com',
            name: 'Team Member',
            passwordHash,
        },
    });

    // Create subscriptions
    console.log('Creating subscriptions...');
    await prisma.subscription.create({
        data: {
            userId: demoUser.id,
            plan: 'STARTER',
            status: 'ACTIVE',
            stripeCustomerId: `cus_${uuid().slice(0, 14)}`,
        },
    });

    await prisma.subscription.create({
        data: {
            userId: adminUser.id,
            plan: 'FREE',
            status: 'ACTIVE',
        },
    });

    await prisma.subscription.create({
        data: {
            userId: memberUser.id,
            plan: 'FREE',
            status: 'ACTIVE',
        },
    });

    // Create workspace
    console.log('Creating workspace...');
    const workspace = await prisma.workspace.create({
        data: {
            name: 'Demo Workspace',
            slug: 'demo-workspace',
        },
    });

    // Add members
    await prisma.workspaceMember.create({
        data: {
            userId: demoUser.id,
            workspaceId: workspace.id,
            role: 'OWNER',
        },
    });

    await prisma.workspaceMember.create({
        data: {
            userId: adminUser.id,
            workspaceId: workspace.id,
            role: 'ADMIN',
        },
    });

    await prisma.workspaceMember.create({
        data: {
            userId: memberUser.id,
            workspaceId: workspace.id,
            role: 'MEMBER',
        },
    });

    // Create email accounts
    console.log('Creating email accounts...');
    const gmailAccount = await prisma.emailAccount.create({
        data: {
            workspaceId: workspace.id,
            name: 'Sales Gmail',
            email: 'sales@demo-company.com',
            provider: 'GMAIL',
            status: 'CONNECTED',
            accessToken: `ya29.${uuid().replace(/-/g, '')}`,
            refreshToken: `1//${uuid().replace(/-/g, '')}`,
            maxPerHour: 25,
            maxPerDay: 150,
            sentToday: 45,
            sentThisHour: 8,
            warmupEnabled: true,
            healthScore: 92,
            bounceRate: 0.02,
            spamRate: 0.01,
        },
    });

    await prisma.warmupSettings.create({
        data: {
            emailAccountId: gmailAccount.id,
            enabled: true,
            currentDay: 12,
            dailyTarget: 35,
            rampIncrement: 3,
            maxDailyLimit: 50,
            sentToday: 28,
        },
    });

    const smtpAccount = await prisma.emailAccount.create({
        data: {
            workspaceId: workspace.id,
            name: 'Outreach SMTP',
            email: 'outreach@demo-company.com',
            provider: 'SMTP',
            status: 'CONNECTED',
            smtpHost: 'smtp.demo-company.com',
            smtpPort: 587,
            smtpUser: 'outreach@demo-company.com',
            smtpPass: 'demo-password',
            maxPerHour: 20,
            maxPerDay: 100,
            sentToday: 23,
            sentThisHour: 5,
            warmupEnabled: false,
            healthScore: 88,
            bounceRate: 0.03,
            spamRate: 0.02,
        },
    });

    await prisma.warmupSettings.create({
        data: {
            emailAccountId: smtpAccount.id,
            enabled: false,
            currentDay: 1,
            dailyTarget: 5,
            rampIncrement: 3,
            maxDailyLimit: 50,
            sentToday: 0,
        },
    });

    // Create leads
    console.log('Creating leads...');
    const leadData = [
        { firstName: 'John', lastName: 'Smith', company: 'Acme Corp', title: 'CEO' },
        { firstName: 'Sarah', lastName: 'Johnson', company: 'TechStart Inc', title: 'VP Sales' },
        { firstName: 'Michael', lastName: 'Brown', company: 'GlobalTech', title: 'Director' },
        { firstName: 'Emily', lastName: 'Davis', company: 'StartupXYZ', title: 'Founder' },
        { firstName: 'David', lastName: 'Wilson', company: 'BigCorp', title: 'CTO' },
        { firstName: 'Jennifer', lastName: 'Taylor', company: 'SmallBiz LLC', title: 'Owner' },
        { firstName: 'Robert', lastName: 'Anderson', company: 'Enterprise Co', title: 'VP Engineering' },
        { firstName: 'Lisa', lastName: 'Thomas', company: 'Innovate Labs', title: 'Product Manager' },
        { firstName: 'James', lastName: 'Jackson', company: 'Future Systems', title: 'Sales Director' },
        { firstName: 'Patricia', lastName: 'White', company: 'Tech Solutions', title: 'Marketing Head' },
        { firstName: 'Christopher', lastName: 'Harris', company: 'Digital Dynamics', title: 'CIO' },
        { firstName: 'Amanda', lastName: 'Martin', company: 'Cloud Nine', title: 'VP Marketing' },
        { firstName: 'Daniel', lastName: 'Garcia', company: 'Data Driven', title: 'CEO' },
        { firstName: 'Michelle', lastName: 'Martinez', company: 'AI Innovations', title: 'Founder' },
        { firstName: 'Kevin', lastName: 'Robinson', company: 'Scale Up Inc', title: 'COO' },
        { firstName: 'Laura', lastName: 'Clark', company: 'Growth Labs', title: 'Head of Growth' },
        { firstName: 'Brian', lastName: 'Rodriguez', company: 'Apex Systems', title: 'VP Sales' },
        { firstName: 'Nicole', lastName: 'Lewis', company: 'Prime Tech', title: 'Director' },
        { firstName: 'Steven', lastName: 'Lee', company: 'Core Solutions', title: 'CTO' },
        { firstName: 'Amy', lastName: 'Walker', company: 'NextGen Corp', title: 'VP Product' },
        { firstName: 'Mark', lastName: 'Hall', company: 'Smart Systems', title: 'Sales Manager' },
        { firstName: 'Rebecca', lastName: 'Allen', company: 'Peak Performance', title: 'CEO' },
        { firstName: 'Paul', lastName: 'Young', company: 'Velocity Inc', title: 'Founder' },
        { firstName: 'Stephanie', lastName: 'King', company: 'Momentum Labs', title: 'VP Engineering' },
        { firstName: 'Andrew', lastName: 'Wright', company: 'Rapid Growth', title: 'Director' },
        { firstName: 'Melissa', lastName: 'Scott', company: 'Insight Analytics', title: 'Head of Data' },
        { firstName: 'Timothy', lastName: 'Green', company: 'Transform Tech', title: 'CIO' },
        { firstName: 'Elizabeth', lastName: 'Adams', company: 'Elevate Corp', title: 'VP Sales' },
        { firstName: 'Jason', lastName: 'Baker', company: 'Synergy Systems', title: 'CEO' },
        { firstName: 'Rachel', lastName: 'Nelson', company: 'Fusion Labs', title: 'Founder' },
    ];

    const leads = await Promise.all(
        leadData.map((data, index) =>
            prisma.lead.create({
                data: {
                    workspaceId: workspace.id,
                    email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@${data.company.toLowerCase().replace(/\s+/g, '')}.com`,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    company: data.company,
                    title: data.title,
                    tags: JSON.stringify(['prospect', index % 2 === 0 ? 'high-value' : 'mid-market']),
                    status: 'ACTIVE',
                },
            })
        )
    );

    // Create campaign
    console.log('Creating campaigns...');
    const campaign = await prisma.campaign.create({
        data: {
            workspaceId: workspace.id,
            emailAccountId: gmailAccount.id,
            name: 'Q4 Sales Outreach',
            status: 'ACTIVE',
            timezone: 'America/New_York',
            sendingDays: JSON.stringify([1, 2, 3, 4, 5]),
            sendingStartHour: 9,
            sendingEndHour: 17,
            stopOnReply: true,
            stopOnBounce: true,
            totalLeads: 30,
            sentCount: 45,
            deliveredCount: 43,
            openedCount: 18,
            clickedCount: 5,
            repliedCount: 8,
            bouncedCount: 2,
            startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
    });

    // Create sequence steps
    await prisma.sequenceStep.create({
        data: {
            campaignId: campaign.id,
            order: 1,
            subject: 'Quick question about {{company}}',
            body: `Hi {{firstName}},

I noticed {{company}} has been growing rapidly in the {{industry}} space. We've helped similar companies increase their sales pipeline by 40% through targeted cold outreach.

Would you be open to a quick 15-minute call to explore if this could work for you?

Best,
Demo User`,
            delayAmount: 0,
            delayUnit: 'days',
        },
    });

    await prisma.sequenceStep.create({
        data: {
            campaignId: campaign.id,
            order: 2,
            subject: 'Re: Quick question about {{company}}',
            body: `Hi {{firstName}},

Just following up on my previous email. I understand you're busy, so I'll keep this brief.

Our platform has helped companies like yours:
• Increase reply rates by 3x
• Automate follow-up sequences
• Track engagement in real-time

Would Tuesday or Wednesday work for a quick chat?

Best,
Demo User`,
            delayAmount: 2,
            delayUnit: 'days',
        },
    });

    await prisma.sequenceStep.create({
        data: {
            campaignId: campaign.id,
            order: 3,
            subject: 'Last try - {{company}}',
            body: `Hi {{firstName}},

I don't want to be a pest, so this will be my last email.

If scaling your outreach isn't a priority right now, I completely understand. But if you'd ever like to learn how we've helped 500+ companies grow their pipeline, I'm just a reply away.

Wishing you and the team at {{company}} continued success!

Best,
Demo User`,
            delayAmount: 3,
            delayUnit: 'days',
        },
    });

    // Add leads to campaign
    const campaignLeadStatuses = ['COMPLETED', 'ACTIVE', 'REPLIED', 'BOUNCED', 'PENDING'];
    for (let i = 0; i < leads.length; i++) {
        const status = campaignLeadStatuses[i % campaignLeadStatuses.length];
        await prisma.campaignLead.create({
            data: {
                campaignId: campaign.id,
                leadId: leads[i].id,
                status,
                currentStep: status === 'PENDING' ? 0 : Math.floor(Math.random() * 3) + 1,
                lastStepAt: status !== 'PENDING' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
            },
        });
    }

    // Create some email events
    console.log('Creating email events...');
    const campaignLeads = await prisma.campaignLead.findMany({
        where: { campaignId: campaign.id },
    });

    for (const cl of campaignLeads.slice(0, 15)) {
        await prisma.emailEvent.createMany({
            data: [
                { campaignLeadId: cl.id, type: 'SENT', stepNumber: 1, occurredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
                { campaignLeadId: cl.id, type: 'DELIVERED', stepNumber: 1, occurredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 5000) },
            ],
        });

        if (Math.random() > 0.4) {
            await prisma.emailEvent.create({
                data: { campaignLeadId: cl.id, type: 'OPENED', stepNumber: 1, occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            });
        }
    }

    // Create inbox threads
    console.log('Creating inbox threads...');
    const categories = ['INTERESTED', 'NOT_INTERESTED', 'OOO', 'NEUTRAL', 'INTERESTED'];
    const replyBodies = [
        "Hi there,\n\nThanks for reaching out! This sounds interesting. I'd love to learn more about what you're offering.\n\nCould we schedule a quick call this week?\n\nBest,\nJohn",
        "Hello,\n\nWe're all set in this area and not looking to make any changes.\n\nThanks anyway.\n\nRegards,\nSarah",
        "I am currently out of the office and will return on January 6th.\n\nFor urgent matters, please contact support@techstart.com.\n\nThank you,\nMichael",
        "Hi,\n\nCould you tell me more about how this works? I'm not sure I understand the value proposition.\n\nThanks,\nEmily",
        "Hi there,\n\nYour email caught my attention. I'm definitely interested in exploring this.\n\nPlease send me more information about pricing and features.\n\nThanks,\nDavid",
    ];

    for (let i = 0; i < 5; i++) {
        const thread = await prisma.thread.create({
            data: {
                workspaceId: workspace.id,
                emailAccountId: gmailAccount.id,
                subject: `Re: Quick question about ${leadData[i].company}`,
                status: i === 0 ? 'OPEN' : 'REPLIED',
                category: categories[i],
                isRead: i > 0,
                leadEmail: leads[i].email,
                leadName: `${leadData[i].firstName} ${leadData[i].lastName}`,
                campaignId: campaign.id,
                campaignName: campaign.name,
                lastMessageAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
            },
        });

        await prisma.message.create({
            data: {
                threadId: thread.id,
                direction: 'INBOUND',
                fromEmail: leads[i].email,
                fromName: `${leadData[i].firstName} ${leadData[i].lastName}`,
                toEmail: gmailAccount.email,
                toName: gmailAccount.name,
                subject: thread.subject,
                body: replyBodies[i],
                isRead: i > 0,
                sentAt: thread.lastMessageAt,
            },
        });
    }

    // Create a second campaign (draft)
    await prisma.campaign.create({
        data: {
            workspaceId: workspace.id,
            emailAccountId: smtpAccount.id,
            name: 'Product Launch Announcement',
            status: 'DRAFT',
            timezone: 'UTC',
            sendingDays: JSON.stringify([1, 2, 3, 4, 5]),
            sendingStartHour: 10,
            sendingEndHour: 16,
        },
    });

    console.log('✅ Seed completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123');
    console.log('\n   Other users: admin@example.com, member@example.com (same password)');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

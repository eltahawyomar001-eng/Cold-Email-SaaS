import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;
        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name,
                passwordHash,
            },
        });

        // Create default workspace
        const workspaceSlug = generateSlug(name + '-workspace');
        const workspace = await prisma.workspace.create({
            data: {
                name: `${name}'s Workspace`,
                slug: workspaceSlug + '-' + user.id.slice(0, 6),
            },
        });

        // Add user as owner
        await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: workspace.id,
                role: 'OWNER',
            },
        });

        // Create free subscription
        await prisma.subscription.create({
            data: {
                userId: user.id,
                plan: 'FREE',
                status: 'ACTIVE',
            },
        });

        return NextResponse.json({
            message: 'Account created successfully',
            userId: user.id,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

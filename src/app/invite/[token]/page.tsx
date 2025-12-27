import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
} from '@/components/ui';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default async function InvitePage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const session = await getServerSession(authOptions);

    // Find the invite
    const invite = await prisma.invite.findUnique({
        where: { token },
        include: {
            workspace: true,
        },
    });

    if (!invite) {
        return <InviteError message="This invitation link is invalid or has been revoked." />;
    }

    if (invite.acceptedAt) {
        return <InviteError message="This invitation has already been accepted." />;
    }

    if (invite.expiresAt < new Date()) {
        return <InviteError message="This invitation has expired. Please ask for a new invite." />;
    }

    // If user is logged in and matches the invite email
    if (session?.user) {
        if (session.user.email?.toLowerCase() === invite.email.toLowerCase()) {
            // Accept the invite
            await prisma.$transaction([
                prisma.invite.update({
                    where: { id: invite.id },
                    data: { acceptedAt: new Date() },
                }),
                prisma.workspaceMember.create({
                    data: {
                        userId: session.user.id,
                        workspaceId: invite.workspaceId,
                        role: invite.role,
                    },
                }),
            ]);

            redirect('/app');
        } else {
            return (
                <InviteError
                    message={`This invitation was sent to ${invite.email}. You're logged in as ${session.user.email}. Please log out and try again.`}
                />
            );
        }
    }

    // Show invite acceptance page for logged out users
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-primary-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 mx-auto mb-4">
                        <Send className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-surface-900">You&apos;re Invited!</h1>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Join {invite.workspace.name}</CardTitle>
                        <CardDescription>
                            You&apos;ve been invited to join as a <span className="font-medium">{invite.role.toLowerCase()}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-surface-600 text-center">
                            This invitation was sent to <span className="font-medium">{invite.email}</span>
                        </p>

                        <div className="space-y-2">
                            <Link href={`/login?callbackUrl=/invite/${token}`} className="block">
                                <Button className="w-full">
                                    Sign In to Accept
                                </Button>
                            </Link>
                            <Link href={`/register?email=${encodeURIComponent(invite.email)}&callbackUrl=/invite/${token}`} className="block">
                                <Button variant="outline" className="w-full">
                                    Create Account
                                </Button>
                            </Link>
                        </div>

                        <p className="text-xs text-surface-400 text-center">
                            This invitation expires on {invite.expiresAt.toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InviteError({ message }: { message: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-primary-50 px-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-surface-900 mb-2">
                            Invitation Error
                        </h2>
                        <p className="text-surface-600 mb-6">{message}</p>
                        <Link href="/login">
                            <Button variant="outline">
                                Go to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

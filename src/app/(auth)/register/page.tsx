'use client';

import { useState, Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Mail, Lock, ArrowRight, Check } from 'lucide-react';

const features = [
    'Unlimited email accounts',
    'Smart warm-up system',
    'AI-powered sequences',
    'Real-time analytics',
    'Team collaboration',
];

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/app';
    const prefillEmail = searchParams.get('email') || '';

    const [name, setName] = useState('');
    const [email, setEmail] = useState(prefillEmail);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (prefillEmail) {
            setEmail(prefillEmail);
        }
    }, [prefillEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            // Auto sign in after registration
            const signInResult = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (signInResult?.ok) {
                router.push(callbackUrl);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
                    <Send className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">ColdReach</span>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
                <p className="text-slate-500">Start your 14-day free trial</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <Input
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    icon={<User className="h-4 w-4" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    type="email"
                    label="Email"
                    placeholder="you@company.com"
                    icon={<Mail className="h-4 w-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    type="password"
                    label="Password"
                    placeholder="Min 8 characters"
                    icon={<Lock className="h-4 w-4" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-xs text-center text-slate-500">
                    By creating an account, you agree to our{' '}
                    <Link href="#" className="text-blue-600 hover:underline">Terms</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </p>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign in
                </Link>
            </p>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
                <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
                    <RegisterForm />
                </Suspense>
            </div>

            {/* Right Panel - Features */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-700 p-12 flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="relative max-w-md">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <Send className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">ColdReach</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">
                        Start sending in minutes
                    </h2>

                    <p className="text-lg text-white/80 mb-8">
                        Get everything you need to launch successful cold email campaigns.
                    </p>

                    <div className="space-y-4">
                        {features.map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                                    <Check className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
                        <p className="text-white/90 italic mb-4">
                            &quot;ColdReach helped us 3x our reply rates in just 2 weeks. The warm-up feature is a game changer.&quot;
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white font-medium">
                                S
                            </div>
                            <div>
                                <p className="text-white font-medium">Sarah Johnson</p>
                                <p className="text-white/70 text-sm">Head of Sales, TechCorp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

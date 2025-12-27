'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/app';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push(callbackUrl);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        setEmail('demo@example.com');
        setPassword('password123');
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
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
                <p className="text-slate-500">Sign in to your account to continue</p>
            </div>

            {/* Demo Banner */}
            <button
                onClick={fillDemoCredentials}
                className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 hover:border-blue-200 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-slate-900">Demo Mode</p>
                        <p className="text-xs text-slate-500">Click to fill demo credentials</p>
                    </div>
                </div>
            </button>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

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
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign up for free
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-20">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <Send className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">ColdReach</span>
                    </div>

                    <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                        Scale your outreach
                        <br />
                        with AI-powered emails
                    </h1>

                    <p className="text-lg text-white/80 max-w-md">
                        Join thousands of sales teams using ColdReach to book more meetings and close more deals.
                    </p>
                </div>

                <div className="relative">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                        <div className="flex -space-x-3">
                            {['A', 'B', 'C', 'D'].map((letter, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-sm font-medium border-2 border-white/20"
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-white font-medium">Trusted by 10,000+ users</p>
                            <p className="text-white/70 text-sm">Join the community today</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
                <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}

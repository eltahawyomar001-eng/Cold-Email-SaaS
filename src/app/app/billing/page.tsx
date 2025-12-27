'use client';

import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
    Badge,
} from '@/components/ui';
import { Check, Zap, CreditCard } from 'lucide-react';

const plans = [
    {
        id: 'FREE',
        name: 'Free',
        price: 0,
        description: 'Perfect for trying out the platform',
        features: [
            '1 workspace',
            '1 email account',
            '1 campaign',
            '100 leads',
            'Basic analytics',
        ],
        limits: {
            workspaces: 1,
            emailAccounts: 1,
            campaigns: 1,
            leads: 100,
        },
    },
    {
        id: 'STARTER',
        name: 'Starter',
        price: 29,
        description: 'For small teams getting started',
        popular: true,
        features: [
            '3 workspaces',
            '3 email accounts',
            '3 campaigns',
            '1,000 leads',
            'Email warm-up',
            'Advanced analytics',
            'CSV export',
        ],
        limits: {
            workspaces: 3,
            emailAccounts: 3,
            campaigns: 3,
            leads: 1000,
        },
    },
    {
        id: 'PRO',
        name: 'Pro',
        price: 79,
        description: 'For growing teams that need more',
        features: [
            'Unlimited workspaces',
            'Unlimited email accounts',
            'Unlimited campaigns',
            'Unlimited leads',
            'Email warm-up',
            'Advanced analytics',
            'CSV export',
            'API access',
            'Priority support',
        ],
        limits: {
            workspaces: -1,
            emailAccounts: -1,
            campaigns: -1,
            leads: -1,
        },
    },
];

export default function BillingPage() {
    const [currentPlan, setCurrentPlan] = useState('FREE');
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleUpgrade = async (planId: string) => {
        setIsLoading(planId);

        // Simulate upgrade
        await new Promise((r) => setTimeout(r, 1500));

        setCurrentPlan(planId);
        setIsLoading(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-surface-900">Billing</h1>
                <p className="text-surface-500 mt-1">
                    Manage your subscription and billing
                </p>
            </div>

            {/* Current Plan */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <CreditCard className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="font-medium text-surface-900">Current Plan</p>
                                <p className="text-sm text-surface-500">
                                    You are on the <span className="font-medium">{currentPlan}</span> plan
                                </p>
                            </div>
                        </div>
                        <Badge variant={currentPlan === 'PRO' ? 'success' : 'secondary'}>
                            {currentPlan}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Demo Mode Banner */}
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-100 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <Zap className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                        <p className="font-medium text-primary-900">Demo Mode</p>
                        <p className="text-sm text-primary-700 mt-0.5">
                            This is a simulated billing system. No real charges will be made.
                            Click any upgrade button to simulate a plan change.
                        </p>
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative ${plan.popular ? 'border-primary-500 shadow-lg' : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge className="bg-primary-600 text-white">Most Popular</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-surface-900">${plan.price}</span>
                                <span className="text-surface-500">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center space-x-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                                        <span className="text-surface-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {currentPlan === plan.id ? (
                                <Button variant="outline" className="w-full" disabled>
                                    Current Plan
                                </Button>
                            ) : (
                                <Button
                                    className="w-full"
                                    variant={plan.popular ? 'default' : 'outline'}
                                    isLoading={isLoading === plan.id}
                                    onClick={() => handleUpgrade(plan.id)}
                                >
                                    {plan.price > (plans.find((p) => p.id === currentPlan)?.price || 0)
                                        ? 'Upgrade'
                                        : 'Downgrade'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FAQ */}
            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="font-medium text-surface-900">Can I change plans anytime?</p>
                        <p className="text-sm text-surface-600 mt-1">
                            Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-surface-900">What happens when I reach my limits?</p>
                        <p className="text-sm text-surface-600 mt-1">
                            You'll receive a notification when approaching limits. You can upgrade anytime to continue.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-surface-900">Is there a free trial?</p>
                        <p className="text-sm text-surface-600 mt-1">
                            The Free plan is always free! Try it out and upgrade when you're ready.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
    Input,
    Textarea,
    Select,
    Checkbox,
} from '@/components/ui';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';

export default function NewCampaignPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [emailAccountId, setEmailAccountId] = useState('');
    const [timezone, setTimezone] = useState('UTC');
    const [sendingDays, setSendingDays] = useState([1, 2, 3, 4, 5]);
    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(17);
    const [steps, setSteps] = useState([
        { id: '1', subject: '', body: '', delayAmount: 0, delayUnit: 'days' },
    ]);

    const addStep = () => {
        setSteps([
            ...steps,
            {
                id: String(Date.now()),
                subject: '',
                body: '',
                delayAmount: 2,
                delayUnit: 'days'
            },
        ]);
    };

    const removeStep = (id: string) => {
        if (steps.length > 1) {
            setSteps(steps.filter((s) => s.id !== id));
        }
    };

    const updateStep = (id: string, field: string, value: string | number) => {
        setSteps(steps.map((s) =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // In a real app, this would call the API
        // For demo, just simulate and redirect
        await new Promise((r) => setTimeout(r, 1000));
        router.push('/app/campaigns');
    };

    const days = [
        { value: 0, label: 'Sun' },
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link href="/app/campaigns">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">New Campaign</h1>
                    <p className="text-surface-500 mt-1">
                        Create a new email campaign with sequence steps
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Details</CardTitle>
                        <CardDescription>
                            Set up the basic configuration for your campaign
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Campaign Name"
                            placeholder="e.g., Q4 Sales Outreach"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <Select
                            label="Sending Account"
                            options={[
                                { value: '', label: 'Select an account...' },
                                { value: 'demo', label: 'sales@demo.com (Gmail)' },
                            ]}
                            value={emailAccountId}
                            onChange={(e) => setEmailAccountId(e.target.value)}
                        />

                        <Select
                            label="Timezone"
                            options={[
                                { value: 'UTC', label: 'UTC' },
                                { value: 'America/New_York', label: 'Eastern Time (ET)' },
                                { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                                { value: 'Europe/London', label: 'London (GMT)' },
                            ]}
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sending Schedule</CardTitle>
                        <CardDescription>
                            Configure when emails should be sent
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                                Sending Days
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {days.map((day) => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => {
                                            if (sendingDays.includes(day.value)) {
                                                setSendingDays(sendingDays.filter((d) => d !== day.value));
                                            } else {
                                                setSendingDays([...sendingDays, day.value].sort());
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sendingDays.includes(day.value)
                                                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                                                : 'bg-surface-100 text-surface-600 border border-surface-200 hover:bg-surface-200'
                                            }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Start Hour"
                                options={Array.from({ length: 24 }, (_, i) => ({
                                    value: String(i),
                                    label: `${i.toString().padStart(2, '0')}:00`,
                                }))}
                                value={String(startHour)}
                                onChange={(e) => setStartHour(Number(e.target.value))}
                            />
                            <Select
                                label="End Hour"
                                options={Array.from({ length: 24 }, (_, i) => ({
                                    value: String(i),
                                    label: `${i.toString().padStart(2, '0')}:00`,
                                }))}
                                value={String(endHour)}
                                onChange={(e) => setEndHour(Number(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sequence Steps */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Email Sequence</CardTitle>
                                <CardDescription>
                                    Add email steps to your campaign sequence
                                </CardDescription>
                            </div>
                            <Button type="button" variant="outline" onClick={addStep}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Step
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className="relative p-4 border border-surface-200 rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-surface-900">
                                            {index === 0 ? 'Initial Email' : `Follow-up ${index}`}
                                        </span>
                                    </div>
                                    {steps.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeStep(step.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    )}
                                </div>

                                {index > 0 && (
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="text-sm text-surface-500">Wait</span>
                                        <Input
                                            type="number"
                                            className="w-20"
                                            value={step.delayAmount}
                                            onChange={(e) => updateStep(step.id, 'delayAmount', Number(e.target.value))}
                                            min={0}
                                        />
                                        <Select
                                            options={[
                                                { value: 'minutes', label: 'minutes' },
                                                { value: 'hours', label: 'hours' },
                                                { value: 'days', label: 'days' },
                                            ]}
                                            value={step.delayUnit}
                                            onChange={(e) => updateStep(step.id, 'delayUnit', e.target.value)}
                                            className="w-28"
                                        />
                                        <span className="text-sm text-surface-500">then send:</span>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Input
                                        label="Subject"
                                        placeholder="e.g., Quick question about {{company}}"
                                        value={step.subject}
                                        onChange={(e) => updateStep(step.id, 'subject', e.target.value)}
                                    />
                                    <Textarea
                                        label="Email Body"
                                        placeholder="Hi {{firstName}},&#10;&#10;I noticed that..."
                                        value={step.body}
                                        onChange={(e) => updateStep(step.id, 'body', e.target.value)}
                                        className="min-h-[150px]"
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3">
                    <Link href="/app/campaigns">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" isLoading={isLoading}>
                        Create Campaign
                    </Button>
                </div>
            </form>
        </div>
    );
}

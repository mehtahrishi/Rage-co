'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { AnimatedPage } from '@/components/animated-page';

export default function ForgotPasswordPage() {
    const { sendPasswordRecovery } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        try {
            setIsLoading(true);
            await sendPasswordRecovery(email);
            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Forgot password error:', error);
            setError(error.message || 'Failed to send recovery email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="font-headline text-3xl font-bold uppercase tracking-wider">
                            Recovery
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Reset your password
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Forgot Password</CardTitle>
                            <CardDescription>
                                {isSubmitted
                                    ? "Check your email for the recovery link."
                                    : "Enter your email address and we'll send you a link to reset your password."}
                            </CardDescription>
                        </CardHeader>

                        {isSubmitted ? (
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Email Sent</h3>
                                        <p className="text-sm text-muted-foreground">
                                            We've sent a password reset link to <strong>{email}</strong>.
                                            Please check your inbox and spam folder.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4">
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending Link...
                                            </>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}

                        <CardFooter className="flex justify-center border-t pt-6">
                            <Link
                                href="/auth/login"
                                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AnimatedPage>
    );
}

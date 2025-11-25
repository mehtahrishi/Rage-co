'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatedPage } from '@/components/animated-page';

export default function OtpPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Check if we have the necessary data
        const storedEmail = sessionStorage.getItem('otp_email');
        const storedHash = sessionStorage.getItem('otp_hash');
        const storedExpiry = sessionStorage.getItem('otp_expiry');

        if (!storedEmail || !storedHash || !storedExpiry) {
            router.push('/auth/login');
            return;
        }

        setEmail(storedEmail);

        // Calculate remaining time
        const expiryTime = parseInt(storedExpiry);
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));

        setTimeLeft(remaining);
        if (remaining === 0) setCanResend(true);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResend = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP');
            }

            // Update session storage
            sessionStorage.setItem('otp_hash', data.hash);
            sessionStorage.setItem('otp_expiry', data.expiry.toString());

            // Reset timer
            setTimeLeft(120);
            setCanResend(false);

            toast({
                title: "OTP Resent",
                description: "A new code has been sent to your email.",
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        try {
            setIsLoading(true);

            const hash = sessionStorage.getItem('otp_hash');
            const expiry = sessionStorage.getItem('otp_expiry');

            const response = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp,
                    hash,
                    expiry: parseInt(expiry || '0'),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            // Success
            sessionStorage.setItem('otp_verified', 'true');

            // Clear sensitive data
            sessionStorage.removeItem('otp_hash');
            sessionStorage.removeItem('otp_expiry');
            // We might want to keep email or clear it too

            toast({
                title: "Verified",
                description: "Login complete.",
            });

            router.push('/');
        } catch (err: any) {
            setError(err.message);
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
                            Verification
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Enter the code sent to {email}
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>
                                Your security is important to us. Please enter the OTP sent to your email.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="otp">One-Time Password</Label>
                                    <Input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="text-center text-2xl tracking-widest"
                                        autoComplete="one-time-code"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Time remaining: <span className="font-medium text-foreground">{formatTime(timeLeft)}</span>
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResend}
                                        disabled={!canResend || isLoading}
                                        className="text-primary hover:text-primary/80"
                                    >
                                        {isLoading && !otp ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                        ) : (
                                            <RefreshCw className="h-3 w-3 mr-1" />
                                        )}
                                        Resend Code
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && otp ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Verify & Login
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AnimatedPage>
    );
}

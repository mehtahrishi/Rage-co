'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { AnimatedPage } from '@/components/animated-page';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { completePasswordRecovery } = useAuth();
    const { toast } = useToast();

    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!userId || !secret) {
            setError('Invalid recovery link. Please request a new password reset link.');
        }
    }, [userId, secret]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        if (error) setError('');
    };

    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
        };
        return requirements;
    };

    const passwordRequirements = validatePassword(formData.password);
    const passwordsMatch = formData.password === formData.confirmPassword;
    const isFormValid =
        Object.values(passwordRequirements).every(Boolean) &&
        passwordsMatch &&
        userId &&
        secret;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isFormValid) {
            setError('Please fill all fields correctly.');
            return;
        }

        try {
            setIsLoading(true);
            await completePasswordRecovery(userId!, secret!, formData.password);

            toast({
                title: "Password Reset Successfully",
                description: "You can now log in with your new password.",
            });

            router.push('/auth/login');
        } catch (error: any) {
            console.error('Reset password error:', error);
            setError(error.message || 'Failed to reset password. The link may have expired.');
            setIsLoading(false);
        }
    };

    const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
        <div className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
            {met ? <Check className="h-3 w-3 mr-2" /> : <X className="h-3 w-3 mr-2" />}
            {text}
        </div>
    );

    if (!userId || !secret) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Invalid Link</CardTitle>
                    <CardDescription>
                        This password reset link is invalid or missing required parameters.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href="/auth/forgot-password">
                        <Button variant="outline" className="w-full">
                            Request New Link
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Create a new strong password for your account.
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
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        {formData.password && (
                            <div className="space-y-1 mt-2">
                                <RequirementItem met={passwordRequirements.length} text="At least 8 characters" />
                                <RequirementItem met={passwordRequirements.uppercase} text="One uppercase letter" />
                                <RequirementItem met={passwordRequirements.lowercase} text="One lowercase letter" />
                                <RequirementItem met={passwordRequirements.number} text="One number" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        {formData.confirmPassword && (
                            <RequirementItem met={passwordsMatch} text="Passwords match" />
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>

                    <Link
                        href="/auth/login"
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <AnimatedPage>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="font-headline text-3xl font-bold uppercase tracking-wider">
                            New Password
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Secure your account
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    }>
                        <ResetPasswordContent />
                    </Suspense>
                </div>
            </div>
        </AnimatedPage>
    );
}

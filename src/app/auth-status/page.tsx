'use client';

import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthStatusPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading authentication status...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider">
            Authentication Status
          </h1>
          <p className="mt-2 text-muted-foreground">
            Current authentication state
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              {isAuthenticated ? 'You are logged in' : 'You are not logged in'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
              </div>
              {user && (
                <div className="space-y-2">
                  <div><strong>User ID:</strong> {user.$id}</div>
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Email Verified:</strong> {user.emailVerification ? 'Yes' : 'No'}</div>
                  <div><strong>Created:</strong> {new Date(user.$createdAt).toLocaleString()}</div>
                </div>
              )}
              {!user && !loading && (
                <div className="text-muted-foreground">
                  No user data available. Please log in.
                </div>
              )}
            </div>
            
            <div className="mt-6 space-x-4">
              <Button asChild>
                <a href="/auth/login">Login</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/auth/register">Register</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/">Home</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
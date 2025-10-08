'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { account } from '@/lib/appwrite';

export default function ConnectionTestPage() {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

  const testConnection = async () => {
    setTestResult({ status: 'loading', message: 'Testing Appwrite connection...' });

    try {
      // Try to get account info - this will tell us if the connection works
      try {
        const user = await account.get();
        setTestResult({
          status: 'success',
          message: `Connected and authenticated as: ${user.email}`,
          details: user
        });
      } catch (error: any) {
        // If we get a 401 error, that means connection is working but user isn't logged in
        if (error.code === 401) {
          setTestResult({
            status: 'success',
            message: 'Appwrite connection successful! (User not authenticated - this is normal)',
            details: { 
              endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT, 
              projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
              message: 'Connection works, ready for authentication!'
            }
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Connection test error:', error);
      setTestResult({
        status: 'error',
        message: `Connection failed: ${error.message}`,
        details: {
          code: error.code,
          type: error.type,
          endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
          projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
        }
      });
    }
  };

  const getStatusIcon = () => {
    switch (testResult.status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (testResult.status) {
      case 'loading':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider">
            Appwrite Connection Test
          </h1>
          <p className="mt-2 text-muted-foreground">
            Test your Appwrite configuration
          </p>
        </header>

        <div className="mb-6 flex justify-center">
          <Button onClick={testConnection} disabled={testResult.status === 'loading'} size="lg">
            {testResult.status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
        </div>

        {testResult.status !== 'idle' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <CardTitle className="text-lg">Connection Test Result</CardTitle>
                </div>
                {getStatusBadge()}
              </div>
              <CardDescription>{testResult.message}</CardDescription>
            </CardHeader>
            {testResult.details && (
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>
        )}

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Current Configuration:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}</p>
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}</p>
            <p><strong>Database ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-semibold mb-2">What This Test Does:</h4>
          <ul className="text-sm space-y-1">
            <li>• Tests connection to your Appwrite project</li>
            <li>• Verifies your project ID and endpoint are correct</li>
            <li>• Shows authentication status</li>
            <li>• If successful, you can proceed to create accounts!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

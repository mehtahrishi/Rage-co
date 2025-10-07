'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Client, Account } from 'appwrite';

const ENDPOINTS = [
  { name: 'Global', url: 'https://cloud.appwrite.io/v1' },
  { name: 'EU Central', url: 'https://eu-central-1.appwrite.global/v1' },
  { name: 'US East', url: 'https://us-east-1.appwrite.global/v1' },
  { name: 'US West', url: 'https://us-west-1.appwrite.global/v1' },
];

interface TestResult {
  endpoint: string;
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  responseTime?: number;
}

export default function EndpointTesterPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testEndpoint = async (endpoint: { name: string; url: string }): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const client = new Client();
      client
        .setEndpoint(endpoint.url)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
      
      const account = new Account(client);
      
      // Try to get account (expect 401 if not logged in, but that means connection works)
      await account.get().catch((error) => {
        if (error.code === 401) {
          // This is good - means connection works but not authenticated
          return { success: true };
        }
        throw error;
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: endpoint.url,
        name: endpoint.name,
        status: 'success',
        message: 'Connection successful!',
        responseTime
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: endpoint.url,
        name: endpoint.name,
        status: 'error',
        message: error.message || 'Connection failed',
        responseTime
      };
    }
  };

  const testAllEndpoints = async () => {
    setIsRunning(true);
    setResults([]);

    // Initialize with loading states
    const loadingResults = ENDPOINTS.map(endpoint => ({
      endpoint: endpoint.url,
      name: endpoint.name,
      status: 'loading' as const,
      message: 'Testing...'
    }));
    setResults(loadingResults);

    // Test each endpoint
    for (let i = 0; i < ENDPOINTS.length; i++) {
      const result = await testEndpoint(ENDPOINTS[i]);
      
      setResults(prev => {
        const newResults = [...prev];
        newResults[i] = result;
        return newResults;
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Working</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const successfulEndpoint = results.find(r => r.status === 'success');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider">
            Appwrite Endpoint Tester
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find the correct regional endpoint for your Appwrite project
          </p>
        </header>

        <div className="mb-6 flex justify-center">
          <Button onClick={testAllEndpoints} disabled={isRunning} size="lg">
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Endpoints...
              </>
            ) : (
              'Test All Endpoints'
            )}
          </Button>
        </div>

        {successfulEndpoint && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Working Endpoint Found!
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm mb-3">
              Update your .env.local file with this endpoint:
            </p>
            <code className="block bg-green-100 dark:bg-green-900 p-2 rounded text-sm font-mono">
              NEXT_PUBLIC_APPWRITE_ENDPOINT={successfulEndpoint.endpoint}
            </code>
            <p className="text-green-600 dark:text-green-400 text-sm mt-2">
              Response time: {successfulEndpoint.responseTime}ms
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.endpoint}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <CardTitle className="text-lg">{result.name}</CardTitle>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
                <CardDescription>
                  <code className="text-xs">{result.endpoint}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.message}</p>
                {result.responseTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Response time: {result.responseTime}ms
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length > 0 && (
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Next Steps:</h3>
            <div className="space-y-2 text-sm">
              {successfulEndpoint ? (
                <>
                  <p className="text-green-600">
                    ✅ <strong>Endpoint found:</strong> Update your .env.local with the working endpoint above
                  </p>
                  <p className="text-blue-600">
                    🔄 <strong>Restart your dev server:</strong> Press Ctrl+C and run `npm run dev` again
                  </p>
                  <p className="text-purple-600">
                    🚀 <strong>Test authentication:</strong> Try registering a new account
                  </p>
                </>
              ) : results.every(r => r.status === 'error') ? (
                <>
                  <p className="text-red-600">
                    ❌ <strong>All endpoints failed:</strong> This might be a CORS issue
                  </p>
                  <p className="text-orange-600">
                    🔧 <strong>Add platform:</strong> Go to Appwrite Console → Settings → Platforms
                  </p>
                  <p className="text-blue-600">
                    📝 <strong>Add Web App:</strong> Hostname: localhost:9002
                  </p>
                </>
              ) : (
                <p className="text-blue-600">
                  ⏳ <strong>Testing in progress...</strong> Wait for all tests to complete
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-semibold mb-2">Current Configuration:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Current Endpoint:</strong> {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}</p>
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
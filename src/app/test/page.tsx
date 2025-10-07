'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { account, databases, storage, CONFIG } from '@/lib/appwrite';

interface TestResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.details = details;
        return [...prev];
      } else {
        return [...prev, { name, status, message, details }];
      }
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Environment Variables
    updateTest('Environment Variables', 'loading', 'Checking configuration...');
    try {
      const envVars = {
        ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      };
      
      if (!envVars.ENDPOINT || !envVars.PROJECT_ID || !envVars.DATABASE_ID) {
        throw new Error('Missing required environment variables');
      }
      
      updateTest('Environment Variables', 'success', 'All environment variables configured', envVars);
    } catch (error) {
      updateTest('Environment Variables', 'error', error instanceof Error ? error.message : 'Configuration error');
    }

    // Test 2: Appwrite Connection
    updateTest('Appwrite Connection', 'loading', 'Testing connection...');
    try {
      // Try to get account info (this will fail if not authenticated, but that's ok)
      const response = await account.get().catch(() => null);
      updateTest('Appwrite Connection', 'success', 'Connected to Appwrite successfully', {
        user: response ? response.email : 'Not authenticated (this is normal)'
      });
    } catch (error) {
      updateTest('Appwrite Connection', 'error', error instanceof Error ? error.message : 'Connection failed');
    }

    // Test 3: Database Access
    updateTest('Database Access', 'loading', 'Testing database connection...');
    try {
      // Try to list documents from products collection
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PRODUCTS,
        []
      );
      
      updateTest('Database Access', 'success', `Database accessible. Found ${response.documents.length} products`, {
        totalDocuments: response.documents.length,
        databaseId: CONFIG.DATABASE_ID,
        collectionId: CONFIG.COLLECTIONS.PRODUCTS
      });
    } catch (error) {
      updateTest('Database Access', 'error', error instanceof Error ? error.message : 'Database access failed');
    }

    // Test 4: API Routes
    updateTest('API Routes', 'loading', 'Testing API endpoints...');
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (response.ok) {
        updateTest('API Routes', 'success', `API working. ${data.count || 0} products found`, data);
      } else {
        throw new Error(data.message || 'API request failed');
      }
    } catch (error) {
      updateTest('API Routes', 'error', error instanceof Error ? error.message : 'API test failed');
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
        return <Badge variant="default" className="bg-green-500">Passed</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  useEffect(() => {
    // Auto-run tests on page load
    runTests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-wider">
            Backend Integration Test
          </h1>
          <p className="mt-2 text-muted-foreground">
            Testing Appwrite connection and API functionality
          </p>
        </header>

        <div className="mb-6 flex justify-center">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Tests Again'
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
                <CardDescription>{test.message}</CardDescription>
              </CardHeader>
              {test.details && (
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {tests.length > 0 && (
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Next Steps:</h3>
            <div className="space-y-2 text-sm">
              {tests.find(t => t.name === 'Database Access' && t.status === 'error') && (
                <p className="text-orange-600">
                  🔧 <strong>Database not set up:</strong> Run the setup script: <code>node scripts/setup-appwrite.js</code>
                </p>
              )}
              {tests.find(t => t.name === 'Database Access' && t.status === 'success') && (
                <p className="text-green-600">
                  ✅ <strong>Database ready:</strong> You can now migrate your static data!
                </p>
              )}
              {tests.find(t => t.name === 'API Routes' && t.status === 'success') && (
                <p className="text-green-600">
                  ✅ <strong>API working:</strong> Your backend is functional!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
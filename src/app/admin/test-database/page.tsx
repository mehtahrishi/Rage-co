'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { databases, CONFIG } from '@/lib/appwrite';

export default function TestDatabasePage() {
  const [ordersData, setOrdersData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDatabaseAccess = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Accessing database directly...');
      
      // Test accessing orders collection
      const ordersResponse = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.ORDERS
      );
      
      console.log('Orders response:', ordersResponse);
      setOrdersData(ordersResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to access database: ' + errorMessage);
      console.error('Error accessing database:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Test Database Access</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Database Access Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testDatabaseAccess} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Loading...' : 'Test Database Access'}
          </Button>
          
          {ordersData && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Response:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(ordersData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
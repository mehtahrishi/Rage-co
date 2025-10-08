'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestAdminAPIPage() {
  const [usersData, setUsersData] = useState<any>(null);
  const [ordersData, setOrdersData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testUsersAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsersData(data);
    } catch (err) {
      setError('Failed to fetch users: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const testOrdersAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrdersData(data);
    } catch (err) {
      setError('Failed to fetch orders: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin API Test</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testUsersAPI} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Loading...' : 'Test Users API'}
            </Button>
            
            {usersData && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Response:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(usersData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Orders API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testOrdersAPI} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Loading...' : 'Test Orders API'}
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
    </div>
  );
}
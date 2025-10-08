'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminService } from '@/services/admin';

export default function TestUsersPage() {
  const [usersData, setUsersData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testUsersAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getUsers();
      setUsersData(data);
    } catch (err) {
      setError('Failed to fetch users: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const testDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await AdminService.getDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      setError('Failed to fetch dashboard stats: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Test Users and Dashboard Stats</h1>
      
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
            <CardTitle>Dashboard Stats Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testDashboardStats} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Loading...' : 'Test Dashboard Stats'}
            </Button>
            
            {dashboardStats && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Response:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(dashboardStats, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
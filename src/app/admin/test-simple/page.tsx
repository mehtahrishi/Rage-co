'use client';

import { useEffect, useState } from 'react';

export default function TestSimplePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test direct API call
      console.log('Testing direct API call...');
      const response = await fetch('/api/admin/users');
      const result = await response.json();
      console.log('Direct API result:', result);
      
      setData(result);
    } catch (err) {
      setError('Failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Simple Test</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <button 
        onClick={testData} 
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Test API'}
      </button>
      
      {data && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Response:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
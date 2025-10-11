'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function TestChatbotPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testChatbot = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test Chatbot API</CardTitle>
          <CardDescription>
            Test the chatbot functionality to debug any issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="query">Test Query</Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask something about returns, shipping, etc."
            />
          </div>
          
          <Button 
            onClick={testChatbot} 
            disabled={loading || !query.trim()}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Send Query'}
          </Button>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 className="font-medium text-red-800">Error:</h4>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {response && (
            <div>
              <Label>Response:</Label>
              <Textarea
                value={response}
                readOnly
                className="mt-2"
                rows={6}
              />
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <p><strong>Environment Check:</strong></p>
            <p>GEMINI_API_KEY: {process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'Set' : 'Not set'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
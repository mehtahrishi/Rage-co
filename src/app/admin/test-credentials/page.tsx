'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestCredentialsPage() {
  const [credentials, setCredentials] = useState<{email: string | undefined, password: string | undefined}>({email: undefined, password: undefined});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is just for testing - in a real app, you should never expose passwords on the client-side
    setCredentials({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Test Admin Credentials</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Admin Email:</h3>
                <p>{credentials.email || 'Not set'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Admin Password:</h3>
                <p>{credentials.password ? '✓ Set (hidden for security)' : 'Not set'}</p>
              </div>
              <Button onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { OrderService } from '@/services/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from '@/components/custom-loader';

export default function TestOrderPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAuthLoader, setShowAuthLoader] = useState(true);

  const handleAuthLoadingComplete = () => {
    setShowAuthLoader(false);
  };

  // Show custom loader while checking authentication
  if (authLoading && showAuthLoader) {
    return <CustomLoader onLoadingComplete={handleAuthLoadingComplete} />;
  }

  const createTestOrder = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an order.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const testOrderData = {
        userId: user.$id,
        items: [
          {
            productId: 'test-product-1',
            productName: 'Test T-Shirt',
            quantity: 2,
            price: 999,
            size: 'M',
            color: 'Black'
          },
          {
            productId: 'test-product-2',
            productName: 'Test Hoodie',
            quantity: 1,
            price: 1999,
            size: 'L',
            color: 'White'
          }
        ],
        total: 3997,
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Test Street',
          apartment: 'Apt 4B',
          city: 'Mumbai',
          country: 'India',
          postalCode: '400001'
        }
      };

      const order = await OrderService.createOrder(testOrderData);
      console.log('Test order created:', order);
      
      toast({
        title: "Success!",
        description: `Test order created with ID: ${order.$id.substring(0, 8)}`,
      });
    } catch (error) {
      console.error('Error creating test order:', error);
      toast({
        title: "Error",
        description: `Failed to create test order: ${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Order Test Page</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div>
                <p>Logged in as: {user.name || user.email}</p>
                <p>User ID: {user.$id}</p>
              </div>
            ) : (
              <p>Not logged in - please log in to test orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Order Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This will create a test order with sample data.</p>
            <Button 
              onClick={createTestOrder} 
              disabled={!user || loading}
              className="w-full"
            >
              {loading ? 'Creating Order...' : 'Create Test Order'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
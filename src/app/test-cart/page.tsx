'use client';

import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestCartPage() {
  const { items, totalPrice, loading, clearCart } = useCart();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Cart Test Page</h1>
      
      <div className="grid gap-6">
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
              <p>Not logged in - using localStorage</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Items count: {items.length}</p>
            <p>Total price: ₹{totalPrice.toFixed(2)}</p>
            
            {items.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Cart Items:</h3>
                {items.map(item => (
                  <div key={item.id} className="border p-2 mb-2 rounded">
                    <p>{item.product.name}</p>
                    <p>Size: {item.size}, Color: {item.color}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <Button 
                  onClick={clearCart} 
                  variant="destructive" 
                  className="mt-4"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/auth-provider';
import { OrderService } from '@/services/orders';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { CustomLoader } from '@/components/custom-loader';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        // Fetch user orders using the OrderService
        const userOrders = await OrderService.getUserOrders(user.$id);
        setOrders(userOrders);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge variant="default">Processing</Badge>;
      case 'shipped':
        return <Badge variant="default" className="bg-blue-500">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Show custom loader while checking authentication or loading orders
  if (authLoading || (loading && showLoader)) {
    return <CustomLoader onLoadingComplete={handleLoadingComplete} />;
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
          My Orders
        </h1>
        <p className="mt-2 text-muted-foreground">Track your order history and status</p>
      </header>

      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View your past and current orders</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.$id}>
                      <TableCell className="font-medium">#{order.$id.substring(0, 8)}</TableCell>
                      <TableCell>{new Date(order.$createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items?.map((item, index: number) => (
                            <div key={index} className="text-sm">
                              {item.quantity} × {item.productName} ({item.size}, {item.color})
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>₹{order.total?.toLocaleString() || 0}</TableCell>
                      <TableCell>{getStatusBadge(order.status || 'pending')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
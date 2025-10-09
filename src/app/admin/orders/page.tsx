'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminService } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log('Fetching orders from AdminService...');
        // Fetch real order data using AdminService
        const fetchedOrders = await AdminService.getOrders();
        console.log('Fetched orders:', fetchedOrders);
        console.log('First order structure:', fetchedOrders[0]);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data if API fails
        console.log('Using mock data as fallback');
        setOrders(getMockOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getMockOrders = () => {
    return [
      {
        $id: 'order1',
        userId: 'user1',
        userName: 'Olivia Martin',
        userEmail: 'olivia.martin@example.com',
        total: 1999,
        status: 'pending',
        createdAt: '2023-06-15T10:30:00Z',
        updatedAt: '2023-06-15T10:30:00Z',
        items: [
          { productId: 'prod1', productName: 'Oversized T-Shirt', quantity: 1, price: 1999, size: 'M', color: 'Black' }
        ]
      },
      {
        $id: 'order2',
        userId: 'user2',
        userName: 'Jackson Lee',
        userEmail: 'jackson.lee@example.com',
        total: 390,
        status: 'processing',
        createdAt: '2023-06-14T14:15:00Z',
        updatedAt: '2023-06-15T09:20:00Z',
        items: [
          { productId: 'prod2', productName: 'V-Neck T-Shirt', quantity: 1, price: 390, size: 'L', color: 'White' }
        ]
      },
      {
        $id: 'order3',
        userId: 'user3',
        userName: 'Isabella Nguyen',
        userEmail: 'isabella.nguyen@example.com',
        total: 299,
        status: 'shipped',
        createdAt: '2023-06-13T11:45:00Z',
        updatedAt: '2023-06-14T16:30:00Z',
        items: [
          { productId: 'prod3', productName: 'Baby Tee', quantity: 1, price: 299, size: 'S', color: 'Pink' }
        ]
      },
      {
        $id: 'order4',
        userId: 'user4',
        userName: 'William Kim',
        userEmail: 'william.kim@example.com',
        total: 999,
        status: 'delivered',
        createdAt: '2023-06-12T09:20:00Z',
        updatedAt: '2023-06-13T10:15:00Z',
        items: [
          { productId: 'prod4', productName: 'Cargo Pants', quantity: 1, price: 999, size: '32', color: 'Olive' }
        ]
      },
      {
        $id: 'order5',
        userId: 'user5',
        userName: 'Sofia Davis',
        userEmail: 'sofia.davis@example.com',
        total: 390,
        status: 'cancelled',
        createdAt: '2023-06-11T16:40:00Z',
        updatedAt: '2023-06-12T11:25:00Z',
        items: [
          { productId: 'prod5', productName: 'Bandana', quantity: 2, price: 195, size: 'One Size', color: 'Black' }
        ]
      }
    ];
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Confirmed</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Processing</Badge>;
      case 'shipped':
        return <Badge variant="default" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Refunded</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Pending</Badge>;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);

      // Add order to updating set
      setUpdatingOrders(prev => new Set(prev).add(orderId));

      // Update order status using AdminService
      const updatedOrder = await AdminService.updateOrderStatus(orderId, newStatus);
      console.log('Update response:', updatedOrder);

      // Update local state to reflect the change
      setOrders(orders.map(order =>
        order.$id === orderId ? { ...order, status: newStatus, $updatedAt: new Date().toISOString() } : order
      ));

      console.log(`Order ${orderId} status successfully updated to ${newStatus}`);

      // Show success toast
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus.toUpperCase()}`,
      });

    } catch (error) {
      console.error('Detailed error updating order status:', error);

      // Show error toast
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove order from updating set
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    let customerName = '';
    let customerAddress = '';

    try {
      const shippingAddress = typeof order.shippingAddress === 'string'
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress;
      customerName = `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim();

      // Include all address fields in search
      const addressParts = [
        shippingAddress?.address || '',
        shippingAddress?.apartment || '',
        shippingAddress?.city || '',
        shippingAddress?.postalCode || ''
      ].filter(part => part.trim() !== '');
      customerAddress = addressParts.join(' ');
    } catch (e) {
      customerName = `Customer ${order.userId?.substring(0, 8)}`;
    }

    const orderId = order.$id || '';

    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (order.status || 'pending') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage and view customer orders.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full sm:w-auto">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.$id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-sm">#{order.$id ? order.$id.substring(0, 8) : 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.$createdAt ? new Date(order.$createdAt).toLocaleDateString() : 'Unknown Date'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status || 'pending')}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              disabled={updatingOrders.has(order.$id)}
                            >
                              {updatingOrders.has(order.$id) ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'confirmed')} disabled={updatingOrders.has(order.$id)}>Confirm Order</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'processing')} disabled={updatingOrders.has(order.$id)}>Set Processing</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'shipped')} disabled={updatingOrders.has(order.$id)}>Mark Shipped</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'delivered')} disabled={updatingOrders.has(order.$id)}>Mark Delivered</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'cancelled')} disabled={updatingOrders.has(order.$id)} className="text-red-600">Cancel Order</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'refunded')} disabled={updatingOrders.has(order.$id)} className="text-gray-600">Mark Refunded</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">
                          {(() => {
                            try {
                              const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
                              return `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() || `Customer ${order.userId?.substring(0, 8)}`;
                            } catch (e) {
                              return `Customer ${order.userId?.substring(0, 8)}`;
                            }
                          })()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            try {
                              const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
                              if (shippingAddress) {
                                const addressParts = [];
                                if (shippingAddress.address) addressParts.push(shippingAddress.address);
                                if (shippingAddress.apartment) addressParts.push(`${shippingAddress.apartment}`);
                                if (shippingAddress.city) addressParts.push(shippingAddress.city);
                                if (shippingAddress.postalCode) addressParts.push(shippingAddress.postalCode);
                                return addressParts.length > 0 ? addressParts.join(', ') : 'No address provided';
                              }
                              return 'No address provided';
                            } catch (e) {
                              return 'Address data unavailable';
                            }
                          })()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Items:</p>
                        {(() => {
                          try {
                            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                            if (Array.isArray(items)) {
                              return items.map((item: any, index: number) => (
                                <p key={index} className="text-sm">
                                  {item.productName} × {item.quantity} ({item.size}, {item.color})
                                </p>
                              ));
                            }
                          } catch (e) {
                            console.error('Error parsing items:', e);
                          }
                          return <p className="text-sm text-muted-foreground">Items data unavailable</p>;
                        })()}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <span className="font-medium">₹{Number(order.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Order ID</TableHead>
                      <TableHead className="min-w-[150px]">Customer</TableHead>
                      <TableHead className="min-w-[200px]">Address</TableHead>
                      <TableHead className="min-w-[150px]">Items</TableHead>
                      <TableHead className="min-w-[100px]">Total</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Ordered</TableHead>
                      <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.$id}>
                        <TableCell className="font-medium">{order.$id ? order.$id.substring(0, 8) : 'N/A'}</TableCell>
                        <TableCell>
                          {(() => {
                            try {
                              const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
                              return `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() || `Customer ${order.userId?.substring(0, 8)}`;
                            } catch (e) {
                              return `Customer ${order.userId?.substring(0, 8)}`;
                            }
                          })()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            try {
                              const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
                              if (shippingAddress) {
                                const addressParts = [];
                                if (shippingAddress.address) addressParts.push(shippingAddress.address);
                                if (shippingAddress.apartment) addressParts.push(`${shippingAddress.apartment}`);
                                if (shippingAddress.city) addressParts.push(shippingAddress.city);
                                if (shippingAddress.postalCode) addressParts.push(shippingAddress.postalCode);
                                return addressParts.length > 0 ? addressParts.join(', ') : 'No address provided';
                              }
                              return 'No address provided';
                            } catch (e) {
                              return 'Address data unavailable';
                            }
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {(() => {
                              try {
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                if (Array.isArray(items)) {
                                  return items.map((item: any, index: number) => (
                                    <div key={index} className="text-sm">
                                      {item.productName} × {item.quantity}
                                      <div className="text-muted-foreground text-xs">{item.size}, {item.color}</div>
                                    </div>
                                  ));
                                }
                              } catch (e) {
                                console.error('Error parsing items:', e);
                              }
                              return <div className="text-sm text-muted-foreground">{Array.isArray(order.items) ? `${order.items.length} items` : 'Items data unavailable'}</div>;
                            })()}
                          </div>
                        </TableCell>
                        <TableCell>₹{Number(order.total || 0).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(order.status || 'pending')}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.$createdAt ? new Date(order.$createdAt).toLocaleDateString() : 'Unknown Date'}
                            <div className="text-muted-foreground text-xs">{order.$createdAt ? new Date(order.$createdAt).toLocaleTimeString() : 'Unknown Time'}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost" disabled={updatingOrders.has(order.$id)}>
                                {updatingOrders.has(order.$id) ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'confirmed')} disabled={updatingOrders.has(order.$id)}>Confirm Order</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'processing')} disabled={updatingOrders.has(order.$id)}>Set Processing</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'shipped')} disabled={updatingOrders.has(order.$id)}>Mark Shipped</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'delivered')} disabled={updatingOrders.has(order.$id)}>Mark Delivered</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'cancelled')} disabled={updatingOrders.has(order.$id)} className="text-red-600 focus:text-red-600">Cancel Order</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'refunded')} disabled={updatingOrders.has(order.$id)} className="text-gray-600 focus:text-gray-600">Mark Refunded</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
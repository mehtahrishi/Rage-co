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

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Fetch real order data using AdminService
        const fetchedOrders = await AdminService.getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data if API fails
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Update order status using AdminService
      const updatedOrder = await AdminService.updateOrderStatus(orderId, newStatus);
      
      // Update local state to reflect the change
      setOrders(orders.map(order => 
        order.$id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
      ));
      
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.$id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button>Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading orders...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.$id}>
                    <TableCell className="font-medium">{order.$id.substring(0, 8)}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.userEmail}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="text-sm">
                            {item.productName} × {item.quantity}
                            <div className="text-muted-foreground text-xs">
                              {item.size}, {item.color}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>₹{order.total.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <div className="text-muted-foreground text-xs">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'pending')}>
                            Set Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'processing')}>
                            Set Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'shipped')}>
                            Set Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'delivered')}>
                            Set Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.$id, 'cancelled')}>
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
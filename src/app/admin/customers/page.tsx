'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MoreHorizontal, Mail } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Fetch real user data from our API route
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        if (data.success) {
          // Fetch orders to calculate order count and total spent for each customer
          const ordersResponse = await fetch('/api/admin/orders');
          const ordersData = await ordersResponse.json();
          
          let customerOrderStats: { [key: string]: { orders: number; totalSpent: number } } = {};
          
          if (ordersData.success) {
            // Calculate order stats for each customer
            ordersData.data.forEach((order: any) => {
              const userId = order.userId;
              if (!customerOrderStats[userId]) {
                customerOrderStats[userId] = { orders: 0, totalSpent: 0 };
              }
              customerOrderStats[userId].orders += 1;
              customerOrderStats[userId].totalSpent += order.total || 0;
            });
          }
          
          // Enhance customer data with order statistics
          const customersWithStats = data.data.map((customer: any) => ({
            ...customer,
            orders: customerOrderStats[customer.$id]?.orders || 0,
            totalSpent: customerOrderStats[customer.$id]?.totalSpent || 0,
          }));
          
          setCustomers(customersWithStats);
        } else {
          console.error('Error fetching customers:', data.error);
          // Fallback to mock data if API fails
          setCustomers(getMockUsers());
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        // Fallback to mock data if API fails
        setCustomers(getMockUsers());
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const getMockUsers = () => {
    return [
      {
        $id: 'user1',
        name: 'Olivia Martin',
        email: 'olivia.martin@example.com',
        phone: '+91 98765 43210',
        status: 'active',
        joinDate: '2023-01-15',
        orders: 12,
        totalSpent: 12500,
        avatar: 'https://picsum.photos/seed/olivia/100/100'
      },
      {
        $id: 'user2',
        name: 'Jackson Lee',
        email: 'jackson.lee@example.com',
        phone: '+91 98765 43211',
        status: 'active',
        joinDate: '2023-02-20',
        orders: 5,
        totalSpent: 4200,
        avatar: 'https://picsum.photos/seed/jackson/100/100'
      },
      {
        $id: 'user3',
        name: 'Isabella Nguyen',
        email: 'isabella.nguyen@example.com',
        phone: '+91 98765 43212',
        status: 'inactive',
        joinDate: '2023-03-10',
        orders: 3,
        totalSpent: 1800,
        avatar: 'https://picsum.photos/seed/isabella/100/100'
      },
      {
        $id: 'user4',
        name: 'William Kim',
        email: 'william.kim@example.com',
        phone: '+91 98765 43213',
        status: 'active',
        joinDate: '2023-04-05',
        orders: 8,
        totalSpent: 7600,
        avatar: 'https://picsum.photos/seed/william/100/100'
      },
      {
        $id: 'user5',
        name: 'Sofia Davis',
        email: 'sofia.davis@example.com',
        phone: '+91 98765 43214',
        status: 'active',
        joinDate: '2023-05-12',
        orders: 15,
        totalSpent: 18900,
        avatar: 'https://picsum.photos/seed/sofia/100/100'
      }
    ];
  };



  const sendEmailToUser = (email: string, name: string) => {
    // Create a mailto link that opens the default email client
    const subject = encodeURIComponent(`Message from RAGE Administration`);
    const body = encodeURIComponent(`Hi ${name},

We're reaching out from RAGE Administration.

Best regards,
The RAGE Team`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine avatar background and text color based on theme
  const getAvatarColors = () => {
    return theme === 'dark' 
      ? { background: 'bg-gray-800', text: 'text-white' }
      : { background: 'bg-gray-200', text: 'text-gray-800' };
  };

  const avatarColors = getAvatarColors();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Customers</CardTitle>
              <CardDescription>View and manage your customer list.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="w-full sm:w-auto">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading customers...</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.$id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={customer.avatar || undefined} alt={customer.name} />
                          <AvatarFallback className={`${avatarColors.background} ${avatarColors.text}`}>
                            {customer.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => sendEmailToUser(customer.email, customer.name)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm">{(customer.prefs && customer.prefs.phone) || 'N/A'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Join Date:</span>
                        <span className="text-sm">{customer.$createdAt ? new Date(customer.$createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Orders:</span>
                        <span className="text-sm">{customer.orders || 0}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Total Spent:</span>
                        <span className="font-medium">₹{(customer.totalSpent || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Customer</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[120px]">Phone</TableHead>
                      <TableHead className="min-w-[120px]">Join Date</TableHead>
                      <TableHead className="min-w-[80px]">Orders</TableHead>
                      <TableHead className="min-w-[120px]">Total Spent</TableHead>
                      <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.$id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={customer.avatar || undefined} alt={customer.name} />
                              <AvatarFallback className={`${avatarColors.background} ${avatarColors.text}`}>
                                {customer.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{(customer.prefs && customer.prefs.phone) || 'N/A'}</TableCell>
                        <TableCell>{customer.$createdAt ? new Date(customer.$createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{customer.orders || 0}</TableCell>
                        <TableCell>₹{(customer.totalSpent || 0).toLocaleString()}</TableCell>
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
                              <DropdownMenuItem onClick={() => sendEmailToUser(customer.email, customer.name)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
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
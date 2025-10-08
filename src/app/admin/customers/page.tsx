'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
          setCustomers(data.data);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading customers...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(customer.status || 'active')}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </main>
  );
}
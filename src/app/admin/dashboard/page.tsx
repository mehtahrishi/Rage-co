'use client';
import { Activity, ArrowUpRight, CircleUser, CreditCard, DollarSign, Menu, Package2, Search, Users, } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage, } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { AdminService } from '@/services/admin';
import { ProductService } from '@/services/database';

export default function Dashboard() {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0); // New state for total products
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching dashboard stats...');
                // Fetch real dashboard statistics using AdminService
                const stats = await AdminService.getDashboardStats();
                console.log('Received stats:', stats);

                setTotalRevenue(stats.totalRevenue);
                setTotalOrders(stats.totalSales);
                setTotalUsers(stats.totalUsers);

                // Fetch total product count
                const productCount = await ProductService.countProducts();
                setTotalProducts(productCount);

                // Fetch recent products sorted by creation date (newest first)
                const products = await ProductService.getProducts({
                    limit: 7,
                    sortBy: '$createdAt',
                    sortOrder: 'desc'
                });
                setRecentProducts(products);

                // Generate simple chart data using the stats we just fetched
                const chartData = generateSimpleChartData(stats.orders || []);
                setChartData(chartData);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
                // Fallback to mock data if API fails
                setTotalRevenue(45231890);
                setTotalOrders(12234);
                setTotalUsers(2350);
                setTotalProducts(4); // Fallback to 4 products
                setRecentProducts(getMockProducts());
                setChartData(getMockChartData());
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Generate simple chart data showing total revenue and orders
    // Generate simple chart data showing total revenue and orders
    const generateSimpleChartData = (ordersData: any[]) => {
        // Simple 12 months from Jan to Dec
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Initialize data structure
        const data = months.map(month => ({
            name: month,
            orders: 0,
            revenue: 0
        }));

        if (!ordersData || !Array.isArray(ordersData)) {
            return data;
        }

        const currentYear = new Date().getFullYear();

        ordersData.forEach(order => {
            if (!order.$createdAt) return;

            const date = new Date(order.$createdAt);
            // Filter for current year
            if (date.getFullYear() === currentYear) {
                const monthIndex = date.getMonth(); // 0-11
                data[monthIndex].orders += 1;
                data[monthIndex].revenue += (order.total || 0);
            }
        });

        return data;
    };

    const getMockChartData = () => {
        return [
            { name: 'Jan', orders: 0, revenue: 0 },
            { name: 'Feb', orders: 0, revenue: 0 },
            { name: 'Mar', orders: 0, revenue: 0 },
            { name: 'Apr', orders: 0, revenue: 0 },
            { name: 'May', orders: 0, revenue: 0 },
            { name: 'Jun', orders: 0, revenue: 0 },
            { name: 'Jul', orders: 0, revenue: 0 },
            { name: 'Aug', orders: 0, revenue: 0 },
            { name: 'Sep', orders: 0, revenue: 0 },
            { name: 'Oct', orders: 11, revenue: 8060.05 },
            { name: 'Nov', orders: 0, revenue: 0 },
            { name: 'Dec', orders: 0, revenue: 0 },
        ];
    };

    const getMockProducts = () => {
        return [
            {
                name: 'Oversized Black Gothic T-Shirt',
                price: 399,
                originalPrice: 499
            },
            {
                name: 'Distressed Denim Jacket',
                price: 1299,
                originalPrice: 1599
            },
            {
                name: 'Cargo Utility Pants',
                price: 899,
                originalPrice: 1099
            },
            {
                name: 'Graphic Print Hoodie',
                price: 699,
                originalPrice: 899
            }
        ];
    };

    if (loading) {
        return (
            <div className="flex min-h-screen w-full flex-col">
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen w-full flex-col">
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
                        <p>{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-4"
                        >
                            Retry
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Total from all orders
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Orders
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                Total orders placed
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <Package2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                Products available
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Orders & Revenue Overview</CardTitle>
                            <CardDescription>
                                Orders count and revenue generated over the last 12 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        yAxisId="orders"
                                        orientation="left"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <YAxis
                                        yAxisId="revenue"
                                        orientation="right"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (name === 'Revenue') {
                                                return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                                            }
                                            return [value, 'Orders'];
                                        }}
                                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        yAxisId="orders"
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={false}
                                        name="Orders"
                                    />
                                    <Line
                                        yAxisId="revenue"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--chart-2))"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={false}
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Products</CardTitle>
                            <CardDescription>
                                Latest additions to your inventory
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">{product.name}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-foreground">₹{product.price}</p>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <p className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
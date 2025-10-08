'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product-card';
import { ProductService } from '@/services/database';
import type { Product, Order, Address } from '@/lib/types';


// Mock Data
const orders: any[] = [];
const addresses: Address[] = [];
const wishlist: Product[] = [];


export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
          My Account
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your orders, profile, and more.</p>
      </header>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        {/* Order History */}
        <TabsContent value="orders" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>View the history of your past purchases.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {orders.length > 0 ? orders.map((order, index) => (
                <div key={order.id}>
                    <div className="p-6 rounded-lg border">
                        <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                            <div>
                                <h3 className="font-semibold">Order #{order.id}</h3>
                                <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                            </div>
                             <div>
                                <p className="font-semibold">Total: ₹{order.total.toFixed(2)}</p>
                                <p className="text-sm text-right text-green-600 font-medium">{order.status}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="mt-4 space-y-2">
                             {order.items.map((item: Product) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{item.name}</span>
                                    <span>₹{item.price.toFixed(2)}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                     {index < orders.length - 1 && <Separator className="my-8"/>}
                </div>
              )) : <p>You have no past orders.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist */}
        <TabsContent value="wishlist" className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Your Wishlist</CardTitle>
                    <CardDescription>Products you're keeping an eye on.</CardDescription>
                </CardHeader>
                <CardContent>
                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
                            {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    ) : <p>Your wishlist is empty.</p>}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses" className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your shipping addresses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {addresses.length > 0 ? addresses.map(address => (
                        <div key={address.id} className="p-6 rounded-lg border flex justify-between items-start">
                           <div>
                                <h3 className="font-semibold">{address.name} {address.isDefault && <span className="text-xs text-muted-foreground font-normal">(Default)</span>}</h3>
                                <p className="text-sm text-muted-foreground">{address.address}</p>
                           </div>
                           <div className="flex gap-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                           </div>
                        </div>
                    )) : <p>You have no saved addresses.</p>}
                </CardContent>
                <CardFooter>
                    <Button>Add New Address</Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

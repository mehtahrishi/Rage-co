import { Client, Databases, Query } from 'appwrite';
import { CONFIG, databases } from '@/lib/appwrite';
import type { Order } from '@/lib/types';

export class OrderService {
  // Get orders for the current user
  static async getUserOrders(): Promise<Order[]> {
    try {
      // Use the existing authenticated databases client
      const ordersResponse = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.ORDERS,
        [] // We'll filter on the client side or use a different approach
      );

      return ordersResponse.documents as unknown as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }
  
  // Get orders for the current user via API route
  static async getMyOrders(): Promise<Order[]> {
    try {
      const response = await fetch('/api/user/orders');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }
}
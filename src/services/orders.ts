import { databases, CONFIG, ID, Query } from '@/lib/appwrite';
import type { Order, OrderItem } from '@/lib/types';

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'cod' | 'upi' | 'qr';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export class OrderService {
  // Create a new order
  static async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const order = await databases.createDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.ORDERS,
        ID.unique(),
        {
          userId: orderData.userId,
          items: JSON.stringify(orderData.items),
          total: orderData.total,
          paymentMethod: orderData.paymentMethod,
          status: 'pending',
          shippingAddress: JSON.stringify(orderData.shippingAddress)
        }
      );

      return order as unknown as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get orders for the current user
  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const ordersResponse = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.ORDERS,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );

      return ordersResponse.documents.map(doc => ({
        ...doc,
        items: JSON.parse(doc.items as string),
        shippingAddress: JSON.parse(doc.shippingAddress as string)
      })) as unknown as Order[];
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
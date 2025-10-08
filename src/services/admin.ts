import type { Order } from '@/lib/types';

// Admin Database Operations
export class AdminService {
  
  // Get all users (this calls our API route)
  static async getUsers() {
    try {
      console.log('Fetching users from API...');
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      console.log('Users API response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get all orders with user information
  static async getOrders() {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get dashboard statistics (revenue and sales count from orders)
  static async getDashboardStats() {
    try {
      console.log('Fetching dashboard stats...');
      
      // Fetch orders data from API
      console.log('Fetching orders...');
      const ordersData = await AdminService.getOrders();
      console.log('Orders data:', ordersData);
      
      let totalRevenue = 0;
      let totalSales = 0;
      
      ordersData.forEach((order: any) => {
        totalRevenue += order.total || 0;
        totalSales += 1;
      });
      
      // Fetch actual user count from Appwrite
      console.log('Fetching users...');
      const usersResponse = await AdminService.getUsers();
      console.log('Users response:', usersResponse);
      const totalUsers = usersResponse.total || 0;
      console.log('Total users:', totalUsers);
      
      // Placeholder for active users (would require session data)
      const activeUsers = 573; // Placeholder
      
      const stats = {
        totalRevenue,
        totalSales,
        totalUsers,
        activeUsers
      };
      
      console.log('Dashboard stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update order status');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}
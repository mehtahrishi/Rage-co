import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { CONFIG } from '@/lib/appwrite';

// This route requires authentication and should only be accessible by admins
export async function GET(request: NextRequest) {
  try {
    // Initialize Appwrite server SDK
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!); // Server API key

    const databases = new Databases(client);

    // Fetch orders from Appwrite
    const ordersResponse = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.ORDERS,
      [] // Add pagination or filters as needed
    );

    // Transform orders to include user information
    const ordersWithUsers = await Promise.all(
      ordersResponse.documents.map(async (order: any) => {
        try {
          // Fetch user details for each order
          // Note: This is a simplified approach. In a production app, you might want to optimize this
          // by fetching all users at once and mapping them, or by storing user name/email in the order
          return {
            ...order,
            userName: 'Customer', // Placeholder - in a real app, fetch from user collection
            userEmail: `${order.userId}@example.com`, // Placeholder
          };
        } catch (error) {
          return {
            ...order,
            userName: 'Unknown',
            userEmail: 'Unknown',
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: ordersWithUsers,
      total: ordersResponse.total
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Update order status
export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'orderId and status are required',
        },
        { status: 400 }
      );
    }

    // Initialize Appwrite server SDK
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!); // Server API key

    const databases = new Databases(client);

    // Update order status
    const updatedOrder = await databases.updateDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.ORDERS,
      orderId,
      {
        status,
        updatedAt: new Date().toISOString()
      }
    );

    return NextResponse.json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
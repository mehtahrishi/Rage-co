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
    console.log('PUT request received for order update');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { orderId, status } = body;
    
    if (!orderId || !status) {
      console.log('Missing required fields:', { orderId, status });
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'orderId and status are required',
        },
        { status: 400 }
      );
    }

    console.log('Environment check:', {
      endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ? 'Set' : 'Missing',
      project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? 'Set' : 'Missing',
      apiKey: process.env.APPWRITE_API_KEY ? 'Set' : 'Missing'
    });

    // Initialize Appwrite server SDK
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!); // Server API key

    const databases = new Databases(client);

    console.log(`Attempting to update order ${orderId} with status: ${status}`);
    console.log('CONFIG:', { DATABASE_ID: CONFIG.DATABASE_ID, ORDERS_COLLECTION: CONFIG.COLLECTIONS.ORDERS });
    
    // First, try to get the current order to see its structure
    try {
      const currentOrder = await databases.getDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.ORDERS,
        orderId
      );
      console.log('Current order structure:', Object.keys(currentOrder));
    } catch (getError) {
      console.log('Could not fetch current order:', getError);
    }
    
    // Update order status
    const updatedOrder = await databases.updateDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.ORDERS,
      orderId,
      {
        status: status
      }
    );
    
    console.log('Order updated successfully:', updatedOrder.$id);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Order ${orderId} status updated to ${status}`
    });

  } catch (error: any) {
    console.error('Detailed error updating order:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error code:', error.code);
    console.error('Error type from Appwrite:', error.type);
    
    // More specific error handling
    let errorMessage = 'Failed to update order';
    let statusCode = 500;
    
    if (error.code === 404) {
      errorMessage = 'Order not found';
      statusCode = 404;
    } else if (error.code === 401 || error.code === 403) {
      errorMessage = 'Insufficient permissions to update order';
      statusCode = 403;
    } else if (error.code === 400) {
      errorMessage = 'Invalid request - the status field may not exist in the collection';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.message || 'Unknown error',
        code: error.code,
        type: error.type,
        orderId,
        status
      },
      { status: statusCode }
    );
  }
}
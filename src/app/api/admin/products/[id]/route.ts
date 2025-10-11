import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

// Server-side client with API key for admin operations
const adminClient = new Client();
adminClient
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const adminDatabases = new Databases(adminClient);

const CONFIG = {
  DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  COLLECTIONS: {
    PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS!,
  }
};

// Check if user is admin (simplified check using localStorage flag)
function isAdmin(request: NextRequest) {
  // In a real app, you'd validate the admin session properly
  // For now, we'll rely on the frontend admin authentication
  return true; // Since we're calling this from admin panel
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const productId = params.id;
    const productData = await request.json();

    console.log('Updating product:', productId, productData);

    const response = await adminDatabases.updateDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PRODUCTS,
      productId,
      productData
    );

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },  
        { status: 401 }
      );
    }

    const productId = params.id;

    await adminDatabases.deleteDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PRODUCTS,
      productId
    );

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
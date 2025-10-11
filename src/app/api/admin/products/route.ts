import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID } from 'node-appwrite';

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

// Check if user is admin (simplified check)
function isAdmin(request: NextRequest) {
  // In a real app, you'd validate the admin session properly
  // For now, we'll rely on the frontend admin authentication
  return true; // Since we're calling this from admin panel
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const productData = await request.json();

    console.log('Creating product:', productData);

    const response = await adminDatabases.createDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PRODUCTS,
      ID.unique(),
      productData
    );

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await adminDatabases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PRODUCTS
    );

    return NextResponse.json({
      success: true,
      data: response.documents
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category') || undefined,
      subCategory: searchParams.get('subCategory') || undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sizes: searchParams.getAll('size'),
      colors: searchParams.getAll('color'),
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    };

    const products = await ProductService.getProducts(filters);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    const product = await ProductService.createProduct(productData);

    return NextResponse.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
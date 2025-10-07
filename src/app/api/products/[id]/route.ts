import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await ProductService.getProduct(params.id);

    return NextResponse.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error('Product API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Product not found',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productData = await request.json();
    
    const product = await ProductService.updateProduct(params.id, productData);

    return NextResponse.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error('Update product API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ProductService.deleteProduct(params.id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Delete product API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
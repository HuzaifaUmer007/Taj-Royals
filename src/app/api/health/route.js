import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Taj Royals API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      subcategories: '/api/subcategories',
      reviews: '/api/reviews',
      orders: '/api/orders'
    }
  });
}

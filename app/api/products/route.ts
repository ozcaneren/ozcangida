import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { authenticateUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof NextResponse) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching products for user:', user.userId); // Debug log

    const products = await Product.find({ userId: user.userId }).sort({ createdAt: -1 });
    
    console.log('Found products:', products); // Debug log

    return Response.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error); // Error log
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof NextResponse) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received product data:', body); // Debug log

    const product = await Product.create({
      title: body.title,
      price: body.price,
      category: body.category || 'Genel', // Varsayılan değer ekleyelim
      brand: body.brand || 'Genel', // Varsayılan değer ekleyelim
      userId: user.userId,
    });

    console.log('Created product:', product); // Debug log
    return Response.json(product);
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

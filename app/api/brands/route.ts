import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Brand from '@/models/Brand';
import { authenticateUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof Response) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brands = await Brand.find({ userId: user.userId });
    return Response.json(brands);
  } catch (error) {
    console.error('Error in GET /api/brands:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof Response) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    const brand = await Brand.create({
      name,
      userId: user.userId
    });

    return Response.json(brand);
  } catch (error) {
    console.error('Error in POST /api/brands:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
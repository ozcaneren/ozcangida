import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { authenticateUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof Response) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await Category.find({ userId: user.userId });
    return Response.json(categories);
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
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
    const category = await Category.create({
      name,
      userId: user.userId
    });

    return Response.json(category);
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
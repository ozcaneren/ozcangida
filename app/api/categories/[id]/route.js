import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { authenticateUser } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof Response) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await Category.findOneAndDelete({ _id: id, userId: user.userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
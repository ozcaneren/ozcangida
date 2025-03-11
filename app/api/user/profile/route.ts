import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { authenticateUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);

    if (!user || typeof user === 'string' || user instanceof Response) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await User.findById(user.userId).select('name email avatarUrl -_id');
    
    if (!userData) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(userData);
  } catch (error) {
    console.error('Error in GET /api/user/profile:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof Response) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, avatarUrl } = await request.json();
    
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { 
        name,
        avatarUrl: avatarUrl || 'https://ui-avatars.com/api/?background=random'
      },
      { new: true }
    ).select('name email avatarUrl -_id');

    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(updatedUser);
  } catch (error) {
    console.error('Error in PUT /api/user/profile:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
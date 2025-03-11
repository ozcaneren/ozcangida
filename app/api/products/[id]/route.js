import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { authenticateUser } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const user = await authenticateUser(req);
    const { id } = params;

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    return Response.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    return Response.json({ error: 'Error updating todo' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await authenticateUser(req);
    const { id } = params;

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Product.findByIdAndDelete(id);
    return Response.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Product delete error:', error);
    return Response.json({ error: 'Error deleting product' }, { status: 500 });
  }
} 
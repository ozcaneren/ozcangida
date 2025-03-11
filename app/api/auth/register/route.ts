import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, avatarUrl } = await request.json();

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'Bu email zaten kullanımda' }, { status: 400 });
    }

    // Şifre hash'leme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluşturma
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatarUrl: avatarUrl || 'https://ui-avatars.com/api/?background=random'
    });

    // Hassas bilgileri çıkarıp response döndürme
    const userResponse = {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl
    };

    return Response.json(userResponse);
  } catch (error) {
    console.error('Register error:', error);
    return Response.json({ error: 'Kayıt sırasında bir hata oluştu' }, { status: 500 });
  }
}

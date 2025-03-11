import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Gelen token'ı kontrol et
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        // Token geçerliyse kullanıcı zaten giriş yapmış demektir
        jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        return Response.json(
          { message: 'Already logged in', redirect: '/todos' },
          { status: 200 }
        );
      } catch {
        // Token geçersizse normal login işlemine devam et
      }
    }

    await connectDB();
    
    const { email, password } = await request.json();

    // Email ve şifre kontrolü
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bulma
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json(
        { error: 'Geçersiz şifre' },
        { status: 401 }
      );
    }

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Kullanıcı bilgilerini döndürürken avatarUrl'i de ekleyelim
    const userData = {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl
    };

    return Response.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

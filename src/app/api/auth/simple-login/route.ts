import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create user if doesn't exist (for demo)
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await db.user.create({
        data: {
          email,
          name: email.split('@')[0],
          password: hashedPassword,
        },
      });

      // Set cookie
      cookies().set('userId', newUser.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ 
        success: true, 
        user: { id: newUser.id, email: newUser.email, name: newUser.name } 
      });
    }

    // For demo/development: Accept any password for existing users
    // In production, you would check: const isValid = await bcrypt.compare(password, user.password || '');
    const isValid = true; // DEMO MODE - accepts any password

    // Set cookie
    cookies().set('userId', user.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
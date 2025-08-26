import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);

    // Demo account check (for development)
    if (validatedData.email === 'demo@qrmaster.com' && validatedData.password === 'demo123') {
      try {
        // Check if demo user exists, create if not
        let demoUser = await db.user.findUnique({
          where: { email: 'demo@qrmaster.com' }
        });

        if (!demoUser) {
          // Create demo user
          const hashedPassword = await bcrypt.hash('demo123', 12);
          demoUser = await db.user.create({
            data: {
              id: 'demo-user-id',
              email: 'demo@qrmaster.com',
              name: 'Demo User',
              password: hashedPassword,
            },
          });
        }

        const response = NextResponse.json({ 
          success: true, 
          user: {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
          }
        });
        
        response.cookies.set('userId', demoUser.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        
        return response;
      } catch (error) {
        console.error('Demo user creation error:', error);
        // Fallback to mock demo user
        const response = NextResponse.json({ 
          success: true, 
          user: {
            id: 'demo-user-id',
            email: 'demo@qrmaster.com',
            name: 'Demo User',
          }
        });
        
        response.cookies.set('userId', 'demo-user-id', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        
        return response;
      }
    }

    // Real user authentication
    const user = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Set authentication cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
      },
    });

    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Auth endpoint' });
}
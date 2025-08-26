import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role } = body;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // For now, we'll simulate team invitation without database
    // In production, you would create a TeamInvitation record
    const mockInvitation = {
      id: 'inv_' + Math.random().toString(36).substring(2, 15),
      email,
      role: role || 'VIEWER',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // In production, you would send an email here
    console.log(`Invitation sent to ${email} with role ${role}`);

    return NextResponse.json({
      success: true,
      invitation: {
        id: mockInvitation.id,
        email: mockInvitation.email,
        role: mockInvitation.role,
        status: mockInvitation.status,
      },
    });
  } catch (error) {
    console.error('Error creating team invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

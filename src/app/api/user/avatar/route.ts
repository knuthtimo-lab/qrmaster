import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
    }

    // In production, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Generate a public URL
    // 3. Update the user's image field

    // For now, we'll simulate the upload
    const mockImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

    // Update user's image
    await db.user.update({
      where: { id: userId },
      data: { image: mockImageUrl },
    });

    return NextResponse.json({
      success: true,
      imageUrl: mockImageUrl,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@qrmaster.com' },
    update: {},
    create: {
      email: 'demo@qrmaster.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('Created demo user:', user.email);

  // Create demo QR codes
  const qrCodes = [
    {
      title: 'Support Phone',
      contentType: 'PHONE' as const,
      content: { phone: '+1-555-0123' },
      tags: ['support', 'contact'],
      slug: 'support-phone-demo',
    },
    {
      title: 'Event Details',
      contentType: 'URL' as const,
      content: { url: 'https://example.com/event-2025' },
      tags: ['event', 'conference'],
      slug: 'event-details-demo',
    },
    {
      title: 'Product Demo',
      contentType: 'URL' as const,
      content: { url: 'https://example.com/product-demo' },
      tags: ['product', 'demo'],
      slug: 'product-demo-qr',
    },
    {
      title: 'Company Website',
      contentType: 'URL' as const,
      content: { url: 'https://company.example.com' },
      tags: ['website', 'company'],
      slug: 'company-website-qr',
    },
    {
      title: 'Contact Email',
      contentType: 'EMAIL' as const,
      content: { email: 'contact@company.com', subject: 'Inquiry' },
      tags: ['contact', 'email'],
      slug: 'contact-email-qr',
    },
    {
      title: 'Event Details',
      contentType: 'URL' as const,
      content: { url: 'https://example.com/event-duplicate' },
      tags: ['event', 'duplicate'],
      slug: 'event-details-dup',
    },
  ];

  const baseDate = new Date('2025-08-07T10:00:00Z');

  for (let i = 0; i < qrCodes.length; i++) {
    const qrData = qrCodes[i];
    const createdAt = new Date(baseDate.getTime() + i * 60000); // 1 minute apart

    await prisma.qRCode.upsert({
      where: { slug: qrData.slug },
      update: {},
      create: {
        userId: user.id,
        title: qrData.title,
        type: 'DYNAMIC',
        contentType: qrData.contentType,
        content: qrData.content,
        tags: qrData.tags,
        status: 'ACTIVE',
        style: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cornerStyle: 'square',
          size: 200,
        },
        slug: qrData.slug,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  console.log('Created 6 demo QR codes');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
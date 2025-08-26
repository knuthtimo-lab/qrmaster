import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create a mock database client for when the real database is not available
class MockPrismaClient {
  private mockData = {
    users: new Map(),
    qrCodes: new Map(),
    scans: new Map(),
  };

  constructor() {
    // Initialize with default mock data
    this.mockData.users.set('demo-user-id', {
      id: 'demo-user-id',
      email: 'demo@qrmaster.com',
      name: 'Demo User',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // demo123
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.mockData.qrCodes.set('1', {
      id: '1',
      userId: 'demo-user-id',
      title: 'Support Phone',
      type: 'DYNAMIC',
      contentType: 'PHONE',
      content: { phone: '+1234567890' },
      tags: ['support', 'phone'],
      status: 'ACTIVE',
      style: {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        cornerStyle: 'square',
        size: 200,
      },
      slug: 'support-phone-demo',
      createdAt: new Date('2025-08-07T10:00:00Z'),
      updatedAt: new Date('2025-08-07T10:00:00Z'),
    });

    this.mockData.qrCodes.set('2', {
      id: '2',
      userId: 'demo-user-id',
      title: 'Event Details',
      type: 'DYNAMIC',
      contentType: 'URL',
      content: { url: 'https://example.com/event' },
      tags: ['event', 'marketing'],
      status: 'ACTIVE',
      style: {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        cornerStyle: 'square',
        size: 200,
      },
      slug: 'event-details-demo',
      createdAt: new Date('2025-08-07T10:01:00Z'),
      updatedAt: new Date('2025-08-07T10:01:00Z'),
    });
  }

  get user() {
    return {
      findUnique: async ({ where }: any) => {
        if (where.email) {
          return Array.from(this.mockData.users.values()).find(user => user.email === where.email) || null;
        }
        return this.mockData.users.get(where.id) || null;
      },
      findFirst: async ({ where }: any) => {
        if (where.email) {
          return Array.from(this.mockData.users.values()).find(user => user.email === where.email) || null;
        }
        return this.mockData.users.get(where.id) || null;
      },
      create: async ({ data }: any) => {
        const user = {
          id: Math.random().toString(36).substring(2, 15),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.mockData.users.set(user.id, user);
        return user;
      },
      update: async ({ where, data }: any) => {
        const user = this.mockData.users.get(where.id);
        if (user) {
          const updatedUser = { ...user, ...data, updatedAt: new Date() };
          this.mockData.users.set(where.id, updatedUser);
          return updatedUser;
        }
        return null;
      },
    };
  }

  get qRCode() {
    return {
      findMany: async ({ where, include, orderBy }: any) => {
        let results = Array.from(this.mockData.qrCodes.values())
          .filter(qr => !where || qr.userId === where.userId);
        
        // Add _count if requested
        if (include?._count) {
          results = results.map(qr => ({
            ...qr,
            _count: {
              scans: Array.from(this.mockData.scans.values()).filter(scan => scan.qrId === qr.id).length
            }
          }));
        }
        
        // Sort if orderBy is specified
        if (orderBy?.createdAt === 'desc') {
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
        return results;
      },
      findUnique: async ({ where }: any) => {
        if (where.slug) {
          return Array.from(this.mockData.qrCodes.values()).find(qr => qr.slug === where.slug) || null;
        }
        return this.mockData.qrCodes.get(where.id) || null;
      },
      findFirst: async ({ where }: any) => {
        if (where.slug) {
          return Array.from(this.mockData.qrCodes.values()).find(qr => qr.slug === where.slug) || null;
        }
        return Array.from(this.mockData.qrCodes.values())
          .find(qr => qr.id === where.id && qr.userId === where.userId) || null;
      },
      create: async ({ data }: any) => {
        const qrCode = {
          id: Math.random().toString(36).substring(2, 15),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.mockData.qrCodes.set(qrCode.id, qrCode);
        return qrCode;
      },
      update: async ({ where, data }: any) => {
        const qrCode = this.mockData.qrCodes.get(where.id);
        if (qrCode) {
          const updatedQR = { ...qrCode, ...data, updatedAt: new Date() };
          this.mockData.qrCodes.set(where.id, updatedQR);
          return updatedQR;
        }
        return null;
      },
      delete: async ({ where }: any) => {
        const qrCode = this.mockData.qrCodes.get(where.id);
        if (qrCode) {
          this.mockData.qrCodes.delete(where.id);
          return qrCode;
        }
        return null;
      },
    };
  }

  get qRScan() {
    return {
      findMany: async ({ where }: any) => {
        return Array.from(this.mockData.scans.values())
          .filter(scan => !where || scan.qrId === where.qrId);
      },
      create: async ({ data }: any) => {
        const scan = {
          id: Math.random().toString(36).substring(2, 15),
          ...data,
          ts: new Date(),
        };
        this.mockData.scans.set(scan.id, scan);
        return scan;
      },
    };
  }

  $connect() {
    return Promise.resolve();
  }

  $disconnect() {
    return Promise.resolve();
  }
}

// Initialize Prisma client
let prisma: PrismaClient | MockPrismaClient;

const databaseUrl = process.env.DATABASE_URL;

console.log('DATABASE_URL available:', !!databaseUrl);

if (databaseUrl) {
  try {
    prisma = globalThis.prisma || new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    if (process.env.NODE_ENV !== 'production') {
      globalThis.prisma = prisma;
    }
    console.log('Using real database (Supabase)');
  } catch (error) {
    console.log('Real database connection failed, using mock database');
    console.log('Error:', error);
    prisma = new MockPrismaClient() as any;
  }
} else {
  console.log('DATABASE_URL not found, using mock database');
  prisma = new MockPrismaClient() as any;
}

export { prisma as db };
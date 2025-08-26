// Global mock data storage
let mockQRCodes: any[] = [
  {
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
    scans: 42,
    createdAt: new Date('2025-08-07T10:00:00Z'),
    updatedAt: new Date('2025-08-07T10:00:00Z'),
  },
  {
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
    scans: 18,
    createdAt: new Date('2025-08-07T10:01:00Z'),
    updatedAt: new Date('2025-08-07T10:01:00Z'),
  },
];

export const getMockQRCodes = () => mockQRCodes;
export const addMockQRCode = (qrCode: any) => {
  mockQRCodes.push(qrCode);
  return qrCode;
};
export const updateMockQRCode = (id: string, data: any) => {
  const index = mockQRCodes.findIndex(qr => qr.id === id);
  if (index !== -1) {
    mockQRCodes[index] = { ...mockQRCodes[index], ...data, updatedAt: new Date() };
    return mockQRCodes[index];
  }
  return null;
};
export const deleteMockQRCode = (id: string) => {
  const index = mockQRCodes.findIndex(qr => qr.id === id);
  if (index !== -1) {
    const deleted = mockQRCodes[index];
    mockQRCodes.splice(index, 1);
    return deleted;
  }
  return null;
};

import crypto from 'crypto';
import { env } from './env';

/**
 * Hash an IP address for privacy
 * Uses a salt from environment variables to ensure consistent hashing
 */
export function hashIP(ip: string): string {
  const salt = env.IP_SALT || 'default-salt-change-in-production';
  return crypto
    .createHash('sha256')
    .update(ip + salt)
    .digest('hex')
    .substring(0, 16); // Use first 16 chars for storage efficiency
}

/**
 * Generate a random slug for QR codes
 */
export function generateSlug(title?: string): string {
  const base = title 
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20)
    : 'qr';
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
  return 'qrm_' + crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a password (for comparison with bcrypt hashed passwords)
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}
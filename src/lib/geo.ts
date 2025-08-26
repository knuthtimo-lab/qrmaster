export function getCountryFromHeaders(headers: Headers): string | null {
  // Try Vercel's country header first
  const vercelCountry = headers.get('x-vercel-ip-country');
  if (vercelCountry) {
    return vercelCountry;
  }

  // Try Cloudflare's country header
  const cfCountry = headers.get('cf-ipcountry');
  if (cfCountry && cfCountry !== 'XX') {
    return cfCountry;
  }

  // Fallback to other common headers
  const country = headers.get('x-country-code') || headers.get('x-forwarded-country');
  return country || null;
}

export function parseUserAgent(userAgent: string | null): { device: string | null; os: string | null } {
  if (!userAgent) {
    return { device: null, os: null };
  }

  let device: string | null = null;
  let os: string | null = null;

  // Detect device
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    device = 'mobile';
  } else if (/Tablet|iPad/.test(userAgent)) {
    device = 'tablet';
  } else {
    device = 'desktop';
  }

  // Detect OS
  if (/Windows/.test(userAgent)) {
    os = 'Windows';
  } else if (/Mac OS X|macOS/.test(userAgent)) {
    os = 'macOS';
  } else if (/Linux/.test(userAgent)) {
    os = 'Linux';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/iOS|iPhone|iPad/.test(userAgent)) {
    os = 'iOS';
  }

  return { device, os };
}
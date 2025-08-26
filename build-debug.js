#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Starting build debug process...');

// Check if we're in a build environment
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXT_PHASE:', process.env.NEXT_PHASE);
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('- NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

// Check if Prisma schema exists
if (fs.existsSync('./prisma/schema.prisma')) {
  console.log('✅ Prisma schema found');
} else {
  console.log('❌ Prisma schema not found');
  process.exit(1);
}

// Check if package.json exists
if (fs.existsSync('./package.json')) {
  console.log('✅ package.json found');
} else {
  console.log('❌ package.json not found');
  process.exit(1);
}

// Try to generate Prisma client
try {
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.log('❌ Prisma generation failed:', error.message);
  process.exit(1);
}

// Try to run TypeScript check
try {
  console.log('🔄 Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed');
} catch (error) {
  console.log('❌ TypeScript check failed:', error.message);
  process.exit(1);
}

console.log('✅ All checks passed, ready for build');

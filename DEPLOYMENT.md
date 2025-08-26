# Deployment Guide for QR Master

## Vercel Deployment

### Environment Variables Required

Set these environment variables in your Vercel project settings:

#### Required Variables:
- `DATABASE_URL` - Your PostgreSQL database connection string
- `DIRECT_URL` - Direct database connection (same as DATABASE_URL for most cases)
- `NEXTAUTH_SECRET` - A secure random string for NextAuth
- `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)

#### Optional Variables:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `REDIS_URL` - Redis connection string
- `IP_SALT` - Salt for IP hashing
- `ENABLE_DEMO` - Set to "true" to enable demo mode
- `NEXT_PUBLIC_APP_URL` - Your public app URL

### Build Configuration

The project is configured to handle build-time issues:

1. **Prisma Generation**: Automatically generates Prisma client during build
2. **Mock Database**: Falls back to mock database if real database is unavailable
3. **Environment Validation**: Flexible validation during build time

### Troubleshooting Build Failures

If your build fails, check:

1. **Environment Variables**: Ensure all required variables are set in Vercel
2. **Database Connection**: Verify your DATABASE_URL is correct and accessible
3. **Prisma Schema**: Ensure the schema is valid and up to date

### Build Commands

- `npm run build` - Standard build
- `npm run build:vercel` - Vercel-optimized build
- `npm run build:debug` - Debug build with additional checks

### Database Setup

1. Create a PostgreSQL database (Supabase recommended)
2. Run migrations: `npx prisma migrate deploy`
3. Set the DATABASE_URL in Vercel environment variables

### Common Issues

1. **Build Fails with Database Error**: 
   - Ensure DATABASE_URL is set correctly
   - Check if database is accessible from Vercel

2. **Prisma Generation Fails**:
   - Verify schema.prisma is valid
   - Check if all dependencies are installed

3. **Environment Variable Errors**:
   - Ensure all required variables are set in Vercel
   - Check variable names for typos

### Support

If you continue to have issues:
1. Check the build logs in Vercel dashboard
2. Run `npm run build:debug` locally to identify issues
3. Verify all environment variables are correctly set

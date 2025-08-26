# QR Master - Create Custom QR Codes in Seconds

A production-ready SaaS application for creating and managing QR codes with advanced tracking, analytics, and integrations.

## Prerequisites

Before running this project, make sure you have Node.js installed:

### Windows Installation
1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Install Node.js (LTS version recommended)
3. Restart your terminal/PowerShell
4. Verify installation: `node --version` and `npm --version`

### Alternative: Use Node Version Manager (nvm)
```bash
# Install nvm-windows
# Download from: https://github.com/coreybutler/nvm-windows/releases

# Install Node.js
nvm install 18
nvm use 18
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Build Issues

If you encounter build issues:

1. **Node.js not found**: Install Node.js as described above
2. **Prisma generate fails**: Run `npx prisma generate` manually
3. **TypeScript errors**: Check for type errors in your code
4. **Vercel deployment fails**: Ensure all environment variables are set

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Features

- 🎨 **Custom QR Codes** - Create static and dynamic QR codes with full customization
- 📊 **Advanced Analytics** - Track scans, locations, devices, and user behavior
- 🔄 **Dynamic Content** - Edit QR code destinations anytime without reprinting
- 📦 **Bulk Operations** - Import CSV/Excel files to create multiple QR codes at once
- 🔌 **Integrations** - Connect with Zapier, Airtable, and Google Sheets
- 🌍 **Multi-language** - Support for English and German (i18n)
- 🔒 **Privacy-First** - Respects user privacy with hashed IPs and DNT headers
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis (optional)
- **Auth**: NextAuth.js (Credentials + Google OAuth)
- **QR Generation**: qrcode library
- **Charts**: Chart.js with react-chartjs-2
- **i18n**: i18next

## Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qr-master.git
cd qr-master
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Set `NEXTAUTH_SECRET` to a secure random string
   - Set `IP_SALT` to a secure random string
   - (Optional) Add Google OAuth credentials
   - (Optional) Add Redis URL for caching

4. Start the application with Docker:
```bash
docker compose up --build
```

5. Run database migrations and seed data:
```bash
# In a new terminal
docker compose exec web npx prisma migrate deploy
docker compose exec web npx tsx prisma/seed.ts
```

6. Access the application:
   - Web app: http://localhost:3000
   - Database: localhost:5432
   - Redis: localhost:6379

## Demo Account

Use these credentials to test the application:

- **Email**: demo@qrmaster.com
- **Password**: demo123

### Project Structure

```
qr-master/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Global styles
│   └── i18n/            # Translation files
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── docker-compose.yml   # Docker configuration
└── Dockerfile          # Container definition
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### QR Codes
- `GET /api/qrs` - List all QR codes
- `POST /api/qrs` - Create a new QR code
- `GET /api/qrs/[id]` - Get QR code details
- `PATCH /api/qrs/[id]` - Update QR code
- `DELETE /api/qrs/[id]` - Delete QR code

### Analytics
- `GET /api/analytics/summary` - Get analytics summary

### Bulk Operations
- `POST /api/bulk` - Import QR codes from CSV/Excel

### Public Redirect
- `GET /r/[slug]` - Redirect and track QR code scan

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Yes |
| `IP_SALT` | Salt for IP hashing | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `REDIS_URL` | Redis connection string | No |
| `ENABLE_DEMO` | Enable demo mode | No |

## Security

- IP addresses are hashed with salt before storage
- Respects Do Not Track (DNT) headers
- CORS protection enabled
- Rate limiting on API endpoints
- Secure session management with NextAuth.js

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Docker

The application includes production-ready Docker configuration:

```bash
docker build -t qr-master .
docker run -p 3000:3000 --env-file .env qr-master
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@qrmaster.com or open an issue on GitHub.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All open-source contributors

---

Built with ❤️ by QR Master Team# qrmaster

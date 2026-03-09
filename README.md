# Guardian Shield - Family Safety Platform

A comprehensive digital parenting solution that protects children online with AI-powered content filtering, real-time alerts, and detailed monitoring.

## Features

- **AI-Powered Content Filtering**: Advanced machine learning algorithms detect and block inappropriate content
- **Real-Time Alerts**: Instant notifications when suspicious activity is detected
- **Family Management**: Monitor up to 5 children with individual profiles
- **Screenshot Evidence**: Capture visual proof of blocked content attempts
- **Privacy First**: End-to-end encryption with no data sharing
- **Multi-Platform**: Browser extension + mobile app support
- **Bilingual Support**: English and Bangla language options

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Backend
- **Supabase** - PostgreSQL database + authentication
- **Resend** - Email delivery service
- **WhatsApp API** - Fallback notifications
- **Vercel** - Deployment platform

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Static type checking

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/guardian-shield.git
cd guardian-shield
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment setup**
```bash
# Copy environment template
cp .env.example .env.local

# Update with your credentials
# - Supabase URL and keys
# - Email service configuration
# - WhatsApp phone number
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Environment Variables

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration
ADMIN_EMAIL=admin@guardianshield.com
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=alerts@guardianshield.com

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Guardian Shield

# WhatsApp
WHATSAPP_PHONE_NUMBER=+1234567890
```

## Project Structure

```
guardian-shield/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/           # Authentication routes
│   │   ├── dashboard/          # Protected dashboard routes
│   │   ├── admin/             # Admin panel routes
│   │   └── api/               # API routes
│   ├── components/             # Reusable React components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   └── forms/            # Form components
│   ├── lib/                   # Utility functions
│   │   ├── supabase/         # Supabase client
│   │   ├── validations.ts      # Zod schemas
│   │   └── email.ts          # Email templates
│   └── types/                 # TypeScript type definitions
├── public/                     # Static assets
├── extension/                  # Browser extension
├── supabase/                  # Database schema
└── docs/                      # Documentation
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Environment Variables**
Set all required environment variables in Vercel dashboard.

### Environment Setup

- **Development**: `.env.local`
- **Production**: `.env.production`

## Database Schema

### Core Tables

- **profiles** - User accounts and settings
- **children** - Child profiles and configurations
- **alerts** - Security alerts and notifications
- **payments** - Subscription and payment records
- **risky_sites** - Blocked websites database

### Schema Files

- `supabase/schema.sql` - Database structure
- `supabase/rls-policies.sql` - Security policies

## Security Features

- **Row Level Security (RLS)** - Database access control
- **JWT Authentication** - Secure user sessions
- **Input Validation** - Zod schema validation
- **XSS Protection** - Content Security Policy headers
- **Rate Limiting** - API request throttling
- **HTTPS Only** - SSL/TLS encryption

## Browser Extension

### Features
- Real-time content blocking
- Screenshot capture
- Activity monitoring
- Quick report buttons

### Development
```bash
cd extension
npm run build
# Load unpacked extension in Chrome/Edge
```

## Testing

### Unit Tests
```bash
npm run test
# or
yarn test
```

### E2E Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

## Performance

### Lighthouse Score Target: 99%
- **Performance**: Optimized images and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation
- **Best Practices**: Modern JavaScript and CSS
- **SEO**: Meta tags and structured data

### Optimization Features
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports
- **Caching**: Supabase and browser caching
- **Bundle Analysis**: Webpack Bundle Analyzer

## Localization

### Supported Languages
- **English** (en) - Default
- **Bangla** (bn) - বাংলা

### Adding New Languages
1. Add translation files to `public/locales/`
2. Update language selector in components
3. Test with different locales

## API Documentation

### Authentication
```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password",
  "fullName": "John Doe"
}
```

### Alerts
```typescript
// Get alerts
GET /api/alerts?childId=xxx&limit=10

// Create alert
POST /api/alerts
{
  "childId": "xxx",
  "url": "https://example.com",
  "category": "adult",
  "severity": "high"
}
```

## Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "analyze": "ANALYZE=true next build"
  }
}
```

## Contributing

1. **Fork the repository**
2. **Create feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit changes**
```bash
git commit -m "Add amazing feature"
```
4. **Push to branch**
```bash
git push origin feature/amazing-feature
```
5. **Open Pull Request**

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Email**: support@guardianshield.com
- **Documentation**: [Wiki](https://github.com/your-username/guardian-shield/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/guardian-shield/issues)

## Star History

[![Star History Chart](https://api.star-history.com/chart.svg?user=your-username&repo=guardian-shield)]

## Analytics

- **Vercel Analytics**: Performance monitoring
- **Supabase Analytics**: Database insights
- **User Behavior**: Heatmaps and session recording

## Roadmap

### v1.1 (Q2 2026)
- [ ] Mobile app release
- [ ] Advanced AI filtering
- [ ] School dashboard
- [ ] Multi-language support

### v1.2 (Q3 2026)
- [ ] Voice alerts
- [ ] Geolocation tracking
- [ ] Time-based restrictions
- [ ] Parent community features

---

**Built with ❤️ for families worldwide**

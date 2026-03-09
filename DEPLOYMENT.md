# Deployment Guide

This guide will help you deploy Guardian Shield to production.

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Vercel account (recommended) or other hosting provider
- Domain name (optional)
- SSL certificate (handled automatically by Vercel)

## Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-username/guardian-shield.git
cd guardian-shield
npm install
```

### 2. Environment Variables

Create `.env.production` with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=alerts@guardianshield.com

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Guardian Shield

# WhatsApp
WHATSAPP_PHONE_NUMBER=+1234567890

# Admin
ADMIN_EMAIL=admin@guardianshield.com

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

## Database Setup

### 1. Supabase Configuration

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql`
3. Set up Row Level Security (RLS) policies from `supabase/rls-policies.sql`
4. Enable authentication providers you need

### 2. Environment Variables in Supabase

Add your environment variables to Supabase Edge Functions if using them.

## Deployment Options

### Option 1: Vercel (Recommended)

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

4. **Add Environment Variables**
- Go to Vercel dashboard
- Add all environment variables from the setup above
- Redeploy if needed

### Option 2: Docker

1. **Build Docker Image**
```bash
docker build -t guardian-shield .
```

2. **Run Container**
```bash
docker run -p 3000:3000 --env-file .env.production guardian-shield
```

### Option 3: Traditional Hosting

1. **Build Application**
```bash
npm run build
```

2. **Start Production Server**
```bash
npm start
```

## Post-Deployment Checklist

### 1. Verify Functionality

- [ ] Login/Registration works
- [ ] Dashboard loads correctly
- [ ] Alerts are sent via email
- [ ] WhatsApp notifications work (if configured)
- [ ] Browser extension can connect

### 2. Security Checks

- [ ] Environment variables are not exposed
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] Database connections are secure

### 3. Performance

- [ ] Images are optimized
- [ ] Caching is enabled
- [ ] Bundle size is optimized
- [ ] Lighthouse score is good

### 4. Monitoring

- [ ] Error tracking is set up
- [ ] Performance monitoring is enabled
- [ ] Analytics are configured

## Domain Configuration

### Custom Domain (Vercel)

1. Add custom domain in Vercel dashboard
2. Update DNS records as instructed
3. Wait for SSL certificate provisioning

### Custom Domain (Other)

1. Configure your web server (Nginx, Apache)
2. Set up SSL certificate
3. Configure reverse proxy to Node.js app

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check environment variables syntax

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure database is online

3. **Email Not Working**
   - Verify Resend API key
   - Check email configuration
   - Verify sender domain is verified

4. **Authentication Issues**
   - Check NEXTAUTH_SECRET
   - Verify callback URLs
   - Ensure Supabase auth is configured

## Maintenance

### Regular Tasks

1. **Update Dependencies**
```bash
npm update
npm audit fix
```

2. **Database Backups**
- Enable automatic backups in Supabase
- Test restore procedures

3. **Monitor Logs**
- Check application logs regularly
- Set up alerts for errors

4. **Security Updates**
- Keep dependencies updated
- Monitor security advisories
- Update environment variables if needed

## Scaling

### When to Scale

1. **High Traffic**
   - Consider Vercel Pro plan
   - Add CDN caching
   - Optimize database queries

2. **Database Load**
   - Enable connection pooling
   - Add read replicas
   - Optimize queries

3. **Storage Needs**
   - Monitor file storage usage
   - Clean up old data
   - Consider external storage

## Support

For deployment issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review application logs
3. Contact support at support@guardianshield.com
4. Check GitHub issues for known problems

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for production
   - Rotate keys regularly

2. **Database Security**
   - Enable RLS policies
   - Use service role keys carefully
   - Monitor database access

3. **Application Security**
   - Keep dependencies updated
   - Monitor for vulnerabilities
   - Use HTTPS everywhere

---

**Note**: This deployment guide assumes you have basic knowledge of web development and deployment concepts. If you need assistance, consider hiring a DevOps professional or using managed hosting services.

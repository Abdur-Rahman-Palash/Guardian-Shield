# Supabase Setup for Guardian Shield

This guide will help you set up Supabase for the Guardian Shield application.

## Prerequisites

- A Supabase account (free tier is sufficient for development)
- Node.js and npm installed

## Setup Instructions

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `guardian-shield`
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

### 2. Get Your Supabase Credentials

1. Go to your project dashboard
2. Click on **Settings** → **API**
3. Copy the following values:
   - **Project URL** (this will be your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (this will be your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (this will be your `SUPABASE_SERVICE_ROLE_KEY`)

### 3. Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

**Important**: Never expose the `SUPABASE_SERVICE_ROLE_KEY` on the client side. It should only be used in server-side code.

### 4. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Click on **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the schema

This will create:
- `users` table for Guardian Shield users
- `risky_sites` table for blocked websites
- `alerts` table for security alerts
- Row Level Security policies
- Indexes for performance

### 5. Verify Row Level Security

1. Go to **Authentication** → **Policies**
2. You should see the following policies:
   - Users can only access their own data
   - Alerts are isolated by user
   - Risky sites are readable by all authenticated users

### 6. Test the Setup

You can test the Supabase integration using the test API endpoints:

```bash
# Test adding a risky site
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": "addRiskySite", "data": {"domain": "test.com", "category": "other", "active": true}}'

# Test getting alerts
curl http://localhost:3000/api/test?test=getAlerts&limit=5

# Test getting user alerts (replace USER_ID)
curl http://localhost:3000/api/test?test=getUserAlerts&userId=USER_ID&limit=5
```

## Available Functions

### Admin Functions (`src/utils/supabase-admin.ts`)

- `addRiskySite(site)` - Add a new risky site to the database
- `getAlerts(limit)` - Get all alerts (admin only)
- `getUserAlerts(userId, limit)` - Get alerts for a specific user
- `createAlert(alert)` - Create a new security alert
- `getRiskySites()` - Get all risky sites
- `updateRiskySite(id, updates)` - Update a risky site
- `deleteRiskySite(id)` - Delete a risky site
- `createUser(user)` - Create a new user
- `getUserByEmail(email)` - Get user by email

### Client Functions (`src/lib/supabase.ts`)

- `createClientComponentClient()` - For client-side operations
- `createServerComponentClient()` - For server components
- `createRouteHandlerClient()` - For API routes

## Security Features

### Row Level Security (RLS)

The database is configured with RLS policies that ensure:

1. **User Isolation**: Users can only access their own data
2. **Alert Privacy**: Alerts are only visible to the user who created them
3. **Secure Updates**: Users can only modify their own records
4. **Admin Access**: Service role key can bypass RLS for admin operations

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Public URL (safe for client-side)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Admin key (server-side only)

## Production Considerations

1. **Environment Variables**: Ensure all environment variables are set in production
2. **Database Backups**: Enable automated backups in Supabase
3. **Monitoring**: Set up alerts for database performance
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Authentication**: Consider implementing proper authentication with Supabase Auth

## Troubleshooting

### Common Issues

1. **Connection Errors**: Verify your environment variables are correct
2. **Permission Denied**: Check RLS policies are properly configured
3. **Type Errors**: Ensure database schema matches TypeScript types

### Debug Mode

Enable debug mode by adding this to your environment:

```env
SUPABASE_DEBUG=true
```

This will provide detailed logs for debugging Supabase operations.

## Next Steps

1. Implement user authentication with Supabase Auth
2. Create real-time subscriptions for live alerts
3. Add database functions for complex operations
4. Set up automated testing for database operations
5. Configure database backups and monitoring

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

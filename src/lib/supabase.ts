// Legacy Supabase client - use utils/supabase/server.ts or utils/supabase/client.ts instead
import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (deprecated - use utils/supabase/client.ts)
export const createClientComponentClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Server-side Supabase client (deprecated - use utils/supabase/server.ts)
export const createServerComponentClient = async () => {
  const { createClient } = await import('@supabase/supabase-js')
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

// For Route Handlers and API routes (deprecated - use utils/supabase/server.ts)
export const createRouteHandlerClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )

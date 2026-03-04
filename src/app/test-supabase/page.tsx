import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function TestSupabasePage() {
  const supabase = await createClient()

  // Test basic connection
  const { data, error } = await supabase.from('risky_sites').select('*').limit(5)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          {error ? (
            <div className="text-red-600">
              <p className="font-medium">Error:</p>
              <pre className="text-sm bg-red-50 p-2 rounded">{JSON.stringify(error, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-green-600">
              <p className="font-medium">✅ Connected successfully!</p>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sample Data (Risky Sites)</h2>
          {data && data.length > 0 ? (
            <div className="space-y-2">
              {data.map((site) => (
                <div key={site.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">{site.domain}</p>
                  <p className="text-sm text-gray-600">Category: {site.category}</p>
                  <p className="text-sm text-gray-600">Active: {site.active ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No risky sites found. Make sure to run the schema.sql in Supabase.</p>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Service Role Key:</strong> {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

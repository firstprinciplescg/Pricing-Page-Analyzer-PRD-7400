import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://umlgbehrttdzvraegtfk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbGdiZWhydHRkenZyYWVndGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTE3OTEsImV4cCI6MjA2NzQ4Nzc5MX0.YCZiRzcq7A41Rq7-FxeMHs1g4AtzFZ3IMhqgohTcJUk'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase
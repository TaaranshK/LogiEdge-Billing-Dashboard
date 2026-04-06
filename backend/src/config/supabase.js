let supabaseClient = null

const initSupabase = async () => {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️  Supabase credentials not configured. Storage features will be unavailable.')
      console.warn('Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file')
      return null
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseClient
  } catch (error) {
    console.warn('⚠️  Failed to initialize Supabase:', error.message)
    return null
  }
}

// Initialize on load
initSupabase()

module.exports = () => supabaseClient

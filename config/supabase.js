import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ayviizcviexxanfbiwek.supabase.co'
//hide key
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dmlpemN2aWV4eGFuZmJpd2VrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTc4MzY3OSwiZXhwIjoyMDIxMzU5Njc5fQ.nXn6GViboj__401SHA7WoYESPt_nBWqcRPiPWLk8lrI"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
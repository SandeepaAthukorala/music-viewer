
import { createClient } from '@supabase/supabase-js';

// These should be in .env.local, but for now hardcoding as per user request/environment
const supabaseUrl = 'https://sohxfwrraizpqishbkvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaHhmd3JyYWl6cHFpc2hia3Z0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQxMTkxMywiZXhwIjoyMDg0OTg3OTEzfQ.2eQ_gn1qeIBA694mx16Pf85r1u0Tb5e9C_0OdPrUfuU';

export const supabase = createClient(supabaseUrl, supabaseKey);

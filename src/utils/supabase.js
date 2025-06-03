const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lpuvhcxzmczrhaleycpy.supabase.co'; // ganti dengan URL kamu
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdXZoY3h6bWN6cmhhbGV5Y3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzYxNjksImV4cCI6MjA2NDU1MjE2OX0.jjKcd7kjz0W_VHwv_JIQCHBTtmeohb2O3AECiu-gU-Q'; // ganti dengan anon key kamu
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

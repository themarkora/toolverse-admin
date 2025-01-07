import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vquxyeqhjzoiknultdji.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdXh5ZXFoanpvaWtudWx0ZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTU2OTUsImV4cCI6MjA1MTc5MTY5NX0.MfdwqTu-PUukzuiEai2aDInl2s9m0NMKU5XZXb0JpqU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
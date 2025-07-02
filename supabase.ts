import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ctqxpmqrxpluanmjdcxj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0cXhwbXFyeHBsdWFubWpkY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTI0MDksImV4cCI6MjA2NDE4ODQwOX0.gKFtBJqKL9VxK9N67vGIF5MwtzoMr0wX7ThzZi5dMMA";
export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://onfcxnxuapdzgqhbghmy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZmN4bnh1YXBkemdxaGJnaG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDU0MDMsImV4cCI6MjA2NjQ4MTQwM30.bF4dK3QtxRVpBAVXJd0CdKspnfvBOb-VHjhYiB_4mwM";
export const supabase = createClient(supabaseUrl, supabaseKey);

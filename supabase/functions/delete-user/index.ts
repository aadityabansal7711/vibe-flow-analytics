
import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  // Get service role key and project url from env
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing config" }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const body = await req.json();
  const { user_id } = body;

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });
  }

  // First, delete the profile and associated data if needed
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('user_id', user_id);

  // Then, delete the auth user
  const { error: userError } = await supabase.auth.admin.deleteUser(user_id);

  if (profileError || userError) {
    return new Response(JSON.stringify({ error: profileError?.message || userError?.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: "User deleted" }), { status: 200 });
});

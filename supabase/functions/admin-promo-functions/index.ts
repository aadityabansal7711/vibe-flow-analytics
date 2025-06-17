
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ...params } = await req.json();

    switch (action) {
      case 'get_promo_codes':
        const { data: promoCodes, error: fetchError } = await supabaseClient
          .from('promo_codes')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        return new Response(
          JSON.stringify(promoCodes),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'create_promo_code':
        const { code, discount_percentage, max_uses, expires_at } = params;
        
        const { error: createError } = await supabaseClient
          .from('promo_codes')
          .insert({
            code: code.toUpperCase(),
            discount_percentage,
            max_uses,
            expires_at
          });

        if (createError) throw createError;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'toggle_promo_code':
        const { id, is_active } = params;
        
        const { error: toggleError } = await supabaseClient
          .from('promo_codes')
          .update({ is_active })
          .eq('id', id);

        if (toggleError) throw toggleError;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'delete_promo_code':
        const { error: deleteError } = await supabaseClient
          .from('promo_codes')
          .delete()
          .eq('id', params.id);

        if (deleteError) throw deleteError;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

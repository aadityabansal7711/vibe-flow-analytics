
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      user_id,
      amount,
      promo_code
    } = await req.json()

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = await crypto.subtle.sign(
      "HMAC",
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(RAZORPAY_KEY_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      ),
      new TextEncoder().encode(body)
    )
    
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (expectedSignatureHex !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    // Calculate subscription period
    const startDate = new Date()
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now

    // Update profile to premium
    await supabaseClient
      .from('profiles')
      .update({
        has_active_subscription: true,
        plan_tier: 'premium',
        plan_id: 'premium_yearly',
        plan_start_date: startDate.toISOString(),
        plan_end_date: endDate.toISOString(),
        used_promo_code: promo_code || null
      })
      .eq('user_id', user_id)

    // Create subscription record
    await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        status: 'active',
        plan_type: 'yearly',
        amount: amount * 100, // Convert back to paise for storage
        currency: 'inr',
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
        auto_renew: false // One-time payment
      })

    // Use promo code if valid
    if (promo_code) {
      await supabaseClient.rpc('use_promo_code', {
        promo_code: promo_code.toUpperCase()
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified and subscription activated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

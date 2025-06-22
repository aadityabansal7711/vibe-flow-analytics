
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RAZORPAY_KEY_ID = 'rzp_live_spLJgQSWhiE0KB'
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') // Store secret in Supabase secrets

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

    // Get user's subscription
    const { data: subscription, error } = await supabaseClient
      .from('subscriptions')
      .select('razorpay_subscription_id')
      .eq('user_id', user.user.id)
      .eq('status', 'active')
      .single()

    if (error || !subscription?.razorpay_subscription_id) {
      throw new Error('No active subscription found')
    }

    // Cancel subscription with Razorpay
    const razorpayAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
    
    const cancelResponse = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${subscription.razorpay_subscription_id}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${razorpayAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancel_at_cycle_end: false // Cancel immediately
        })
      }
    )

    if (!cancelResponse.ok) {
      const errorData = await cancelResponse.json()
      throw new Error(`Razorpay error: ${errorData.error?.description || 'Failed to cancel subscription'}`)
    }

    const cancelledSubscription = await cancelResponse.json()

    // Update our database
    await supabaseClient
      .from('subscriptions')
      .update({
        status: 'cancelled',
        auto_renew: false
      })
      .eq('user_id', user.user.id)
      .eq('razorpay_subscription_id', subscription.razorpay_subscription_id)

    await supabaseClient
      .from('profiles')
      .update({
        has_active_subscription: false,
        plan_tier: 'free',
        plan_id: 'free_tier'
      })
      .eq('user_id', user.user.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Subscription cancelled successfully',
        subscription: cancelledSubscription
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cancellation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

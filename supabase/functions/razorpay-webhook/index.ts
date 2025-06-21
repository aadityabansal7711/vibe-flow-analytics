
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    
    // Verify webhook signature (in production, verify with Razorpay secret)
    const event = body.event
    const paymentEntity = body.payload.payment.entity

    console.log('Webhook event:', event)
    console.log('Payment entity:', paymentEntity)

    if (event === 'payment.captured') {
      const paymentId = paymentEntity.id
      const amount = paymentEntity.amount / 100 // Convert from paise to rupees
      const email = paymentEntity.email
      const contact = paymentEntity.contact

      // Find user by email
      const { data: profiles, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (profileError || !profiles) {
        console.error('User not found:', email)
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Update user to premium
      const planEndDate = new Date()
      planEndDate.setMonth(planEndDate.getMonth() + 1) // 1 month from now

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          has_active_subscription: true,
          plan_tier: 'premium',
          plan_id: 'premium_monthly',
          plan_start_date: new Date().toISOString(),
          plan_end_date: planEndDate.toISOString(),
        })
        .eq('user_id', profiles.user_id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update profile' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Create subscription record
      const { error: subscriptionError } = await supabaseClient
        .from('subscriptions')
        .insert({
          user_id: profiles.user_id,
          status: 'active',
          plan_type: 'monthly',
          amount: amount,
          currency: 'inr',
          current_period_start: new Date().toISOString(),
          current_period_end: planEndDate.toISOString(),
        })

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)
      }

      console.log('Successfully upgraded user to premium:', email)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
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
    const event = body.event
    
    console.log('Webhook event received:', event)
    console.log('Webhook payload:', JSON.stringify(body, null, 2))

    // Store webhook event for tracking
    await supabaseClient
      .from('webhook_events')
      .insert({
        event_type: event,
        event_data: body,
        processed: false
      })

    // Handle different subscription events
    switch (event) {
      case 'subscription.activated':
      case 'subscription.charged':
        await handleSubscriptionActivated(supabaseClient, body)
        break
      
      case 'subscription.cancelled':
      case 'subscription.completed':
        await handleSubscriptionCancelled(supabaseClient, body)
        break
      
      case 'payment.captured':
        await handlePaymentCaptured(supabaseClient, body)
        break
      
      default:
        console.log('Unhandled event type:', event)
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

async function handleSubscriptionActivated(supabase: any, body: any) {
  const subscription = body.payload.subscription.entity
  const payment = body.payload.payment?.entity
  
  console.log('Handling subscription activation:', subscription.id)

  // Find user by customer_id or email
  let profile = null
  
  if (subscription.customer_id) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('razorpay_customer_id', subscription.customer_id)
      .single()
    profile = data
  }

  if (!profile && payment?.email) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', payment.email)
      .single()
    profile = data
  }

  if (!profile) {
    console.error('User not found for subscription:', subscription.id)
    return
  }

  // Calculate subscription period
  const startDate = new Date(subscription.start_at * 1000)
  const endDate = new Date(subscription.end_at * 1000)

  // Update profile to premium
  await supabase
    .from('profiles')
    .update({
      has_active_subscription: true,
      plan_tier: 'premium',
      plan_id: 'plan_QkDRJrPOe3ujbQ',
      plan_start_date: startDate.toISOString(),
      plan_end_date: endDate.toISOString(),
      razorpay_customer_id: subscription.customer_id
    })
    .eq('user_id', profile.user_id)

  // Create/update subscription record
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: profile.user_id,
      razorpay_subscription_id: subscription.id,
      status: 'active',
      plan_type: 'yearly',
      amount: subscription.plan_id === 'plan_QkDRJrPOe3ujbQ' ? 4999 : subscription.total_count,
      currency: 'inr',
      current_period_start: startDate.toISOString(),
      current_period_end: endDate.toISOString(),
      auto_renew: true
    })

  console.log('Successfully activated subscription for user:', profile.user_id)
}

async function handleSubscriptionCancelled(supabase: any, body: any) {
  const subscription = body.payload.subscription.entity
  
  console.log('Handling subscription cancellation:', subscription.id)

  // Find user by subscription ID
  const { data: subscriptionRecord } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('razorpay_subscription_id', subscription.id)
    .single()

  if (!subscriptionRecord) {
    console.error('Subscription not found:', subscription.id)
    return
  }

  // Update profile to free tier
  await supabase
    .from('profiles')
    .update({
      has_active_subscription: false,
      plan_tier: 'free',
      plan_id: 'free_tier'
    })
    .eq('user_id', subscriptionRecord.user_id)

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      auto_renew: false
    })
    .eq('razorpay_subscription_id', subscription.id)

  console.log('Successfully cancelled subscription for user:', subscriptionRecord.user_id)
}

async function handlePaymentCaptured(supabase: any, body: any) {
  const payment = body.payload.payment.entity
  
  // This handles one-time payments if needed
  console.log('Payment captured:', payment.id)
  
  // Update subscription record with payment details if it exists
  if (payment.subscription_id) {
    await supabase
      .from('subscriptions')
      .update({
        razorpay_payment_id: payment.id
      })
      .eq('razorpay_subscription_id', payment.subscription_id)
  }
}

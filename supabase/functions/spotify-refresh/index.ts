
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { refresh_token } = await req.json()

    const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')!
    const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')!

    console.log('🔄 Refreshing Spotify token...')

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Token refresh failed:', response.status, errorText)
      throw new Error(`Token refresh failed: ${errorText}`)
    }

    const tokenData = await response.json()
    console.log('✅ Token refresh successful')

    return new Response(
      JSON.stringify(tokenData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in spotify-refresh:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

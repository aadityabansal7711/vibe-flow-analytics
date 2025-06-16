
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎵 Spotify token exchange request received')
    
    const { code, redirect_uri } = await req.json()

    if (!code) {
      console.error('❌ No authorization code provided')
      throw new Error('Authorization code is required')
    }

    if (!redirect_uri) {
      console.error('❌ No redirect URI provided')
      throw new Error('Redirect URI is required')
    }

    const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')
    const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.error('❌ Missing Spotify credentials')
      throw new Error('Spotify credentials not configured')
    }

    console.log('🔄 Exchanging code for tokens...', {
      clientId: SPOTIFY_CLIENT_ID,
      redirectUri: redirect_uri,
      codeLength: code.length,
      codePreview: code.substring(0, 10) + '...'
    })

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
    })

    console.log('📊 Token response status:', tokenResponse.status)

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
        requestBody: {
          grant_type: 'authorization_code',
          code: code.substring(0, 10) + '...',
          redirect_uri
        }
      })
      throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    
    console.log('✅ Token exchange successful', {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type
    })

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
    console.error('❌ Error in spotify-exchange:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
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

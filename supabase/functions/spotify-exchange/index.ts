
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
    console.log('📍 Request method:', req.method)
    console.log('📍 Request URL:', req.url)
    console.log('📍 Request headers:', Object.fromEntries(req.headers.entries()))

    let requestBody;
    try {
      requestBody = await req.json()
      console.log('📦 Raw request body received:', JSON.stringify(requestBody, null, 2))
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    const { code, redirect_uri } = requestBody

    // Validate required fields
    if (!code) {
      console.error('❌ No authorization code provided')
      return new Response(
        JSON.stringify({ 
          error: 'Authorization code is required',
          received: { code: !!code, redirect_uri: !!redirect_uri }
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    if (!redirect_uri) {
      console.error('❌ No redirect URI provided')
      return new Response(
        JSON.stringify({ 
          error: 'Redirect URI is required',
          received: { code: !!code, redirect_uri: !!redirect_uri }
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Get environment variables
    const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')
    const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')

    console.log('🔧 Environment check:', {
      hasClientId: !!SPOTIFY_CLIENT_ID,
      hasClientSecret: !!SPOTIFY_CLIENT_SECRET,
      clientIdLength: SPOTIFY_CLIENT_ID?.length || 0,
      clientSecretLength: SPOTIFY_CLIENT_SECRET?.length || 0,
      clientIdPreview: SPOTIFY_CLIENT_ID?.substring(0, 8) + '...'
    })

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.error('❌ Missing Spotify credentials in environment')
      return new Response(
        JSON.stringify({ 
          error: 'Spotify credentials not configured',
          details: 'Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables'
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

    // Validate authorization code format
    if (code.length < 50) {
      console.error('❌ Authorization code seems too short:', {
        codeLength: code.length,
        codePreview: code.substring(0, 20) + '...'
      })
      return new Response(
        JSON.stringify({ 
          error: 'Invalid authorization code format',
          details: 'Authorization code appears to be invalid or corrupted'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    console.log('🔄 Preparing token exchange...', {
      clientId: SPOTIFY_CLIENT_ID,
      redirectUri: redirect_uri,
      codeLength: code.length,
      codePreview: code.substring(0, 15) + '...',
      codeEnd: '...' + code.substring(code.length - 15)
    })

    // Prepare request body for Spotify
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
    })

    console.log('📤 Token request body:', {
      grant_type: 'authorization_code',
      code: code.substring(0, 15) + '...' + code.substring(code.length - 15),
      redirect_uri: redirect_uri
    })

    // Prepare authorization header
    const authString = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    const authBuffer = new TextEncoder().encode(authString)
    const authBase64 = btoa(String.fromCharCode(...authBuffer))
    
    console.log('🔐 Authorization header prepared:', {
      authStringLength: authString.length,
      base64Length: authBase64.length,
      base64Preview: authBase64.substring(0, 20) + '...'
    })

    console.log('🌐 Making request to Spotify token endpoint...')
    
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authBase64}`,
        'Accept': 'application/json'
      },
      body: tokenRequestBody,
    })

    console.log('📊 Spotify response status:', tokenResponse.status)
    console.log('📊 Spotify response headers:', Object.fromEntries(tokenResponse.headers.entries()))

    let responseText;
    try {
      responseText = await tokenResponse.text()
      console.log('📊 Spotify raw response:', responseText)
    } catch (readError) {
      console.error('❌ Failed to read Spotify response:', readError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to read Spotify response',
          details: readError.message
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

    if (!tokenResponse.ok) {
      console.error('❌ Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        response: responseText,
        requestDetails: {
          url: 'https://accounts.spotify.com/api/token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authBase64.substring(0, 20)}...`
          },
          bodyParams: {
            grant_type: 'authorization_code',
            code: code.substring(0, 15) + '...',
            redirect_uri: redirect_uri
          }
        }
      })

      let errorDetails;
      try {
        errorDetails = JSON.parse(responseText)
      } catch {
        errorDetails = { raw_response: responseText }
      }

      return new Response(
        JSON.stringify({ 
          error: `Spotify token exchange failed: ${tokenResponse.status}`,
          spotify_error: errorDetails,
          debug_info: {
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
            code_length: code.length,
            redirect_uri: redirect_uri,
            client_id: SPOTIFY_CLIENT_ID
          }
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    let tokenData;
    try {
      tokenData = JSON.parse(responseText)
      console.log('✅ Token exchange successful:', {
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type,
        scope: tokenData.scope
      })
    } catch (parseError) {
      console.error('❌ Failed to parse token response JSON:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in Spotify response',
          details: parseError.message,
          raw_response: responseText
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

    if (!tokenData.access_token) {
      console.error('❌ No access token in response:', tokenData)
      return new Response(
        JSON.stringify({ 
          error: 'No access token received from Spotify',
          spotify_response: tokenData
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

    console.log('🎉 Token exchange completed successfully')
    
    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
        scope: tokenData.scope
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error in spotify-exchange:', error)
    console.error('❌ Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack,
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

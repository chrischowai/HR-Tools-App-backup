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
    const { username, password } = await req.json()

    // Validate input
    if (!username || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Username and password are required' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Get environment variables
    const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY')
    const GOOGLE_SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID')
    const SHEET_RANGE = 'Sheet1!A:C' // Adjust range as needed

    if (!GOOGLE_SHEETS_API_KEY || !GOOGLE_SHEET_ID) {
      console.error('Missing Google Sheets configuration')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication service configuration error' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Fetch data from Google Sheets
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`
    
    console.log('Fetching from Google Sheets...')
    const sheetsResponse = await fetch(sheetsUrl)
    
    if (!sheetsResponse.ok) {
      console.error('Google Sheets API error:', sheetsResponse.status, sheetsResponse.statusText)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unable to access user database' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    const sheetsData = await sheetsResponse.json()
    console.log('Google Sheets response:', sheetsData)

    // Check if we have data
    if (!sheetsData.values || sheetsData.values.length === 0) {
      console.error('No data found in Google Sheets')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User database is empty' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    const rows = sheetsData.values
    const headers = rows[0] // Assume first row contains headers
    
    // Find the column indices for login name and password
    const loginNameIndex = headers.findIndex((header: string) => 
      header.toLowerCase().includes('login') && header.toLowerCase().includes('name')
    )
    const passwordIndex = headers.findIndex((header: string) => 
      header.toLowerCase().includes('password')
    )

    if (loginNameIndex === -1 || passwordIndex === -1) {
      console.error('Required columns not found in Google Sheets')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User database schema error' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Check credentials against each row (skip header row)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const storedUsername = row[loginNameIndex]
      const storedPassword = row[passwordIndex]

      if (storedUsername === username && storedPassword === password) {
        // Login successful
        const userData = {
          username: username,
          loginTime: new Date().toISOString(),
          // Add any other user data from the sheet if needed
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Login successful',
            user: userData
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }
    }

    // Login failed
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Invalid username or password' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      },
    )

  } catch (error) {
    console.error('Login validation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
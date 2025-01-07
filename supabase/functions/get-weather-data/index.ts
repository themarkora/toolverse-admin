import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const WEATHER_API_KEY = Deno.env.get('WEATHER_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()
    
    if (!location) {
      throw new Error('Location is required')
    }

    // Get current weather and forecast data
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()

    // Analyze weather conditions for snow probability
    const snowProbability = calculateSnowProbability(data)
    const estimatedSnowDays = calculateEstimatedSnowDays(data)

    return new Response(
      JSON.stringify({
        probability: snowProbability,
        snowDays: estimatedSnowDays,
        location: data.location.name,
        country: data.location.country
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function calculateSnowProbability(data: any): number {
  // Check current and forecasted conditions
  const conditions = [
    data.current.temp_c < 2, // Current temperature below 2°C
    data.current.precip_mm > 0, // Current precipitation
    data.forecast.forecastday.some((day: any) => 
      day.day.daily_chance_of_snow > 0 || 
      day.day.totalprecip_mm > 0 && day.day.avgtemp_c < 2
    )
  ]

  // Calculate probability based on conditions
  const metConditions = conditions.filter(Boolean).length
  return Math.round((metConditions / conditions.length) * 100)
}

function calculateEstimatedSnowDays(data: any): number {
  // Count days with high snow probability
  return data.forecast.forecastday.filter((day: any) => 
    day.day.daily_chance_of_snow > 50 || 
    (day.day.totalprecip_mm > 0 && day.day.avgtemp_c < 2)
  ).length
}
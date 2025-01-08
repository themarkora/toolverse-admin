import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const WEATHER_API_KEY = Deno.env.get('WEATHER_API_KEY')

serve(async (req) => {
  // Log incoming request
  console.log('Received request:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()
    
    if (!location) {
      throw new Error('Location is required')
    }

    // Log API key presence (not the actual key)
    console.log('Weather API Key present:', !!WEATHER_API_KEY)

    // Construct and log the API URL (without the key)
    // Fixed URL to use https instead of http
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no`
    console.log('Calling WeatherAPI URL:', apiUrl.replace(WEATHER_API_KEY!, '[REDACTED]'))

    // Get current weather and forecast data
    const response = await fetch(apiUrl)

    // Log the response status
    console.log('WeatherAPI response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('WeatherAPI error:', errorText)
      throw new Error(`Failed to fetch weather data: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully received weather data for:', data.location?.name)

    // Analyze weather conditions for snow probability
    const snowProbability = calculateSnowProbability(data)
    const estimatedSnowDays = calculateEstimatedSnowDays(data)

    const result = {
      probability: snowProbability,
      snowDays: estimatedSnowDays,
      location: data.location.name,
      country: data.location.country,
      current_temp: data.current.temp_c,
      current_precip: data.current.precip_mm,
      forecast: data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        temp: day.day.avgtemp_c,
        precip: day.day.totalprecip_mm,
        snow_chance: day.day.daily_chance_of_snow
      }))
    }

    console.log('Returning result:', result)

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Function error:', error.message)
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
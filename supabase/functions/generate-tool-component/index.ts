import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { slug } = await req.json()
    
    if (!slug) {
      throw new Error('Slug is required')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get tool details
    const { data: tool, error: toolError } = await supabaseClient
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .single()

    if (toolError) throw toolError

    // Generate component template
    const componentName = tool.name.replace(/[^a-zA-Z0-9]/g, '')
    const componentTemplate = `import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ${componentName}() {
  // Add your tool's state and logic here
  const [result, setResult] = useState<string | null>(null);

  // SEO
  const title = "${tool.name}";
  const description = "${tool.description || ''}";

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      
      {/* Add your tool's UI components here */}
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter value"
          className="w-full"
        />
        <Button 
          onClick={() => {
            // Add your tool's logic here
          }}
          className="w-full"
        >
          Calculate
        </Button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-center">{result}</p>
        </div>
      )}
    </div>
  );
}`;

    // Update the tools registry
    const { data: registryData, error: registryError } = await supabaseClient
      .from('tools')
      .update({ 
        embedded_code: componentTemplate 
      })
      .eq('slug', slug)
      .select()

    if (registryError) throw registryError

    return new Response(
      JSON.stringify({ success: true, component: componentTemplate }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
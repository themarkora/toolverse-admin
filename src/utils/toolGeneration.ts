import { supabase } from "@/integrations/supabase/client";

export const generateUniqueSlug = async (baseName: string): Promise<string> => {
  const baseSlug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const { data: existingTool } = await supabase
    .from('tools')
    .select('slug')
    .eq('slug', baseSlug)
    .single();

  if (!existingTool) {
    return baseSlug;
  }

  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;
  
  while (true) {
    const { data: existingToolWithNumber } = await supabase
      .from('tools')
      .select('slug')
      .eq('slug', newSlug)
      .single();

    if (!existingToolWithNumber) {
      return newSlug;
    }

    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }
};

export const generateToolComponent = async (slug: string) => {
  try {
    const response = await supabase.functions.invoke('generate-tool-component', {
      body: { slug },
    });

    if (response.error) throw new Error(response.error.message);

    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to generate tool component: ${error.message}`);
  }
};
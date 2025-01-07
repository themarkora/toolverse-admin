import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AddToolDialog = ({ onToolAdded }: { onToolAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const generateUniqueSlug = async (baseName: string): Promise<string> => {
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

  const generateToolComponent = async (slug: string) => {
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

  const onSubmit = async (data: FormValues) => {
    try {
      setIsGenerating(true);
      const slug = await generateUniqueSlug(data.name);

      // First create the tool record
      const { error: insertError } = await supabase.from('tools').insert({
        name: data.name,
        description: data.description || null,
        slug: slug,
      });

      if (insertError) throw insertError;

      // Then generate the tool component
      await generateToolComponent(slug);

      toast({
        title: "Success",
        description: "Tool generated successfully",
      });
      
      form.reset();
      setOpen(false);
      onToolAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Generate Tool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate New Tool</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Tool name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tool description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Tool"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
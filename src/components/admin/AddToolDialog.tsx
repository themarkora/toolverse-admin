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
    
    // Check if the base slug exists
    const { data: existingTool } = await supabase
      .from('tools')
      .select('slug')
      .eq('slug', baseSlug)
      .single();

    if (!existingTool) {
      return baseSlug;
    }

    // If slug exists, append a number until we find a unique one
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

  const onSubmit = async (data: FormValues) => {
    try {
      const slug = await generateUniqueSlug(data.name);

      const { error } = await supabase.from('tools').insert({
        name: data.name,
        description: data.description || null,
        slug: slug,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool added successfully",
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Tool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Tool</DialogTitle>
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
            <Button type="submit">Add Tool</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
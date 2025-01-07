import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tools";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditToolDialogProps {
  tool: Tool;
  onClose: () => void;
  onToolUpdated: () => void;
}

export const EditToolDialog = ({ tool, onClose, onToolUpdated }: EditToolDialogProps) => {
  const [open, setOpen] = useState(true);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tool.name,
      description: tool.description || "",
      slug: tool.slug,
    },
  });

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Check if slug is already taken by another tool
      if (data.slug !== tool.slug) {
        const { data: existingTool } = await supabase
          .from('tools')
          .select('id')
          .eq('slug', data.slug)
          .neq('id', tool.id)
          .single();

        if (existingTool) {
          form.setError('slug', { message: 'This slug is already taken' });
          return;
        }
      }

      const { error } = await supabase
        .from('tools')
        .update({
          name: data.name,
          description: data.description || null,
          slug: data.slug,
        })
        .eq('id', tool.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool updated successfully",
      });
      
      handleClose();
      onToolUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tool</DialogTitle>
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
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="tool-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
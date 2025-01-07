import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GenerateToolForm } from "./GenerateToolForm";
import { generateUniqueSlug, generateToolComponent } from "@/utils/toolGeneration";

interface AddToolDialogProps {
  onToolAdded: () => void;
}

export const AddToolDialog = ({ onToolAdded }: AddToolDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: { name: string; description: string }) => {
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
        <GenerateToolForm onSubmit={onSubmit} isGenerating={isGenerating} />
      </DialogContent>
    </Dialog>
  );
};
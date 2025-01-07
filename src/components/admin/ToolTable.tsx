import { useState } from "react";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditToolDialog } from "./EditToolDialog";

interface ToolTableProps {
  tools: Tool[];
  onToolUpdated: () => void;
}

export function ToolTable({ tools, onToolUpdated }: ToolTableProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase.from("tools").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool deleted successfully",
      });
      
      onToolUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete tool",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell>{tool.name}</TableCell>
              <TableCell>{tool.description}</TableCell>
              <TableCell>{tool.slug}</TableCell>
              <TableCell className="text-right space-x-2">
                <EditToolDialog tool={tool} onToolUpdated={onToolUpdated} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(tool.id)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {tools.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No tools found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
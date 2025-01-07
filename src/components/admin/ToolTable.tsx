import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tool } from "@/types/tools";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditToolDialog } from "./EditToolDialog";

interface ToolTableProps {
  tools: Tool[];
  onToolUpdated: () => void;
}

export const ToolTable = ({ tools, onToolUpdated }: ToolTableProps) => {
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Tool deleted successfully",
    });
    onToolUpdated();
  };

  return (
    <>
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
              <TableCell className="font-medium">{tool.name}</TableCell>
              <TableCell>{tool.description}</TableCell>
              <TableCell>
                <code className="px-2 py-1 rounded bg-muted">
                  {tool.slug}
                </code>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => setEditingTool(tool)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(tool.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingTool && (
        <EditToolDialog
          tool={editingTool}
          onClose={() => setEditingTool(null)}
          onToolUpdated={onToolUpdated}
        />
      )}
    </>
  );
};
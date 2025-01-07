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

interface ToolTableProps {
  tools: Tool[];
}

export const ToolTable = ({ tools }: ToolTableProps) => {
  return (
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
              <Button variant="outline" size="sm" className="mr-2">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
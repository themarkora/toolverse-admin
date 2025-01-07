import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/categories";

interface CategoryTableProps {
  categories: Category[];
}

export const CategoryTable = ({ categories }: CategoryTableProps) => {
  const isMainCategory = (category: Category) => !category.parent_id;

  const getSubCategories = (parentId: string) => 
    categories.filter(cat => cat.parent_id === parentId);

  const formatCategoryName = (name: string) => {
    return name.replace(/\s+Tools$/i, '');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>URL Path</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.filter(isMainCategory).map((mainCategory) => (
          <>
            <TableRow key={mainCategory.id}>
              <TableCell className="font-medium">
                {formatCategoryName(mainCategory.name)}
              </TableCell>
              <TableCell>{mainCategory.description}</TableCell>
              <TableCell>
                <code className="px-2 py-1 rounded bg-muted">
                  /tools/{mainCategory.slug}
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
            {getSubCategories(mainCategory.id).map((subCategory) => (
              <TableRow key={subCategory.id} className="bg-muted/30">
                <TableCell className="font-medium pl-8">
                  {formatCategoryName(subCategory.name)}
                </TableCell>
                <TableCell>{subCategory.description}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 rounded bg-muted">
                    /tools/{subCategory.slug}
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
          </>
        ))}
      </TableBody>
    </Table>
  );
};
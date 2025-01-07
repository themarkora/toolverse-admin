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

  const getParentCategory = (parentId: string | null) => {
    if (!parentId) return null;
    return categories.find(cat => cat.id === parentId);
  };

  const getMainCategories = () => categories.filter(isMainCategory);
  const getSubCategories = (parentId: string) => 
    categories.filter(cat => cat.parent_id === parentId);

  const formatMainCategoryName = (name: string) => {
    return name.replace(/\s+Tools$/i, '');
  };

  const formatSubCategoryName = (category: Category) => {
    return category.name.replace(/\s+Tools$/i, '');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {getMainCategories().map((mainCategory) => (
          <>
            <TableRow key={mainCategory.id}>
              <TableCell className="font-medium">
                {formatMainCategoryName(mainCategory.name)}
              </TableCell>
              <TableCell>{mainCategory.description}</TableCell>
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
                  {formatSubCategoryName(subCategory)}
                </TableCell>
                <TableCell>{subCategory.description}</TableCell>
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
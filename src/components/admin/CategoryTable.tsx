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
  const isSubCategory = (category: Category) => !!category.parent_id;

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

  const formatSubCategoryPath = (category: Category) => {
    const parent = getParentCategory(category.parent_id);
    if (!parent) return category.slug;
    const parentName = parent.slug.replace(/\-?tools$/i, '');
    return `${parentName}/${category.slug}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Main Category</TableHead>
          <TableHead className="w-[300px]">Description</TableHead>
          <TableHead className="w-[250px]">Sub-category</TableHead>
          <TableHead className="w-[250px]">Tool Slug Name</TableHead>
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
              <TableCell>-</TableCell>
              <TableCell>
                <code className="px-2 py-1 rounded bg-muted">
                  {mainCategory.slug.replace(/\-?tools$/i, '')}/
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
                <TableCell className="font-medium">
                  <div className="w-6" />
                </TableCell>
                <TableCell>{subCategory.description}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 rounded bg-muted">
                    {formatSubCategoryPath(subCategory)}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="px-2 py-1 rounded bg-muted">
                    [tool-slug]
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
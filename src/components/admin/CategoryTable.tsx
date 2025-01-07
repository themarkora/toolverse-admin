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
  // Separate main categories and sub-categories
  const mainCategories = categories.filter(cat => !cat.parent_id);
  const subCategories = categories.filter(cat => cat.parent_id);

  const getParentName = (parentId: string | null) => {
    if (!parentId) return "";
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : "";
  };

  const formatSlug = (category: Category) => {
    if (!category.parent_id) {
      return `${category.slug}/`;
    }
    const parent = categories.find(cat => cat.id === category.parent_id);
    return parent ? `${parent.slug}/${category.slug}` : category.slug;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>URL Pattern</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Main Categories */}
        {mainCategories.map((category) => (
          <TableRow key={category.id} className="bg-muted/30">
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell>
              <span className="bg-primary/20 text-primary rounded-full px-3 py-1 text-sm">
                Main Category
              </span>
            </TableCell>
            <TableCell>
              <code className="bg-muted px-2 py-1 rounded">
                {formatSlug(category)}
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

        {/* Sub Categories */}
        {subCategories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium pl-8">↳ {category.name}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell>
              <span className="bg-secondary/20 text-secondary rounded-full px-3 py-1 text-sm">
                Sub-category of {getParentName(category.parent_id)}
              </span>
            </TableCell>
            <TableCell>
              <code className="bg-muted px-2 py-1 rounded">
                {formatSlug(category)}
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
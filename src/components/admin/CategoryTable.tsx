import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

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

  const getCategoryType = (category: Category) => {
    return isMainCategory(category) ? (
      <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
        Main Category
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        Sub-category
      </Badge>
    );
  };

  const formatSlug = (category: Category) => {
    if (isMainCategory(category)) {
      return `${category.slug}/`;
    }
    const parent = getParentCategory(category.parent_id);
    return parent ? `${parent.slug}/${category.slug}` : category.slug;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Name</TableHead>
          <TableHead className="w-[400px]">Description</TableHead>
          <TableHead className="w-[200px]">Category Type</TableHead>
          <TableHead className="w-[300px]">URL Pattern</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id} className={isSubCategory(category) ? "bg-muted/30" : ""}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {isSubCategory(category) && (
                  <>
                    <div className="w-6" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
                {category.name}
              </div>
            </TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell>{getCategoryType(category)}</TableCell>
            <TableCell>
              <code className="px-2 py-1 rounded bg-muted">
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
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

interface CategoryTableProps {
  categories: Category[];
}

export const CategoryTable = ({ categories }: CategoryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Parent Category</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell>
              {category.parent_id ? "Sub-category" : "Main Category"}
            </TableCell>
            <TableCell>{category.slug}</TableCell>
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
"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Plus, Tag, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useForm } from "react-hook-form"

import { categories, getCategoryColor } from "@/lib/data"

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null)

  // Make sure categories is defined before using it
	type categories={
		id:number;
		name:string;
	}

  const safeCategories: categories[]=[];

  // Check if we have any categories
  const hasData = safeCategories.length > 0

  const form = useForm({
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: { name: string }) => {
    if (editingCategory) {
      // In a real app, you would update the category in your database
      console.log("Updating category:", { ...editingCategory, name: data.name })
    } else {
      // In a real app, you would save this to your database
      const newCategory = {
        id: (safeCategories.length || 0) + 1,
        name: data.name,
      }
      console.log("New category:", newCategory)
    }

    setIsDialogOpen(false)
    setEditingCategory(null)
    form.reset()
  }

  const handleEditCategory = (category: { id: number; name: string }) => {
    setEditingCategory(category)
    form.setValue("name", category.name)
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: number) => {
    // In a real app, you would delete the category from your database
    console.log("Deleting category:", categoryId)
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    form.reset()
    setIsDialogOpen(true)
  }

  return (
    <div className="flex max-h-screen flex-col">
      
      <main className="flex justify-center">
        <div className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage your transaction categories</CardDescription>
            </CardHeader>
            <CardContent>
              {!hasData ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Tag className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No categories yet</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      Create categories to organize your transactions and track your spending.
                    </p>
                    <Button onClick={handleAddCategory}>Add your first category</Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Color</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div
                            className="h-6 w-6 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category.name) }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update the category details below." : "Enter the details for your new category."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Groceries, Rent, Salary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{editingCategory ? "Save Changes" : "Add Category"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


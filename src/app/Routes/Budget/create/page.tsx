"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { categories } from "@/lib/data"
import { useForm } from "react-hook-form"

export default function CreateBudgetPage() {
  const router = useRouter()
  type categories={
	id:number;
	name:string;
}

const safeCategories: categories[]=[]; 
 


  // Check if we have any categories

  const hasCategories = safeCategories.length > 0

  // Create a form with a field for each category
  const form = useForm({
    defaultValues: Object.fromEntries(safeCategories.map((category) => [`category-${category.id}`, "0"])),
  })

  const onSubmit = (data: any) => {
    // Transform the form data into budget objects
    const budgets = Object.entries(data).map(([key, value]) => {
      const categoryId = Number.parseInt(key.replace("category-", ""))
      return {
        categoryId,
        amount: Number.parseFloat(value as string) || 0,
        spent: 0, // New budgets start with 0 spent
      }
    })

    console.log("New budgets:", budgets)

    // In a real app, you would save these to your database
    router.push("/budgets")
  }

  if (!hasCategories) {
    return (
      <div className="flex max-h-screen flex-col">
        
        <main className="flex justify-center ">
          <div className="container max-w-md py-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Budget</CardTitle>
                <CardDescription>Set monthly spending limits for each category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    You need to create categories before you can set up budgets.
                  </p>
                  <Button asChild>
                    <Link href="/Routes/Categories">Create Categories</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-xl font-semibold">Personal Finance Visualizer</h1>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/transactions">
              <Button variant="ghost">Transactions</Button>
            </Link>
            <Link href="/budgets">
              <Button variant="ghost">Budgets</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-md py-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Budget</CardTitle>
              <CardDescription>Set monthly spending limits for each category</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {safeCategories.map((category) => (
                    <FormField
                      key={category.id}
                      control={form.control}
                      name={`category-${category.id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{category.name}</FormLabel>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <CardFooter className="flex justify-end px-0 pt-4">
                    <Button type="submit">Create Budget</Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


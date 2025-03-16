"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { categories, transactions } from "@/lib/data"
import { useForm } from "react-hook-form"

export default function AddTransactionPage() {
  const router = useRouter()
  const safeCategories = categories || []

  const form = useForm({
    defaultValues: {
      description: "",
      amount: "",
      isExpense: true,
      date: new Date(),
      category:""
    },
  })

  const onSubmit = (data: any) => {
    const finalAmount = data.isExpense
      ? -Math.abs(Number.parseFloat(data.amount))
      : Math.abs(Number.parseFloat(data.amount))

    const newTransaction = {
      id: (transactions?.length || 0) + 1,
      description: data.description,
      amount: finalAmount,
      date: data.date.toISOString(),
      category: data.category,
    }

    console.log("New transaction:", newTransaction)

    // In a real app, you would save this to your database
    // For now, we'll just log it and redirect

    router.push("/transactions")
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
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record a new income or expense</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Grocery shopping" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isExpense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "expense")}
                            defaultValue={field.value ? "expense" : "income"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="expense">Expense</SelectItem>
                              <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          {safeCategories.length > 0 ? (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {safeCategories.map((category,ind) => (
                                  <SelectItem key={ind} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex flex-col space-y-2">
                              <Input value="No categories available" disabled className="text-muted-foreground" />
                              <FormDescription>
                                <Link href="/categories" className="text-primary hover:underline">
                                  Create categories first
                                </Link>
                              </FormDescription>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <CardFooter className="flex justify-end px-0 pt-4">
                    <Button type="submit" disabled={safeCategories.length === 0}>
                      Add Transaction
                    </Button>
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


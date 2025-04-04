"use client"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useExpensesContext } from "@/app/context/DataContext"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function AddTransactionPage() {
  
  const {expenses,addExpense} =useExpensesContext();
  const [formKey, setFormKey] = useState(0);

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
    if (!data.category) {
      data.category = form.getValues("category");
    }
    addExpense(data);
    toast("Your transaction has been successfully added.", {
      style: {
        backgroundColor: 'black',
        color: 'white'
      }
    });
    form.reset({
      description: "",
      amount: "",
      isExpense: true,
      date: new Date(),
      category: ""
    });
    setFormKey(prevKey => prevKey + 1); // Increment formKey to force re-render
  }

  useEffect(()=>{
    console.log(expenses);
  },[expenses]);

  return (
    <div className="flex max-h-screen flex-col px-4  ">

      <main className="flex items-center justify-center   ">
        <div className="container max-w-md py-6">
          <Card key={formKey}>
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
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="grocery">Grocery</SelectItem>
                              <SelectItem value="shopping">Shopping</SelectItem>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="bills">Bills</SelectItem>
                              <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <CardFooter className="flex justify-end px-0 pt-4">
                    <Button type="submit" disabled={!form.watch("description") || !form.watch("amount")}>
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


"use client"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useExpensesContext } from "../context/DataContext"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useForm, SubmitHandler } from "react-hook-form"



export function TransactionDialog({ transactionId, open, onOpenChange }:any ) {

  const {expenses,updateExpense,getExpenseById,deleteExpense}=useExpensesContext();
  const transaction=getExpenseById(transactionId)[0];

  const form = useForm({
    defaultValues: {
      description: transaction.description,
      amount: transaction.amount,
      isExpense: transaction.isExpense,
      date: transaction.date,
      category:transaction.category
    },
  })

  // Set the default value for the category field
  form.setValue("category", transaction.category);

  const onSubmit =(data:any ) => {
    updateExpense(transactionId,data);
    onOpenChange(false);
  }

  const deleteTransaction=():void=>{
    deleteExpense(transactionId);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
             Make changes to your transaction here.
          </DialogDescription>
        </DialogHeader>
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
                                  {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={field.onChange}
                                initialFocus
                              />
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={field.value} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="groccery">Groccery</SelectItem>
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

                  <DialogFooter className="flex justify-end px-0 pt-4">
                    
                    <Button className="bg-red-700 transicition-all duration-300 ease-in-out hover:bg-red-500"onClick={()=>deleteTransaction()} disabled={!form.watch("description") || !form.watch("amount")}>
                      Delete
                    </Button>
                    <Button type="submit" disabled={!form.watch("description") || !form.watch("amount")}>
                      Edit
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
      </DialogContent>
    </Dialog>
  )
}


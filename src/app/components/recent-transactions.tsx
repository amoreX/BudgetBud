"use client"

import { ArrowDown, ArrowUp, Receipt } from "lucide-react"
import { useExpensesContext } from "../context/DataContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getCategoryColor, transactions } from "@/lib/data"


export default function RecentTransactions() {
  
  const {expenses}=useExpensesContext();
  const hasData=expenses.length>0;


  if (!hasData) {
    return (
      <div className="flex flex-col h-100 items-center  justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Receipt className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add your first transaction to start tracking your finances.
          </p>
          <Button asChild>
            <a href="/Routes/transactions/new">Add transaction</a>
          </Button>
        </div>
      </div>
    )
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5) // Get only the 5 most recent

  return (
    <div className="space-y-4">
      {sortedTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback style={{ backgroundColor: getCategoryColor(transaction.category) }} className="text-white">
              {transaction.isExpense?"Ex":"In"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
          <div className="ml-auto font-medium">
            {transaction.isExpense? (
              <div className="flex items-center text-red-500">
                <ArrowDown className="mr-1 h-4 w-4" />${transaction.amount}
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-4 w-4" />${transaction.amount}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}


"use client"

import { ArrowDown, ArrowUp, CreditCard, DollarSign } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { transactions } from "@/lib/data"
import { budgets } from "@/lib/data" // Import budgets

interface Transaction {
  date: string;
  amount: number;
}

export default function SummaryCards() {
  // Make sure transactions is defined before using it
  const safeTransactions: Transaction[] = transactions || []

  // Calculate summary data
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const thisMonthTransactions = safeTransactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const totalIncome = thisMonthTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = thisMonthTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
            <span>This Month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            <span>This Month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Net Savings</CardDescription>
          <CardTitle className={`text-2xl font-bold ${netSavings >= 0 ? "text-green-500" : "text-red-500"}`}>
            ${netSavings.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="mr-1 h-4 w-4" />
            <span>{savingsRate.toFixed(0)}% of income</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Budgets</CardDescription>
          <CardTitle className="text-2xl font-bold">{(budgets || []).length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <CreditCard className="mr-1 h-4 w-4" />
            <span>{safeTransactions.length > 0 ? "Track your spending" : "Set up a budget"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


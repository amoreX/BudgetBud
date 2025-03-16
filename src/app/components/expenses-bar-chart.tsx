"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { PlusCircle } from "lucide-react"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { transactions } from "@/lib/data"

interface Transaction {
  date: string;
  amount: number;
}

interface MonthlyData {
  name: string;
  expenses: number;
}

export default function ExpensesBarChart() {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const today = new Date()
  const monthlyData: MonthlyData[] = []

  // Make sure transactions is defined before using it
  const safeTransactions: Transaction[] = transactions || []

  // Check if we have any transaction data
  const hasData = safeTransactions.length > 0

  // If we have data, process it
  if (hasData) {
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = monthNames[month.getMonth()]

      const monthTransactions = safeTransactions.filter((t) => {
        const date = new Date(t.date)
        return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear()
      })

      const expenses = monthTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

      monthlyData.push({
        name: monthName,
        expenses: expenses,
      })
    }
  } else {
    // Create empty data for visualization
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = monthNames[month.getMonth()]
      monthlyData.push({
        name: monthName,
        expenses: 0,
      })
    }
  }

  // If no data, show empty state
  if (!hasData) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <PlusCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No expense data</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add transactions to see your monthly expenses chart.
          </p>
          <Button asChild>
            <a href="/Routes/Transactions/new">Add your first transaction</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        expenses: {
          label: "Expenses",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <BarChart accessibilityLayer data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${value}`} width={60} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}


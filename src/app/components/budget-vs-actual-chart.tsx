"use client"

import { Cell, Pie, PieChart } from "recharts"
import { PieChartIcon } from "lucide-react"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { categories, getCategoryColor, transactions } from "@/lib/data"

interface Transaction {
  date: string;
  amount: number;
  category: string;
}

interface Category {
  name: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function CategoryPieChart() {
  // Get current month data
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Make sure transactions and categories are defined before using them
  const safeTransactions: Transaction[] = transactions || []
  const safeCategories: Category[] = categories || []

  // Check if we have any transaction data
  const hasData = safeTransactions.length > 0 && safeCategories.length > 0

  // Process data if available
  let categoryData: CategoryData[] = [];

  if (hasData) {
    const thisMonthTransactions = safeTransactions.filter((t: Transaction) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.amount < 0
    })

    // Group by category
    categoryData = safeCategories
      .map((category: Category) => {
        const categoryTransactions = thisMonthTransactions.filter((t: Transaction) => t.category === category.name)
        const total = categoryTransactions.reduce((sum, t: Transaction) => sum + Math.abs(t.amount), 0)

        return {
          name: category.name,
          value: total,
          color: getCategoryColor(category.name),
        }
      })
      .filter((category: CategoryData) => category.value > 0)
  }

  // If no data or no expenses this month, show empty state
  if (!hasData || categoryData.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <PieChartIcon className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No category data</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">Add transactions to see your spending by category.</p>
          <Button asChild>
            <a href="/transactions/new">Add your first transaction</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer className="h-[300px]" config={{}}>
      <PieChart>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent  />} />
      </PieChart>
    </ChartContainer>
  )
}


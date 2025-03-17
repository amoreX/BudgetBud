"use client"

import { Cell, Pie, PieChart, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,ResponsiveContainer } from "recharts"
import { PieChartIcon } from "lucide-react"
import { useExpensesContext } from "../context/DataContext"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useBudgetContext } from "../context/BudgetContext"

type BudgetData = {
  name: string;
  budget: Number;
  expenses: Number;
}

export default function CategoryPieChart() {
  
  const { expenses } = useExpensesContext();
  const {budgets} =useBudgetContext();

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Make sure transactions and categories are defined before using them

  // Check if we have any transaction data
  const hasData = budgets.filter((t)=>t.amount!=0).length >0 

  // Process data if available
  const categories: string[] = ["grocery", "shopping", "bills", "income", "travel"];

  let budgetData: BudgetData[] = [];

  if (hasData) {
    const thisMonthTransactions = expenses.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // Group by category
    budgetData = categories.map((category) => {
      const categoryTransactions = thisMonthTransactions.filter((t) => t.category === category)
      const totalExpenses = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      const budget = budgets.find((data) => data.category === category)?.amount || Number(0);

      return {
        name: category,
        budget: budget,
        expenses: totalExpenses,
      }
    }).filter((category) => category.expenses > 0 || Number(category.budget) > 0)
      .filter((category) => category.name !== "income" && Number(category.budget) > 0) // Exclude "income" and budget 0
  }

  // If no data or no expenses this month, show empty state
  if (!hasData ) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <PieChartIcon className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No category data</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">Add Budgets to see your spending by category.</p>
          <Button asChild>
            <a href="/Routes/budget">Add your first Budget</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer className="h-[300px] w-full " config={{}}>
      <ResponsiveContainer width="100%" height="100%">
      <BarChart data={budgetData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#8884d8" />
        <Bar dataKey="expenses" fill="#82ca9d" />
      </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


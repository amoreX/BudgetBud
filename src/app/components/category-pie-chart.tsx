"use client"

import { Cell, Pie, PieChart, TooltipProps } from "recharts"
import { PieChartIcon } from "lucide-react"
import { JSX } from "react"
import { useExpensesContext } from "../context/DataContext"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { categories, transactions } from "@/lib/data"

const categoryColors: { [key: string]: string } = {
  grocery: "#FF6384",
  shopping: "#36A2EB",
  bills: "#FFCE56",
  income: "#4BC0C0",
  travel: "#9966FF",
}

function getCategoryColor(category: string): string {
  return categoryColors[category] || "#000000" // Default to black if category not found
}

type catData={
  name:string;
  value:number;
  color:string;
}

export default function CategoryPieChart(): JSX.Element {
  const { expenses, getExpensesByCategory } = useExpensesContext()

  // Get current month data
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const hasData = expenses.length > 0

  const categories:string[]=["grocery","shopping","bills","income","travel"];
  
  let categoryData: catData[] = []

  if (hasData) {
    // Filter transactions for the current month and year
    const thisMonthTransactions = expenses.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    console.log("thisMonthTransactions:",thisMonthTransactions);

    // Group by category
    categoryData = categories
      .map((category) => {
        const categoryTransactions = thisMonthTransactions.filter((t) => t.category == category)
        console.log("each Category:",categoryTransactions);
        const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

        return {
          name: category,
          value: total,
          color: getCategoryColor(category),
        }
      }).filter((e)=>e.value>0);
    
    console.log("Category Data:", categoryData)
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
            <a href="/Routes/transactions/new">Add your first transaction</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer className=" flex justify-center items-center" config={{}} >
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
          label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}


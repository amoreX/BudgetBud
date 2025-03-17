"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

import { useExpensesContext } from "../context/DataContext"

type monthdat={
  name:string;
  expenses:number;
}

type ExpensesBarChartProps = {
  view: string;
}

export default function ExpensesBarChart({ view }: ExpensesBarChartProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const { expenses } = useExpensesContext();
  const today = new Date()
  const hasData = expenses.length > 0
  
  let monthlyData: monthdat[] = [];
  let dailyData: monthdat[] = [];

  if (hasData) {
    if (view === "6months") {
      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const monthName = monthNames[month.getMonth()]

        const monthTransactions = expenses.filter((t) => {
          const date = new Date(t.date)
          return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear() && t.isExpense
        })

        const e = monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

        monthlyData.push({
          name: monthName,
          expenses: e,
        })
      }
    } else {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(today.getFullYear(), today.getMonth(), i)
        const dayName = `${i}`

        const dayTransactions = expenses.filter((t) => {
          const date = new Date(t.date)
          return date.getDate() === day.getDate() && date.getMonth() === day.getMonth() && date.getFullYear() === day.getFullYear() && t.isExpense
        })

        const e = dayTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

        dailyData.push({
          name: dayName,
          expenses: e,
        })
      }
    }
  } else {
    if (view === "6months") {
      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const monthName = monthNames[month.getMonth()]
        monthlyData.push({
          name: monthName,
          expenses: 0,
        })
      }
    } else {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dailyData.push({
          name: `${i}`,
          expenses: 0,
        })
      }
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
            <a href="/Routes/transactions/new">Add your first transaction</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ChartContainer
        config={{
          expenses: {
            label: "Expenses",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart accessibilityLayer data={view === "6months" ? monthlyData : dailyData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${value}`} width={60} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  )
}


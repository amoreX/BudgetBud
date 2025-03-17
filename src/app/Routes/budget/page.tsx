"use client"

import { useState, useEffect } from "react"
import { Plus, Wallet, Check } from "lucide-react"
import { useExpensesContext } from "@/app/context/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useBudgetContext } from "@/app/context/BudgetContext"
import { toast } from "sonner" // Import toast and Toaster

type catData = {
  name: string;
  value: number;
}

export default function BudgetsPage() {
  const { budgets, updateBudget } = useBudgetContext();
  const { expenses } = useExpensesContext();

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const hasData = expenses.length > 0
  const categories: string[] = ["grocery", "shopping", "bills", "income", "travel"];

  let categoryData: catData[] = [];

  if (hasData) {
    const thisMonthTransactions = expenses.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    categoryData = categories
      .map((category) => {
        const categoryTransactions = thisMonthTransactions.filter((t) => t.category == category)
        console.log("each Category:", categoryTransactions);
        const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

        return {
          name: category,
          value: total,
        }
      })
      .filter((data) => data.name !== "income"); // Filter out the "income" category

    console.log("Category Data:", categoryData)
  }

  const handleBudgetChange = (name: string, value: Number) => {
    updateBudget(name, value);
    toast("Your budget has been updated.", {
      style: {
        backgroundColor: 'black',
        color: 'white'
      }
    });
  };

  const [tempBudgets, setTempBudgets] = useState(budgets.reduce((acc, category) => {
    acc[category.category] = Number(category.amount);
    return acc;
  }, {} as Record<string, number>));

  const handleTempBudgetChange = (category: string, value: number) => {
    setTempBudgets(prev => ({ ...prev, [category]: value }));
  };

  const handleSaveBudget = (category: string) => {
    handleBudgetChange(category, tempBudgets[category]);
  };

  useEffect(() => {
    console.log(budgets);
  }, [budgets])

  return (
    <div className="flex max-h-screen flex-col p-4">
      
      <main className="flex justify-center">
        <div className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Set and track your monthly spending limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgets.filter(category => category.category !== "income").map((category) => {
                  const budget = category.amount;
                  const spent = categoryData.find((data) => data.name === category.category)?.value || 0;

                  return (
                    <div key={category.category} className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{category.category}</h3>
                        <div className={`text-sm text-nowrap ${Number(spent) <= Number(budget) ? 'text-muted-foreground' : 'text-red-500'}`}>
                          ${`${spent}`} of ${`${budget}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          id={`budget-${category.category}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={`${tempBudgets[category.category]}`}
                          onChange={(e) => handleTempBudgetChange(category.category, Number(e.target.value))}
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleSaveBudget(category.category)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* <Separator className="my-4" /> */}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


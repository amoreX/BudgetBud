"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { budgets, categories } from "@/lib/data"

export default function BudgetsPage() {
  // Make sure budgets and categories are defined before using them
  const safeBudgets :categories[]=[];
  type categories={
	id:number;
	name:string;
	categoryId:number;
	amount:number;
	spent:number;
}

const safeCategories: categories[]=[];

  // Check if we have any budget data
  const hasData = safeBudgets.length > 0 && safeCategories.length > 0

  const [activeBudgets, setActiveBudgets] = useState(safeBudgets)
  const [activeTab, setActiveTab] = useState("view")

  const handleBudgetChange = (categoryId: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setActiveBudgets(
      activeBudgets.map((budget) => (budget.categoryId === categoryId ? { ...budget, amount: numValue } : budget)),
    )
  }

  const getBudgetForCategory = (categoryId: number) => {
    return activeBudgets.find((budget) => budget.categoryId === categoryId)?.amount || 0
  }

  const getSpentForCategory = (categoryId: number) => {
    return activeBudgets.find((budget) => budget.categoryId === categoryId)?.spent || 0
  }

  const getPercentage = (spent: number, budget: number) => {
    if (budget === 0) return 0
    return Math.min(Math.round((spent / budget) * 100), 100)
  }

  // If no data, show empty state
  if (!hasData) {
    return (
      <div className="flex max-h-screen flex-col">
        
        <main className="flex justify-center">
          <div className="container py-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <Wallet className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No budgets set up</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Create your first budget to start tracking your spending against your financial goals.
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    You'll need to add some transactions first to categorize your spending.
                  </p>
                  <div className="flex gap-4">
                    <Button asChild variant="outline">
                      <a href="/Routes/transactions/new">Add transactions</a>
                    </Button>
                    <Button asChild>
                      <a href="/Routes/budget/create">Create budget</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex max-h-screen flex-col">
      <main className="flex justify-center">
        <div className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Set and track your monthly spending limits</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="view">View Budgets</TabsTrigger>
                  <TabsTrigger value="edit">Edit Budgets</TabsTrigger>
                </TabsList>
                <TabsContent value="view">
                  <div className="space-y-6">
                    {safeCategories.map((category) => {
                      const budget = getBudgetForCategory(category.id)
                      const spent = getSpentForCategory(category.id)
                      const percentage = getPercentage(spent, budget)

                      return (
                        <div key={category.id}>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-medium">{category.name}</h3>
                              <div className="text-sm text-muted-foreground">
                                ${spent.toFixed(2)} of ${budget.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-sm font-medium">{percentage}%</div>
                          </div>
                          <Progress
                            value={percentage}
                            className="mt-2"
                            // indicatorClassName={percentage > 90 ? "bg-red-500" : ""}
                          />
                          <Separator className="my-4" />
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="edit">
                  <div className="space-y-4">
                    {safeCategories.map((category) => (
                      <div key={category.id} className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor={`budget-${category.id}`} className="font-medium">
                          {category.name}
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            id={`budget-${category.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={getBudgetForCategory(category.id)}
                            onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 flex justify-end">
                      <Button>Save Budgets</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


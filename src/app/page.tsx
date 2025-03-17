"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import BudgetVsActualChart from "@/app/components/budget-vs-actual-chart"
import CategoryPieChart from "@/app/components/category-pie-chart"
import ExpensesBarChart from "@/app/components/expenses-bar-chart"
import RecentTransactions from "@/app/components/recent-transactions"
import SummaryCards from "@/app/components/summary-cards"
import SummarySkeleton from "@/app/components/summary-skeleton"
import TransactionsSkeleton from "./components/transactions-skeleton"

import { useExpensesContext } from "./context/DataContext"

export default function Dashboard() {
  const [view, setView] = useState<string>("6months") // Toggle state
  

  return (
    <div className="flex max-h-screen flex-col px-4">    
      <main className="flex-1 flex justify-center">
        <div className="container py-6 ">
          <Suspense fallback={<SummarySkeleton />}>
            <SummaryCards />
          </Suspense>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Monthly Expenses</CardTitle>
                  <CardDescription>Your spending {view==="6months"? "yearly.":"this month."}</CardDescription>
                </div>
                <Button className=" bg-white text-black border-2 transition-all duration-300 ease-in-out hover:bg-black hover:text-white" onClick={() => setView(view === "6months" ? "currentMonth" : "6months")} >
                  {view === "6months" ? "Current Month" : "Yearly"}
                </Button>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-[300px] w-full rounded-md bg-muted" />}>
                  <ExpensesBarChart view={view} />
                </Suspense>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-[300px] w-full rounded-md bg-muted" />}>
                  <CategoryPieChart />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Budget vs. Actual</CardTitle>
                <CardDescription>How you're tracking against your budget</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-[300px] w-full rounded-md bg-muted" />}>
                  <BudgetVsActualChart />
                </Suspense>
              </CardContent>
              <CardFooter>
                <Link href="/Routes/budget">
                  <Button variant="outline" className="w-full">
                    Manage Budgets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div >
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activity</CardDescription>
                </div>
                <Link href="/Routes/transactions">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="h-100  flex-col justify-center  ">
                <Suspense fallback={<TransactionsSkeleton />}>
                  <RecentTransactions />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


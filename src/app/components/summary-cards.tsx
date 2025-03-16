"use client"

import { ArrowDown, ArrowUp, CreditCard, DollarSign } from "lucide-react"
import {useState,useEffect} from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { transactions } from "@/lib/data"
import { budgets } from "@/lib/data" // Import budgets
import { useExpensesContext } from "../context/DataContext"


export default function SummaryCards() {
  const{expenses,getExpense,getIncome}=useExpensesContext();
  const[totalIncome,setIncome]=useState<number>(0);
  const[totalExpense,setExpense]=useState<number>(0);
  useEffect(()=>{
    let inc=getIncome();
    let ex=getExpense();
    if(inc){
      let total=inc.reduce((tot,each)=>tot+Number(each.amount),0); // Convert amount to number
      setIncome(total);       
    }
    if(ex){
      let total=ex.reduce((tot,each)=>tot+Number(each.amount),0); // Convert amount to number
      setExpense(total);       
    }
  },[expenses]);
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl font-bold text-green-500">${totalIncome}</CardTitle>
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
          <CardTitle className="text-2xl font-bold text-red-500">${totalExpense}</CardTitle>
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
          <CardTitle className={`text-2xl font-bold ${totalExpense>totalIncome?"text-red-500":"text-green-500"} `}>
            ${Math.abs(totalIncome-totalExpense)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="mr-1 h-4 w-4" />
            <span>Net Savings</span>
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
            {/* <span>{safeTransactions.length > 0 ? "Track your spending" : "Set up a budget"}</span> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


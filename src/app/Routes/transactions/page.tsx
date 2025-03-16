"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, Plus, Receipt } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { TransactionDialog } from "@/app/components/transaction-dialog"
import { transactions } from "@/lib/data"

export default function TransactionsPage() {
  const [sorting, setSorting] = useState<"date" | "amount">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Make sure transactions is defined before using it
	type transaction={
		id:number;
		description:string;
		category:string;
		date:number;
		amount:number;
	}
   
  const safeTransactions: transaction[] =[];

  // Check if we have any transaction data
  const hasData = safeTransactions.length > 0

  const sortedTransactions = [...safeTransactions]
    .filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sorting === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      }
    })

  const handleSort = (column: "date" | "amount") => {
    if (sorting === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSorting(column)
      setSortDirection("desc")
    }
  }

  return (
    <div className="flex max-h-screen flex-col">
      <main className="flex justify-center">
        <div className="container py-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>Manage your financial transactions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search transactions..."
                    className="w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem checked={true}>Show all categories</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={true}>Show all months</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!hasData ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Receipt className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      Add your first transaction to start tracking your finances.
                    </p>
                    <Button asChild>
                      <a href="/Routes/transactions/new">Add your first transaction</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                        <div className="flex items-center justify-end">
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction.id)}
                      >
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {transaction.category}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.amount < 0 ? "text-red-500" : "text-green-500"}>
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTransaction(transaction.id)
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {selectedTransaction !== null && (
        <TransactionDialog
          transactionId={selectedTransaction}
          open={selectedTransaction !== null}
          onOpenChange={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  )
}


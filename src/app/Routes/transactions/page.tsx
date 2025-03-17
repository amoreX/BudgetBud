"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Plus, Receipt } from "lucide-react"
import { useExpensesContext } from "@/app/context/DataContext"
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

export default function TransactionsPage() {
  const [sorting, setSorting] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Make sure transactions is defined before using it
	
   
  const {expenses}=useExpensesContext();

  // Check if we have any transaction data
  const hasData = expenses.length > 0

  const filteredTransactions = expenses.filter(
    (transaction) =>
      (selectedCategories.length === 0 || selectedCategories.includes(transaction.category)) &&
      (transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sorting === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    }
  });

  const handleSort = (column: "date" | "amount") => {
    if (sorting === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSorting(column)
      setSortDirection("desc")
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="flex max-h-screen flex-col px-4">
      <main className="flex justify-center">
        <div className="container py-4">
          <Card>
            <CardHeader>
              <div className=" flex-col sm:flex sm:flex-row items-center justify-between ">
                <div >
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription className="sm:block">Manage your financial transactions</CardDescription>
                </div>
                <div className="flex flex-row items-end sm:flex-row  gap-2 py-4  sm:my-0">
                  <Input
                    placeholder="Search transactions..."
                    className="w-[200px]"
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
                      <DropdownMenuCheckboxItem
                        checked={selectedCategories.length === 0}
                        onCheckedChange={() => setSelectedCategories([])}
                      >
                        Show all categories
                      </DropdownMenuCheckboxItem>
                      {Array.from(new Set(expenses.map((transaction) => transaction.category))).map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        >
                          {category}
                        </DropdownMenuCheckboxItem>
                      ))}
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
                          <span className={transaction.isExpense?"text-red-500" : "text-green-500"}>
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
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

      {selectedTransaction !== "" && (
        <TransactionDialog
          transactionId={selectedTransaction}
          open={selectedTransaction!==""}
          onOpenChange={() => setSelectedTransaction("")}
        />
      )}
    </div>
  )
}



import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import { JSX } from "react";

const Navbar=():JSX.Element=>{
	return(
		<header className="sticky top-0 z-10 border-b bg-white flex justify-center  ">
      <div className="container flex h-16 items-center justify-between py-4">
        <h1 className="text-xl font-semibold">BudgetBud</h1>
        <nav className="flex items-center gap-4">
        <Link href="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/Routes/Transactions">
            <Button variant="ghost">Transactions</Button>
          </Link>
          <Link href="/Routes/Budget">
            <Button variant="ghost">Budgets</Button>
          </Link>
          <Link href="/Routes/Transactions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </nav>
      </div>
    </header>
	)
};

export default Navbar;
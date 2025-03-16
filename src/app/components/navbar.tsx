"use client"

import Link from "next/link";
import {motion,AnimatePresence} from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import { JSX } from "react";
import { useState } from "react";

const Navbar=():JSX.Element=>{
  const [menuOpen, setMenuOpen] = useState(false);

	return(
		<header className="sticky top-0 z-10 border-b bg-white flex justify-center">
      <div className="flex items-center justify-between w-full p-4  mx-auto">
        <h1 className="text-xl font-semibold ">BudgetBud</h1>
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <nav className="hidden sm:flex items-center gap-2 sm:gap-4 flex-wrap">
          <Link href="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/Routes/transactions">
            <Button variant="ghost">Transactions</Button>
          </Link>
          <Link href="/Routes/budget">
            <Button variant="ghost">Budgets</Button>
          </Link>
          <Link href="/Routes/transactions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </nav>
      </div>
      <AnimatePresence
      
      >
      {menuOpen && (
        <div className="fixed inset-0  bg-opacity-50 z-20" onClick={() => setMenuOpen(false)}>
          <motion.div className="fixed inset-y-0 right-0 bg-white w-64 p-4 z-30"
          initial={{x:200}}
          transition={{type:"tween",ease:"easeInOut",duration:0.23}}
          animate={{x:0}}
          exit={{x:200}}
          >
            <nav className="flex flex-col gap-4">
              <Link href="/">
                <Button variant="ghost" onClick={() => setMenuOpen(false)}>Dashboard</Button>
              </Link>
              <Link href="/Routes/transactions">
                <Button variant="ghost" onClick={() => setMenuOpen(false)}>Transactions</Button>
              </Link>
              <Link href="/Routes/budget">
                <Button variant="ghost" onClick={() => setMenuOpen(false)}>Budgets</Button>
              </Link>
              <Link href="/Routes/transactions/new">
                <Button onClick={() => setMenuOpen(false)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </Link>
            </nav>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </header>
	)
};

export default Navbar;
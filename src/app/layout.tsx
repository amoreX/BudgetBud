import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BudgetBud",
  description: "A friednly neighbourhood payment tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-10 border-b bg-white flex justify-center">
      <div className="container flex h-16 items-center justify-between py-4">
        <h1 className="text-xl font-semibold">BudgetBud</h1>
        <nav className="flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="ghost">Transactions</Button>
          </Link>
          <Link href="/budgets">
            <Button variant="ghost">Budgets</Button>
          </Link>
          <Link href="/transactions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </nav>
      </div>
    </header>
        {children}
      </body>
    </html>
  );
}

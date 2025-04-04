"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

interface Budget {
	category: string;
	amount: Number;
}

const categories: string[] = ["grocery", "shopping", "bills", "income", "travel"];

interface BudgetContextProps {
	budgets: Budget[];
	updateBudget: (id: string, newAmount: Number) => void;
	activeBudgets: () => Budget[];
}

const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
	const [budgets, setBudgets] = useState<Budget[]>(
		() => {
			// Fetch budgets from local storage or initialize with default categories
			const storedBudgets = localStorage.getItem("budgets");
			return storedBudgets ? JSON.parse(storedBudgets) : categories.map(category => ({ category, amount: 0 }));
		}
	);

	const updateBudget = (id: string, newAmount: Number) => {
		setBudgets((prev) =>
			prev.map((budg) =>
				budg.category === id ? { ...budg, amount: newAmount } : budg
			)
		);
	};

	const activeBudgets = () => {
		return budgets.filter((budg) => Number(budg.amount) > 0);
	};

	// Save budgets to local storage whenever they change
	useEffect(() => {
		localStorage.setItem("budgets", JSON.stringify(budgets));
	}, [budgets]);

	return (
		<BudgetContext.Provider
			value={{ budgets, updateBudget, activeBudgets }}
		>
			{children}
		</BudgetContext.Provider>
	);
};

export const useBudgetContext = () => {
	const context = useContext(BudgetContext);
	if (!context) {
		throw new Error("useBudgetContext must be used within an BudgetProvider");
	}
	return context;
};
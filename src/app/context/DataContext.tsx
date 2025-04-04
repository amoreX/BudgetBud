"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {v4 as uuidv4} from "uuid";

interface Expense{
	id:string;
	isExpense:boolean;
	amount:number;
	category:string;
	date:string;
	description:string;
}

interface ExpenseContextProps{
	expenses:Expense[],
	addExpense:(expense:Expense) => void;
	updateExpense:(id:string,updatedExpense:Partial<Expense>) => void;
	deleteExpense:(id:string)=>void;
	getTotalExpenses:()=>number;
	getExpenseById:(id:string)=>Expense[];
	getExpensesByCategory:(category:string)=>Expense[];
	getIncome:()=>Expense[];
	getExpense:()=>Expense[];
	loading: boolean; // Added loading property
}


const ExpenseContext = createContext<ExpenseContextProps | undefined> (undefined);

export const ExpenseProvider =({children}:{children:ReactNode})=>{
	const [expenses,setExpenses]=useState<Expense[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchExpenses = () => {
			try {
				// Fetch expenses from local storage
				const storedExpenses = localStorage.getItem("expenses");
				if (storedExpenses) {
					setExpenses(JSON.parse(storedExpenses));
				}
			} catch (error) {
				console.error("Error fetching expenses from local storage:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchExpenses();
	}, []);

	const addExpense=(expense:Omit<Expense,'id'>)=>{
		try {
			if(expense.amount !== 0){
				const newExpense = { ...expense, id: uuidv4() };
				setExpenses((prevExpenses) => {
					const updatedExpenses = [...prevExpenses, newExpense];
					// Update local storage
					localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
					return updatedExpenses;
				});
			}
		} catch (error) {
			console.error("Error adding expense:", error);
		}
	};

	const updateExpense=(id:string,updatedExpense:Partial<Expense>)=>{
		setExpenses((prevExpenses) => {
			const updatedExpenses = prevExpenses.map((expense) =>
				expense.id === id ? { ...expense, ...updatedExpense } : expense
			);
			// Update local storage
			localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
			return updatedExpenses;
		});
	};

	const deleteExpense=(id:string)=>{
		try {
			if(id){
				setExpenses((prevExpenses) => {
					const updatedExpenses = prevExpenses.filter((expense) => expense.id !== id);
					// Update local storage
					localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
					return updatedExpenses;
				});
			}
		} catch (error) {
			console.error("Error deleting expense:", error);
		}
	};

	const getTotalExpenses =()=>{
		return expenses.reduce((total,expense)=>total+expense.amount,0);
	};

	const getExpenseById=(id:string)=>{
		return expenses.filter((expense)=>expense.id===id);
	};

	const getExpensesByCategory = (category: string) => {
		return expenses.filter((expense) => expense.category === category);
	};

	const getIncome=()=>{
		return expenses.filter((expense)=>expense.isExpense==false);
	};

	const getExpense=()=>{
		return expenses.filter((expense)=>expense.isExpense==true);
	};

	return (
		<ExpenseContext.Provider
		value={{
			expenses,
			addExpense,
			updateExpense,
			deleteExpense,
			getExpenseById,
			getExpensesByCategory,
			getTotalExpenses,
			getIncome,
			getExpense,
			loading // Added loading to the context value
		}}
		>
			{children}
		</ExpenseContext.Provider>
	);
};

export const useExpensesContext = () => {
	const context = useContext(ExpenseContext);
	if (!context) {
	  throw new Error("useExpensesContext must be used within an ExpensesProvider");
	}
	return context;
};
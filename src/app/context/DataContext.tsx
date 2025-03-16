"use client"

import { exec } from "child_process";
import { execPath } from "process";
import { createContext,useContext,useState,ReactNode } from "react";
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
}


const ExpenseContext = createContext<ExpenseContextProps | undefined> (undefined);

export const ExpenseProvider =({children}:{children:ReactNode})=>{
	const [expenses,setExpenses]=useState<Expense[]>([]);

	const addExpense=(expense:Omit<Expense,'id'>)=>{
		const newExpense = { ...expense, id: uuidv4() };
		setExpenses((prevExpense)=>[...prevExpense,newExpense]);
	};

	const updateExpense=(id:string,updatedExpense:Partial<Expense>)=>{
		setExpenses((prevExpenses)=>
		prevExpenses.map((expense)=>
			expense.id===id?{...expense,...updatedExpense}:expense
		));
	};

	const deleteExpense=(id:string)=>{
		setExpenses((prevExpense)=>
			prevExpense.filter((expense)=>expense.id!==id)
		);
	};

	const getTotalExpenses =()=>{
		return expenses.reduce((total,expense)=>total+expense.amount,0);
	};

	const getExpenseById=(id:string)=>{
		return expenses.filter((expense)=>expense.id===id);
	}
	const getExpensesByCategory = (category: string) => {
		return expenses.filter((expense) => expense.category === category);
	};

	return (
		<ExpenseContext.Provider
		value={{expenses,addExpense,updateExpense,deleteExpense,getExpenseById,getExpensesByCategory,getTotalExpenses}}
		>
			{children}
		</ExpenseContext.Provider>
	)

};

export const useExpensesContext = () => {
	const context = useContext(ExpenseContext);
	if (!context) {
	  throw new Error("useExpensesContext must be used within an ExpensesProvider");
	}
	return context;
};
"use client"

import { exec } from "child_process";
import { execPath } from "process";
import { createContext,useContext,useState,ReactNode,useEffect } from "react";
import {v4 as uuidv4} from "uuid";
import axios from 'axios';

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
}


const ExpenseContext = createContext<ExpenseContextProps | undefined> (undefined);

export const ExpenseProvider =({children}:{children:ReactNode})=>{
	const [expenses,setExpenses]=useState<Expense[]>([]);

	useEffect(() => {
		const fetchExpenses = async () => {
			try {
				const res = await axios.get("/api/fetchTransaction");
	
				// Directly set the expenses state
				setExpenses(res.data.expenses.expenses);
			} catch (error) {
				console.error("Error fetching expenses:", error);
			}
		};
		fetchExpenses();
	}, []);

	const addExpense=async (expense:Omit<Expense,'id'>)=>{
		try {
			if(expense.amount!=0){

				const newExpense = { ...expense, id: uuidv4() };
				const response = await axios.post('/api/addTransaction', {id:newExpense.id,isExpense:newExpense.isExpense,amount:newExpense.amount,description:newExpense.description,date:newExpense.date,category:newExpense.category});
				setExpenses((prevExpense)=>[...prevExpense, newExpense]);
			}
		} catch (error) {
			console.error("Error adding expense:", error);
		}
	};

	const updateExpense=(id:string,updatedExpense:Partial<Expense>)=>{
		
				setExpenses((prevExpenses)=>
				prevExpenses.map((expense)=>
					expense.id===id?{...expense,...updatedExpense}:expense
				));
		
	};

	const deleteExpense=async(id:string)=>{
		try {
			if(id){

				const response = await axios.post('/api/deleteTransaction', {id:id});
				setExpenses((prevExpense)=>
					prevExpense.filter((expense)=>expense.id!==id)
				);
			}
		} catch (error) {
			console.error("Error adding expense:", error);
		}
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

	const getIncome=()=>{
		return expenses.filter((expense)=>expense.isExpense==false);
	};

	const getExpense=()=>{
		return expenses.filter((expense)=>expense.isExpense==true);
		
	};

	return (
		<ExpenseContext.Provider
		value={{expenses,addExpense,updateExpense,deleteExpense,getExpenseById,getExpensesByCategory,getTotalExpenses,getIncome,getExpense}}
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
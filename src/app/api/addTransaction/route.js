import mongoose, { connect } from "mongoose";
import { connectDB } from "../db/connection";
import { expenseModel } from "../models/Expense";

export const POST = async (req, res) => {
	const { id, isExpense, amount, category, date, description } = await req.json(); // Correctly parse the request body
	console.log(id, isExpense, amount, category);
	await connectDB();
	try {
		if (!id || isExpense === undefined || !amount || !category || !date || !description) {
			return new Response(JSON.stringify({ message: "Incomplete data" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const checkingUser = await expenseModel.findOne({ username: "dummy-user" });

		if (checkingUser) {
			// User exists, update the expenses list
			checkingUser.expenses.push({
				id: id,
				isExpense: isExpense,
				amount: amount,
				category: category,
				date: date,
				description: description,
			});

			await checkingUser.save();
			return new Response(JSON.stringify({ message: "Transaction updated" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			// User does not exist, create a new user with the transaction
			const newUser = new expenseModel({
				username: "dummy-user",
				expenses: [
					{
						id: id,
						isExpense: isExpense,
						amount: amount,
						category: category,
						date: date,
						description: description,
					},
				],
			});
			await newUser.save();
			return new Response(JSON.stringify({ message: "Transaction added and new user created" }), {
				status: 201,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (err) {
		console.log(err);
		return new Response(JSON.stringify({ message: "Transaction Add Failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

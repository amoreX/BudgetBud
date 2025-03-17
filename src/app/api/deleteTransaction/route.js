import mongoose, { connect } from "mongoose";
import { connectDB } from "../db/connection";
import { expenseModel } from "../models/Expense";

export const POST = async (req, res) => {
	const { id } = await req.json(); // Correctly parse the request body
	console.log(id);
	await connectDB();
	try {
		if (!id) {
			return new Response(JSON.stringify({ message: "Incomplete data" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const checkingUser = await expenseModel.findOne({ username: "dummy-user" });

		if (checkingUser) {
			// User exists, delete the expense with the given id
			checkingUser.expenses = checkingUser.expenses.filter((expense) => expense.id !== id);

			await checkingUser.save();
			return new Response(JSON.stringify({ message: "Transaction deleted" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			return new Response(JSON.stringify({ message: "User not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (err) {
		console.log(err);
		return new Response(JSON.stringify({ message: "Transaction Delete Failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

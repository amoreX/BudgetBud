import mongoose, { connect } from "mongoose";
import { connectDB } from "../db/connection";
import { expenseModel } from "../models/Expense";

export const GET = async (req, res) => {
	await connectDB();
	try {
		const expenses = await expenseModel.findOne({ username: "dummy-user" });

		if (expenses) {
			// console.log(expenses);
			return new Response(JSON.stringify({ expenses: expenses }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			return new Response(JSON.stringify({ message: "NO data" }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (err) {
		console.log(err);
		return new Response(JSON.stringify({ message: "User auth failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

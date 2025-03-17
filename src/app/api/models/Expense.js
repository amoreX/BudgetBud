const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
	username: { type: String, required: true },
	expenses: [
		{
			id: { type: String, required: true },
			isExpense: { type: Boolean, required: true },
			amount: { type: Number, required: true },
			category: { type: String, required: true },
			date: { type: String, required: true },
			description: { type: String, required: true },
		},
	],
});

export const expenseModel = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

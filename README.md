# BudgetBud

BudgetBud is a comprehensive budgeting application designed to help users manage their finances effectively. The application provides various features such as tracking monthly expenses, visualizing spending by category, comparing budget vs. actual spending, and viewing recent transactions.

## Features

- **Dashboard**: Overview of your financial status with summary cards, charts, and recent transactions.
- **Monthly Expenses**: Visual representation of your spending over the last 6 months or the current month.
- **Spending by Category**: Pie chart showing the breakdown of your spending by category for the current month.
- **Budget vs. Actual**: Comparison of your budgeted vs. actual spending.
- **Recent Transactions**: List of your latest financial activities.

## Backend Functionality

### Adding Transactions

Transactions can be added via the `/api/addTransaction` endpoint. The backend uses MongoDB to store transaction data. When a new transaction is added, it is assigned a unique ID and stored in the database.

### Fetching Transactions

Transactions can be fetched via the `/api/fetchTransaction` endpoint. The backend retrieves the transaction data from MongoDB and sends it to the client.

### Deleting Transactions

Transactions can be deleted via the `/api/deleteTransaction` endpoint. The backend removes the specified transaction from MongoDB.

### Editing Transactions

Editing transactions is handled client-side. The application allows users to update transaction details locally, but these changes are not persisted to the backend.

## Database

The application uses MongoDB as its database. The connection to MongoDB is established using Mongoose. The connection details are specified in the `src/app/api/db/connection.js` file.

```js
// filepath: /home/nihal/Documents/repos/coding/budgetbud/src/app/api/db/connection.js
import mongoose from "mongoose";
export async function connectDB() {
	try {
		await mongoose.connect(
			"mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=bud"
		);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(err);
	}
}
export default connectDB;
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB credentials.

## Pages and Components

### Dashboard

The main page of the application providing an overview of your financial status.

- **SummaryCards**: Displays key financial metrics.
- **ExpensesBarChart**: Bar chart showing monthly expenses.
- **CategoryPieChart**: Pie chart showing spending by category.
- **BudgetVsActualChart**: Chart comparing budgeted vs. actual spending.
- **RecentTransactions**: List of recent transactions.

### Components

- **SummarySkeleton**: Skeleton loader for summary cards.
- **TransactionsSkeleton**: Skeleton loader for recent transactions.

### Context

- **DataContext**: Provides context for managing expenses data.

## Getting Started

To get started with BudgetBud, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/budgetbud.git
   ```

2. Install dependencies:
   ```sh
   cd budgetbud
   npm install
   ```

3. Set up environment variables for MongoDB connection.

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

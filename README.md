# BudgetBud

BudgetBud is a comprehensive budgeting application designed to help users manage their finances effectively. The application provides various features such as tracking monthly expenses, visualizing spending by category, comparing budget vs. actual spending, and viewing recent transactions.

## Features

- **Dashboard**: Overview of your financial status with summary cards, charts, and recent transactions.
- **Monthly Expenses**: Visual representation of your spending over the last 6 months or the current month.
- **Spending by Category**: Pie chart showing the breakdown of your spending by category for the current month.
- **Budget vs. Actual**: Comparison of your budgeted vs. actual spending.
- **Recent Transactions**: List of your latest financial activities.

## Data Storage

BudgetBud now uses **local storage** to persist budget data. This means that all budget information is stored directly in the user's browser and does not rely on a backend server. 

### Advantages of Local Storage
- Faster access to data as it is stored locally.
- No need for a backend server, simplifying deployment.

### Limitations
- Data is tied to the specific browser and device. Switching devices or clearing browser storage will result in data loss.
- Not suitable for multi-user or collaborative scenarios.

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

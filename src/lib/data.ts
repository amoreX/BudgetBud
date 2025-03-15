// This file can be empty or contain empty arrays to simulate no data
// Mock data for the application

// Categories
export const categories = []

// Transactions
export const transactions = []

// Budgets
export const budgets = []

// Helper function to get a color for a category
export function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    Food: "#4CAF50",
    Housing: "#2196F3",
    Transportation: "#FF9800",
    Entertainment: "#9C27B0",
    Shopping: "#F44336",
    Utilities: "#607D8B",
    Healthcare: "#00BCD4",
    Income: "#8BC34A",
  }

  return colorMap[categoryName] || "#9E9E9E"
}


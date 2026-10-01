export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

export interface StorageData {
  tasks: Task[];
  expenses: Expense[];
}
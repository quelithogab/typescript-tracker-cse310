import { readFile, writeFile } from 'node:fs/promises';
import type { Task, Expense, StorageData } from './models.js';

export class TaskManager {
  private filePath: string;
  private data: StorageData = { tasks: [], expenses: [] };

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Loads persisted data from the local JSON file using async/await.
   */
  async loadData(): Promise<void> {
    try {
      const fileContent = await readFile(this.filePath, 'utf-8');
      this.data = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist, start with empty data and save initial structure
      this.data = { tasks: [], expenses: [] };
      await this.saveData();
    }
  }

  /**
   * Saves current data back to the JSON file.
   */
  async saveData(): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // Task Operations
  addTask(title: string): Task {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.data.tasks.push(newTask);
    return newTask;
  }

  listTasks(): Task[] {
    return this.data.tasks;
  }

  toggleTask(id: number): boolean {
    const task = this.data.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      return true;
    }
    return false;
  }

  // Expense Operations
  addExpense(description: string, amount: number, category: string): Expense {
    const newExpense: Expense = {
      id: Date.now(),
      description,
      amount,
      category,
    };
    this.data.expenses.push(newExpense);
    return newExpense;
  }

  listExpenses(): Expense[] {
    return this.data.expenses;
  }

  getExpenseSummary(): number {
    return this.data.expenses.reduce((total, exp) => total + exp.amount, 0);
  }
}
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { TaskManager } from './manager.js';

async function main() {
  const manager = new TaskManager('./data.json');
  await manager.loadData();

  const rl = readline.createInterface({ input, output });
  let running = true;

  console.log('=== TypeScript Task & Expense Tracker ===');

  while (running) {
    console.log('\nOptions:');
    console.log('1. Add Task');
    console.log('2. List Tasks');
    console.log('3. Toggle Task Completion');
    console.log('4. Add Expense');
    console.log('5. List Expenses');
    console.log('6. View Expense Summary');
    console.log('7. Exit');

    const choice = await rl.question('\nSelect an option (1-7): ');

    switch (choice.trim()) {
      case '1': {
        const title = await rl.question('Enter task title: ');
        manager.addTask(title);
        await manager.saveData();
        console.log('Task added successfully.');
        break;
      }
      case '2': {
        console.log('\n--- Tasks ---');
        const tasks = manager.listTasks();
        if (tasks.length === 0) console.log('No tasks found.');
        tasks.forEach((t) =>
          console.log(`[${t.completed ? 'X' : ' '}] ID: ${t.id} - ${t.title}`)
        );
        break;
      }
      case '3': {
        const idStr = await rl.question('Enter task ID to toggle: ');
        const success = manager.toggleTask(Number(idStr));
        if (success) {
          await manager.saveData();
          console.log('Task status updated.');
        } else {
          console.log('Task not found.');
        }
        break;
      }
      case '4': {
        const desc = await rl.question('Expense description: ');
        const amtStr = await rl.question('Amount: ');
        const cat = await rl.question('Category: ');
        manager.addExpense(desc, parseFloat(amtStr), cat);
        await manager.saveData();
        console.log('Expense recorded.');
        break;
      }
      case '5': {
        console.log('\n--- Expenses ---');
        const expenses = manager.listExpenses();
        if (expenses.length === 0) console.log('No expenses found.');
        expenses.forEach((e) =>
          console.log(`ID: ${e.id} | ${e.description} | $${e.amount} [${e.category}]`)
        );
        break;
      }
      case '6': {
        console.log(`\nTotal Spent: $${manager.getExpenseSummary().toFixed(2)}`);
        break;
      }
      case '7': {
        running = false;
        console.log('Goodbye!');
        break;
      }
      default:
        console.log('Invalid option. Please enter a number between 1 and 7.');
    }
  }

  rl.close();
}

main().catch(console.error);
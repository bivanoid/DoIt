import Dexie from "dexie";
import type { Table } from "dexie";

export interface Todo {
  id?: number;
  task: string;
  level: number;
  status: boolean;
  createdAt: string;
  deadline?: string | null; 
}

class MyDB extends Dexie {
  todos!: Table<Todo>;

  constructor() {
        super('myDatabase');
        this.version(2).stores({ // naikkan versi jika sudah ada data sebelumnya
            todos: '++id, task, level, status, createdAt'
        });
    }
}

export const db = new MyDB();
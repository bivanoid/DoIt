import Dexie from "dexie";
import type { Table } from "dexie";

export interface Todo {
	id?: number;
	task: string;
	day: number | null; // null kalau kategori "Penting", bukan hari tertentu
	isPenting: boolean;
	status: boolean;
	createdAt: string;
	deadline?: string | null;
}
class MyDB extends Dexie {
	todos!: Table<Todo>;

	constructor() {
		super("myDatabase");
		this.version(5).stores({
			todos: "++id, task, day, status, createdAt",
		});
	}
}

export const db = new MyDB();

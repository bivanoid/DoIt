import Dexie from "dexie";
import type { Table } from "dexie";

export interface Todo {
	id?: number;
	task: string;
	category: string; // Category name (e.g., "Tugas", "Aktifitas", "Liburan", or custom)
	status: boolean;
	createdAt: string;
	deadline?: string | null;
}

export interface Category {
	id?: number;
	name: string;
	isDefault: boolean; // true for built-in categories
	color?: string; // Optional: for future color coding
}

class MyDB extends Dexie {
	todos!: Table<Todo>;
	categories!: Table<Category>;

	constructor() {
		super("myDatabase");
		this.version(6).stores({
			todos: "++id, category, status, createdAt",
			categories: "++id, name, isDefault",
		});
		this.on("populate", () => this.populateDefaults());
	}

	async populateDefaults() {
		const defaultCategories: Category[] = [
			{ name: "Tugas", isDefault: true },
			{ name: "Aktifitas", isDefault: true },
			{ name: "Liburan", isDefault: true },
		];
		await this.categories.bulkAdd(defaultCategories);
	}
}

export const db = new MyDB();
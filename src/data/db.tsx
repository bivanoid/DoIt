import Dexie from "dexie";
import type { Table } from "dexie";

export interface Todo {
	id?: number;
	task: string;
	category: string;
	status: boolean;
	createdAt: string;
	deadline?: string | null;
}

export interface Category {
	id?: number;
	name: string;
	isDefault: boolean;
	color?: string;
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
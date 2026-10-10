import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

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

// ---------- Mapper snake_case <-> camelCase ----------
const toTodo = (r: any): Todo => ({
	id: r.id,
	task: r.task,
	category: r.category,
	status: r.status,
	createdAt: r.created_at,
	deadline: r.deadline,
});

const toCategory = (r: any): Category => ({
	id: r.id,
	name: r.name,
	isDefault: r.is_default,
	color: r.color ?? undefined,
});

// ---------- Todos ----------
export const todoApi = {
	async getAll(): Promise<Todo[]> {
		const { data, error } = await supabase
			.from("todos")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) throw error;
		return data.map(toTodo);
	},

	async add(todo: Omit<Todo, "id" | "createdAt">): Promise<Todo> {
		const { data, error } = await supabase
			.from("todos")
			.insert({
				task: todo.task,
				category: todo.category,
				status: todo.status,
				deadline: todo.deadline ?? null,
			})
			.select()
			.single();
		if (error) throw error;
		return toTodo(data);
	},

	async update(id: number, changes: Partial<Todo>) {
		const payload: any = {};
		if (changes.task !== undefined) payload.task = changes.task;
		if (changes.category !== undefined) payload.category = changes.category;
		if (changes.status !== undefined) payload.status = changes.status;
		if (changes.deadline !== undefined) payload.deadline = changes.deadline;

		const { error } = await supabase.from("todos").update(payload).eq("id", id);
		if (error) throw error;
	},

	async remove(id: number) {
		const { error } = await supabase.from("todos").delete().eq("id", id);
		if (error) throw error;
	},
};

// ---------- Categories ----------
export const categoryApi = {
	async getAll(): Promise<Category[]> {
		const { data, error } = await supabase
			.from("categories")
			.select("*")
			.order("id");
		if (error) throw error;
		return data.map(toCategory);
	},

	async add(cat: Omit<Category, "id">): Promise<Category> {
		const { data, error } = await supabase
			.from("categories")
			.insert({ name: cat.name, is_default: cat.isDefault, color: cat.color })
			.select()
			.single();
		if (error) throw error;
		return toCategory(data);
	},

	async remove(id: number) {
		const { error } = await supabase.from("categories").delete().eq("id", id);
		if (error) throw error;
	},
};
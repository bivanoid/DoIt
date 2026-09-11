import { CalendarCheckIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { Todo, Category } from "../data/db";
import { db } from "../data/db";
import TodoItem from "./TodoItem";
import s from "./TodoList.module.css";

interface Props {
	todos: Todo[] | undefined;
	deletingId: number | null;
	onDelete: (id: number) => void;
}

export default function TodoList({ todos, deletingId, onDelete }: Props) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const cats = await db.categories.toArray();
				setCategories(cats);
			} catch (error) {
				console.error("Error loading categories:", error);
			} finally {
				setIsLoadingCategories(false);
			}
		};
		loadCategories();
	}, [todos]);

	if (!todos || todos.length === 0) {
		return (
			<div className={s.empty_state}>
				<div className={s.empty_icon}>
					<CalendarCheckIcon />
				</div>
				<h3>Tidak ada tugas</h3>
				<p>Semua beres! Tambahkan tugas baru.</p>
			</div>
		);
	}

	if (isLoadingCategories) {
		return (
			<div className={s.empty_state}>
				<h3>Memuat kategori...</h3>
			</div>
		);
	}

	const grouped = categories.reduce(
		(acc, category) => {
			const filtered = todos.filter((t) => t.category === category.name);
			if (filtered.length > 0) {
				acc[category.name] = {
					todos: filtered,
					isDefault: category.isDefault,
				};
			}
			return acc;
		},
		{} as Record<string, { todos: Todo[]; isDefault: boolean }>,
	);

	const categoryNames = categories
		.filter((cat) => grouped[cat.name])
		.map((cat) => cat.name);

	return (
		<>
			{categoryNames.map((categoryName) => {
				const { todos: items, isDefault } = grouped[categoryName];

				return (
					<div key={categoryName} className={s.group}>
						<div
							className={`${s.header_item} ${isDefault ? s.default_category : s.custom_category}`}
						>
							<div className={`${s.title_level}`}>
								<span className={s.category_name}>{categoryName}</span>
							</div>
							<h1 className={s.count_level}>{items.length}</h1>
						</div>
						<div className={s.items_wrapper}>
							{items.map((todo) => (
								<TodoItem
									todo={todo}
									isDeleting={deletingId === todo.id}
									onDelete={onDelete}
								/>
							))}
						</div>
					</div>
				);
			})}
		</>
	);
}

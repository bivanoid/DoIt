import { CalendarCheckIcon } from "lucide-react";
import type { Todo } from "../data/db";
import TodoItem from "./TodoItem";
import s from "./TodoList.module.css";

interface Props {
	todos: Todo[] | undefined;
	deletingId: number | null;
	onDelete: (id: number) => void;
}

const PENTING = 0;
const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

const DAY_LABELS: Record<number, string> = {
	1: "Senin",
	2: "Selasa",
	3: "Rabu",
	4: "Kamis",
	5: "Jumat",
	6: "Sabtu",
	7: "Minggu",
};

const labelForDays = (day: number) => DAY_LABELS[day] ?? "Unknown";

const getTodayInSystem = () => {
	const jsDay = new Date().getDay();
	return jsDay === 0 ? 7 : jsDay;
};

export default function TodoList({ todos, deletingId, onDelete }: Props) {
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

	const penting = todos.filter((t) => t.day === PENTING);

	const grouped = DAYS.reduce(
		(acc, day) => {
			const filtered = todos.filter((t) => t.day === day);
			if (filtered.length > 0) acc[day] = filtered;
			return acc;
		},
		{} as Record<number, Todo[]>,
	);

	const today = getTodayInSystem();

	return (
		<>
			{/* Kategori spesial, selalu di atas */}
			{penting.length > 0 && (
				<div className={s.group}>
					<div className={`${s.header_item} ${s.penting}`}>
						<h1 className={s.title_level}>
							
							Kustom
						</h1>
						<h1 className={s.count_level}>{penting.length}</h1>
					</div>
					{penting.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							isDeleting={deletingId === todo.id}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}

			{/* 7 hari biasa */}
			{DAYS.map((day) => {
				const items = grouped[day];
				if (!items) return null;

				const isToday = day === today;

				return (
					<div key={day} className={s.group}>
						<div className={`${s.header_item} ${isToday ? s.today : ""}`}>
							<h1 className={s.title_level}>
								{isToday? (<span className={s.today_indicator}></span>) : "" }
								{labelForDays(day)}
							</h1>
							<h1 className={s.count_level}>{items.length}</h1>
						</div>
						{items.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								isDeleting={deletingId === todo.id}
								onDelete={onDelete}
							/>
						))}
					</div>
				);
			})}
		</>
	);
}

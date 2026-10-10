import { useEffect, useState, useCallback } from "react";
import { todoApi } from "../data/db";
import type { Todo } from "../data/db";
import { Plus } from "lucide-react";
import TodoList from "../components/TodoList";
import s from "./dashboard.module.css";
import WeatherClock from "../components/WheaterClock";
import Add from "./add";

export default function Dashboard() {
	// undefined = masih memuat (sama seperti hasil useLiveQuery sebelumnya)
	const [todos, setTodos] = useState<Todo[] | undefined>(undefined);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [openAdd, setOpenAdd] = useState(false);

	const loadTodos = useCallback(async () => {
		try {
			setTodos(await todoApi.getAll());
		} catch (error) {
			console.error("Gagal memuat todo:", error);
			setTodos([]);
		}
	}, []);

	useEffect(() => {
		loadTodos();
	}, [loadTodos]);

	useEffect(() => {
		document.body.style.overflow = openAdd ? "hidden" : "auto";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [openAdd]);

	const handleDelete = (id: number) => {
		setDeletingId(id);
		setTimeout(async () => {
			try {
				await todoApi.remove(id);
				await loadTodos();
			} catch (error) {
				console.error("Gagal menghapus todo:", error);
				alert("Gagal menghapus tugas. Coba lagi.");
			} finally {
				setDeletingId(null);
			}
		}, 300);
	};

	const bgRedup: React.CSSProperties = {
		transition: "filter 0.5s",
		filter: openAdd ? "brightness(20%)" : "brightness(100%)",
		pointerEvents: openAdd ? "none" : "auto",
	};

	return (
		<div className={s.container}>
			<div className={s.con_weather} style={bgRedup}>
				<WeatherClock />
			</div>

			<div style={bgRedup} className={s.con_items}>
				<TodoList
					todos={todos}
					deletingId={deletingId}
					onDelete={handleDelete}
				/>
			</div>
			<div className={`${s.container_add} ${openAdd ? s.show : s.close}`}>
				<Add keFalse={() => setOpenAdd(false)} onSaved={loadTodos} />
			</div>
			<div
				onClick={() => setOpenAdd((prev) => !prev)}
				style={bgRedup}
				className={s.add_items}
			>
				<Plus /> Buat Baru
			</div>
		</div>
	);
}
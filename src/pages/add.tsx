import s from "./add.module.css";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { db } from "../data/db";
import { scheduleNotification } from "../utils/notif";

const formatCreatedAt = (): string => {
	const now = new Date();
	const day = now.getDate().toString().padStart(2, "0");
	const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
	return `${day} ${month}`;
};

type AddProps = {
	keFalse: () => any;
};

const PENTING = 0;

const DAY_LABELS: Record<number, string> = {
	1: "Sen",
	2: "Sel",
	3: "Rab",
	4: "Kam",
	5: "Jum",
	6: "Sab",
	7: "Min",
};

export default function Add({ keFalse }: AddProps) {
	const [task, setTask] = useState("");
	const [day, setDay] = useState<number>(3);
	const [useDeadline, setUseDeadline] = useState(false);
	const [deadlineDate, setDeadlineDate] = useState("");
	const todayStr = new Date().toISOString().split("T")[0];

	const addTodo = async () => {
		if (!task) return;
		let deadlineISO: string | null = null;
		if (useDeadline) {
			if (!deadlineDate) {
				alert("Pilih tanggal deadline!");
				return;
			}
			deadlineISO = new Date(deadlineDate).toISOString();
		}
		await db.todos.add({
			task,
			day,
			isPenting: day === PENTING,
			status: false,
			createdAt: formatCreatedAt(),
			deadline: deadlineISO,
		});
		if (deadlineISO) {
			await scheduleNotification(task, deadlineISO);
		}
		setTask("");
		setDeadlineDate("");
		setUseDeadline(false);
		keFalse();
	};

	return (
		<>
			<div className={s.items}>
				<div className={s.title}>
					<p>Tambah Tugas</p>
					<button onClick={keFalse} className={s.floating_btn}>
						<X className={s.logo_x} />
					</button>
				</div>
				<div className={s.form}>
					<div className={s.level_option}>
						<label
							className={`${s.radio} ${s.radioPenting} ${
								day === PENTING ? s.radioActive : ""
							}`}
						>
							<input
								type="radio"
								name="day"
								value={PENTING}
								checked={day === PENTING}
								onChange={() => setDay(PENTING)}
							/>
							<span className={s.custom}>Kustom</span>
						</label>
						{[1, 2, 3, 4, 5, 6, 7].map((val) => (
							<label
								key={val}
								className={`${s.radio} ${day === val ? s.radioActive : ""}`}
							>
								<input
									type="radio"
									name="day"
									value={val}
									checked={day === val}
									onChange={(e) => setDay(Number(e.target.value))}
								/>
								<span className={s.custom}>{DAY_LABELS[val]}</span>
							</label>
						))}
					</div>

					<textarea
						className={s.inputDesc}
						value={task}
						onChange={(e) => setTask(e.target.value)}
						placeholder="Masukkan tugas..."
					/>
					<label className={s.deadlineToggle}>
						<label htmlFor="">
							<Check />
							<input
								type="checkbox"
								checked={useDeadline}
								onChange={(e) => setUseDeadline(e.target.checked)}
								name="checkbox"
							/>
						</label>
						<p>Tambahin Deadline?</p>
					</label>
					{useDeadline && (
						<div className={s.deadlineInputs}>
							<input
								type="date"
								className={s.deadlineDate}
								value={deadlineDate}
								min={todayStr}
								onClick={(e) =>
									(e.target as HTMLInputElement).showPicker()
								}
								onChange={(e) => setDeadlineDate(e.target.value)}
							/>
						</div>
					)}
					<button
						style={{ filter: !task ? "saturate(0%)" : "saturate(100%)" }}
						disabled={!task}
						onClick={async () => {
							await addTodo();
						}}
						onKeyDown={(e) => e.key === "Enter" && keFalse()}
					>
						<h1>Tambahkan</h1>
					</button>
				</div>
			</div>
		</>
	);
}

import s from "./add.module.css";
import { useState, useEffect } from "react";
import { Check, X, Plus, LayoutDashboard } from "lucide-react";
import { todoApi, categoryApi, type Category } from "../data/db";
import { scheduleNotification } from "../utils/notif";

type AddProps = {
	keFalse: () => void;
	onSaved?: () => void | Promise<void>;
};

export default function Add({ keFalse, onSaved }: AddProps) {
	const [task, setTask] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("Tugas");
	const [useDeadline, setUseDeadline] = useState(false);
	const [deadlineDate, setDeadlineDate] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [showAddCategory, setShowAddCategory] = useState(false);
	const [saving, setSaving] = useState(false);
	const todayStr = new Date().toISOString().split("T")[0];

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const cats = await categoryApi.getAll();
				setCategories(cats);
				if (cats.length > 0) {
					setSelectedCategory(cats[0].name);
				}
			} catch (error) {
				console.error("Gagal memuat kategori:", error);
				alert("Gagal memuat kategori. Periksa koneksi internet Anda.");
			}
		};
		loadCategories();
	}, []);

	const addTodo = async () => {
		if (!task || !selectedCategory || saving) return;

		let deadlineISO: string | null = null;
		if (useDeadline) {
			if (!deadlineDate) {
				alert("Pilih tanggal deadline!");
				return;
			}
			deadlineISO = new Date(deadlineDate).toISOString();
		}

		setSaving(true);
		try {
			// createdAt tidak dikirim: kolom created_at diisi otomatis oleh database
			await todoApi.add({
				task,
				category: selectedCategory,
				status: false,
				deadline: deadlineISO,
			});

			if (deadlineISO) {
				await scheduleNotification(task, deadlineISO);
			}

			setTask("");
			setDeadlineDate("");
			setUseDeadline(false);
			setNewCategoryName("");
			setShowAddCategory(false);

			await onSaved?.();
			keFalse();
		} catch (error) {
			console.error("Gagal menyimpan todo:", error);
			alert("Gagal menyimpan tugas. Coba lagi.");
		} finally {
			setSaving(false);
		}
	};

	const handleAddCategory = async () => {
		const trimmedName = newCategoryName.trim();
		if (!trimmedName) return;

		const exists = categories.some(
			(cat) => cat.name.toLowerCase() === trimmedName.toLowerCase(),
		);
		if (exists) {
			alert("Kategori sudah ada!");
			return;
		}

		try {
			await categoryApi.add({
				name: trimmedName,
				isDefault: false,
			});

			const updatedCategories = await categoryApi.getAll();
			setCategories(updatedCategories);
			setSelectedCategory(trimmedName);
			setNewCategoryName("");
			setShowAddCategory(false);
		} catch (error) {
			console.error("Gagal menambah kategori:", error);
			alert("Gagal menambah kategori. Coba lagi.");
		}
	};

	const handleDeleteCategory = async (
		categoryId: number | undefined,
		categoryName: string,
	) => {
		if (!categoryId) return;

		const category = categories.find((c) => c.name === categoryName);
		if (category?.isDefault) {
			alert("Tidak bisa menghapus kategori bawaan!");
			return;
		}

		const confirmDelete = window.confirm(
			`Hapus kategori "${categoryName}"? Tugas dengan kategori ini tidak akan terhapus.`,
		);
		if (!confirmDelete) return;

		try {
			await categoryApi.remove(categoryId);
			const updatedCategories = await categoryApi.getAll();
			setCategories(updatedCategories);

			if (selectedCategory === categoryName && updatedCategories.length > 0) {
				setSelectedCategory(updatedCategories[0].name);
			}
		} catch (error) {
			console.error("Gagal menghapus kategori:", error);
			alert("Gagal menghapus kategori. Coba lagi.");
		}
	};

	return (
		<>
			<div
				className={s.items}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						addTodo();
					}
					if (e.key === "Escape") {
						keFalse();
					}
				}}
			>
				<div className={s.title}>
					<p>Buat Baru</p>
					<button onClick={keFalse} className={s.floating_btn}>
						<X className={s.logo_x} />
					</button>
				</div>
				<div className={s.form}>
					<div className={s.categorySection}>
						<div className={s.categoryGrid}>
							{categories.map((category) => (
								<div key={category.id} className={s.categoryItem}>
									<button
										className={`${s.categoryBtn} ${
											selectedCategory === category.name
												? s.categoryBtnActive
												: ""
										}`}
										onClick={() => setSelectedCategory(category.name)}
									>
										{selectedCategory === category.name && (
											<span className={s.tag}># </span>
										)}
										{category.name}
									</button>
									{!category.isDefault && (
										<button
											className={s.deleteBtn}
											onClick={() =>
												handleDeleteCategory(
													category.id,
													category.name,
												)
											}
											title="Hapus kategori"
										>
											<X size={14} />
										</button>
									)}
								</div>
							))}
							{!showAddCategory && (
								<button
									className={s.addCategoryBtn}
									onClick={() => setShowAddCategory(true)}
								>
									<LayoutDashboard size={16} />
									<span>Tambah Kategori</span>
								</button>
							)}
						</div>
						{showAddCategory && (
							<div className={s.addCategoryForm}>
								<input
									type="text"
									className={s.categoryInput}
									placeholder="Nama kategori baru..."
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									// onKeyDown={(e) => {
									// 	if (e.key === "Enter") {
									// 		handleAddCategory();
									// 	}
									// 	if (e.key === "Escape") {
									// 		setShowAddCategory(false);
									// 		setNewCategoryName("");
									// 	}
									// }}
									autoFocus
								/>
								<button
									className={s.confirmAddBtn}
									onClick={handleAddCategory}
									disabled={!newCategoryName.trim()}
								>
									<Check size={26} />
								</button>
								<button
									className={s.cancelAddBtn}
									onClick={() => {
										setShowAddCategory(false);
										setNewCategoryName("");
									}}
								>
									<X size={26} />
								</button>
							</div>
						)}
					</div>

					<textarea
						className={s.inputDesc}
						value={task}
						onChange={(e) => setTask(e.target.value)}
						placeholder="Apapun itu"
					/>

					<label className={s.deadlineToggle}>
						<label htmlFor="deadline-check">
							<div className={s.square}></div>
							<input
								id="deadline-check"
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
						style={{
							filter:
								!task || !selectedCategory || saving
									? "saturate(0%)"
									: "saturate(100%)",
						}}
						disabled={!task || !selectedCategory || saving}
						onClick={async () => {
							await addTodo();
						}}
					>
						<h1>
							<Plus size={16} /> {saving ? "Menyimpan..." : "Tambahkan"}
						</h1>
					</button>
				</div>
			</div>
		</>
	);
}
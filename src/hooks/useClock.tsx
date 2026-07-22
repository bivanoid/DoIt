import { useEffect, useState } from "react";

interface ClockData {
	time: string;
	day: string;
	date: string;
}

export function useClock() {
	const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
	const [clock, setClock] = useState<ClockData>({
		time: "",
		day: "",
		date: ""
	});

	useEffect(() => {
		const update = () => {
			const now = new Date();
			const h = now.getHours();
			const m = now.getMinutes();
			const day: number = now.getDay();
			const date = now.getDate()
			const month = now
				.toLocaleString("en-US", { month: "short" })
				.toUpperCase();
			const year = now.getFullYear()

			setClock({
				time: `${h < 10 ? "0" + h : h}.${m < 10 ? "0" + m : m}`,
				day: `${namaHari[day]}`,
				date: `${date} / ${month} / ${year}`
			});
		};

		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, []);

	return clock;
}

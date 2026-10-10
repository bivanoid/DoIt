import { useState } from "react";
import { LogOut } from "lucide-react";
import { useClock } from "../hooks/useClock";
import { supabase } from "../data/db";
import s from "./WeatherClock.module.css";

export default function WeatherClock() {
	const clock = useClock();
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogout = async () => {
		setLoggingOut(true);
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Gagal keluar:", error);
			alert("Gagal keluar. Coba lagi.");
			setLoggingOut(false);
		}
	};

	return (
		<div className={s.con_title}>
			<div className={s.title}>
				{/* <h1>Do It!</h1> */}
				<h1>{clock.time}</h1>
				<p className={s.dates}>
					<span><span className={s.red}>[</span>{clock.day}<span className={s.red}>]</span></span> {clock.date}
				</p>
			</div>
			<div className="separator"></div>
			<button
				type="button"
				className={s.logout}
				onClick={handleLogout}
				disabled={loggingOut}
			>
				<LogOut size={16} />
				{loggingOut ? "Logout...." : "Logout"}
			</button>
		</div>
	);
}
import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../data/db";
import s from "./login.module.css"
type Mode = "masuk" | "daftar";

function translateError(message: string): string {
	const m = message.toLowerCase();
	if (m.includes("invalid login credentials"))
		return "Email atau kata sandi salah.";
	if (m.includes("email not confirmed"))
		return "Email belum dikonfirmasi. Cek kotak masuk Anda.";
	if (m.includes("already registered") || m.includes("already been registered"))
		return "Email ini sudah terdaftar. Silakan masuk.";
	if (m.includes("password should be at least"))
		return "Kata sandi minimal 6 karakter.";
	if (m.includes("rate limit"))
		return "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";
	if (m.includes("fetch") || m.includes("network"))
		return "Tidak bisa terhubung ke server. Periksa koneksi internet Anda.";
	return message;
}

export default function Login() {
	const [mode, setMode] = useState<Mode>("masuk");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

	const isLogin = mode === "masuk";

	const switchMode = (next: Mode) => {
		setMode(next);
		setError(null);
		setInfo(null);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setInfo(null);
		setLoading(true);

		try {
			if (isLogin) {
				const { error } = await supabase.auth.signInWithPassword({
					email: email.trim(),
					password,
				});
				if (error) throw error;
			} else {
				const { data, error } = await supabase.auth.signUp({
					email: email.trim(),
					password,
				});
				if (error) throw error;
				if (!data.session) {
					setInfo(
						"Akun dibuat. Kami mengirim tautan konfirmasi ke email Anda, buka tautan itu lalu masuk.",
					);
					setMode("masuk");
					setPassword("");
				}
			}
		} catch (err) {
			setError(translateError((err as Error).message));
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="login">
			<form className={s.con_form} onSubmit={handleSubmit} noValidate={false}>
				<h1>{isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}</h1>
				{info && (
					<div className="login__msg login__msg--info" role="status">
						{info}
					</div>
				)}
				{error && (
					<div className="login__msg login__msg--error" role="alert">
						{error}
					</div>
				)}

				<label className="login__field">
					<span>Email</span>
					<input
						type="email"
						autoComplete="email"
						placeholder="nama@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>

				<label className="login__field">
					<span>Password</span>
					<div className={s.con_input}>
						<input
							type={showPassword ? "text" : "password"}
							autoComplete={isLogin ? "current-password" : "new-password"}
							placeholder={isLogin ? "Kata sandi Anda" : "Minimal 6 karakter"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							minLength={6}
							required
						/>
						<button
							type="button"
							className="login__toggle"
							onClick={() => setShowPassword((v) => !v)}
							aria-pressed={showPassword}
						>
							{showPassword ? "Sembunyikan" : "Tampilkan"}
						</button>
					</div>
				</label>

				<button className="login__submit" type="submit" disabled={loading}>
					{loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
				</button>

				<button
					type="button"
					onClick={() => switchMode(isLogin ? "daftar" : "masuk")}
				>
					{isLogin ? "Daftar" : "Masuk"}
				</button>
			</form>
		</main>
	);
}
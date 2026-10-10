import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../data/db";
import s from "./login.module.css"
import { Eye, EyeClosed } from "lucide-react";
type Mode = "masuk" | "daftar";
import logo from "../../../public/favicon.svg"

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
		<main className={s.con_main}>
			<form className={s.con_form} onSubmit={handleSubmit} noValidate={false}>
				<img src={logo} />
				<h1>{isLogin ? "Login to your acconut" : "Create new account"}</h1>
				{info && (
					<div className={s.msg_info} role="status">
						{info}
					</div>
				)}
				{error && (
					<div className={s.msg_error} role="alert">
						{error}
					</div>
				)}

				<label className={s.inp_email}>
					<span>Email</span>
					<input
						type="email"
						autoComplete="email"
						placeholder="yourEmail@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>

				<label className={s.inp_pass}>
					<span>Password</span>
					<div className={s.con_input}>
						<input
							type={showPassword ? "text" : "password"}
							autoComplete={isLogin ? "current-password" : "new-password"}
							placeholder={isLogin ? "Type your password" : "Min 6 Characters"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							minLength={6}
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							aria-pressed={showPassword}
						>
							{showPassword ? (<Eye size={24}/>) : (<EyeClosed size={24}/>) }
						</button>
					</div>
				</label>

				<button className={s.btn_submit} type="submit" disabled={loading}>
					{loading ? "Proccessing..." : isLogin ? "Login" : "Register"}
				</button>

				<button
					className={s.btn_switch}
					type="button"
					onClick={() => switchMode(isLogin ? "daftar" : "masuk")}
				>
					{isLogin ? "Register" : "Login"}
				</button>
			</form>
		</main>
	);
}
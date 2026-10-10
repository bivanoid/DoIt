import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../data/db";
export function useSession() {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Ambil session yang tersimpan (jika sebelumnya sudah login)
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});

		// Dengarkan perubahan: login, logout, token diperbarui
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, newSession) => {
				setSession(newSession);
			},
		);

		return () => listener.subscription.unsubscribe();
	}, []);

	return { session, loading };
}
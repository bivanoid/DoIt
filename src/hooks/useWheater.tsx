import { useEffect, useState } from "react";

interface WeatherData {
	country: string;
	city: string;
	province: string;
	temp_c: number;
	temp_f: number;
	wind: number;
	isOffline: boolean;
}

export function useWeather() {
	const [kota, setKota] = useState<string>("Jakarta");
	const [weather, setWeather] = useState<WeatherData>({
		country: "",
		city: "",
		province: "",
		temp_c: 0,
		temp_f: 0,
		wind: 0,
		isOffline: false,
	});

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
				const res = await fetch(
					`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${kota}&aqi=no`,
				);
				const data = await res.json();
				setWeather({
					country: data.location.country,
					city: data.location.name,
					province: data.location.region,
					temp_c: data.current.temp_c,
					temp_f: data.current.temp_f,
					wind: data.current.wind_kph,
					isOffline: false,
				});
			} catch {
				setWeather((prev) => ({ ...prev, isOffline: true }));
			}
		};
		fetchWeather();
	}, [kota]);

	return { ...weather, setKota };
}

import { useEffect, useState } from 'react'

interface ClockData {
    time: string;
    date: string;
    periodeHari: string;
}

export function useClock() {
    const [clock, setClock] = useState<ClockData>({
        time: "", date: "", periodeHari: ""
    });

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const day = now.getDate().toString();
            const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
            let periodeHari = "";

            setClock({
                time: `${h < 10 ? "0" + h : h}.${m < 10 ? "0" + m : m}`,
                date: `${day} ${month}`,
                periodeHari,
            });
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return clock;
}
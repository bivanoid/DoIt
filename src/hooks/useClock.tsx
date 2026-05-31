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

            let textPopup = "";
            let periodeHari = "";

            if (h >= 3 && h < 12) {
                periodeHari = "MORNING :. [3 ~ 12]";
                textPopup = "Wake up mdfk!";
            } else if (h >= 12 && h < 15) {
                periodeHari = "AFTERNOON :. [12 ~ 15]";
                textPopup = "Have you had lunch yet?";
            } else if (h >= 15 && h < 18) {
                periodeHari = "EVENING :. [15 ~ 18]";
                textPopup = "Oh yeah, I think you should head home soon";
            } else {
                periodeHari = "NIGHT :. [18 ~ 03]";
                textPopup = "Gaming, doing homework, or sleeping?";
            }

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
import { useState } from 'react'
import { useClock } from '../hooks/useClock'
import s from './WeatherClock.module.css'
import { useWeather } from '../hooks/useWheater';
import { Check, RefreshCcw, RefreshCw, ThermometerSnowflake, ThermometerSun, X } from 'lucide-react';

export default function WeatherClock() {
    const weather = useWeather();
    const clock = useClock();
    const [switchSuhu, setSwitchSuhu] = useState(false);
    const [rotateRefresh, setRotateRefresh] = useState(false);
    const [menggantiKota, setGantiKota] = useState(false);
    const [inputKota, setInputKota] = useState("");
    const getTemperatureClass = () => {
        const temp = switchSuhu ? weather.temp_f : weather.temp_c;

        if (switchSuhu) {
            if (temp > 95) return s.temperature_hot;
            if (temp > 68) return s.temperature_warm;
            return s.temperature_cold;
        } else {
            if (temp > 35) return s.temperature_hot;
            if (temp > 20) return s.temperature_warm;
            return s.temperature_cold;
        }
    };

    const handleRefreshAnim = () => {
        setRotateRefresh(true);
        setTimeout(() => setRotateRefresh(false), 1000);
        setSwitchSuhu(prev => !prev);
    }

    const getTemperatureIcon = () => {
        const temp = switchSuhu ? weather.temp_f : weather.temp_c;
        const threshold = switchSuhu ? { hot: 95, warm: 68 } : { hot: 35, warm: 20 };

        if (temp > threshold.hot) return <ThermometerSun />;
        if (temp > threshold.warm) return <ThermometerSun />;
        return <ThermometerSnowflake />;
    };

    const handleGantiKota = () => {
        if (!inputKota.trim()) return;
        weather.setKota(inputKota.trim());
        setInputKota("");
        setGantiKota(false);
    };


    const temperature = (
        <span className={`${s.temperature} ${getTemperatureClass()}`}>
            {getTemperatureIcon()}
        </span>
    );

    return (
        <div className={s.con_title}>
            <div className={s.title}>
                {/* <h1>Do It!</h1> */}
                <h1>{clock.time}</h1>
                {/* <p>{clock.date} :. {clock.periodeHari}</p> */}
            </div>
            {!menggantiKota && (
                <div className={s.wheater}>
                {weather.isOffline ? (
                    <p>Sedang Offline</p>
                ) : (
                    <>
                        <p onClick={() => setGantiKota(true)}>{weather.country} : . {weather.province} : . {weather.city}</p>
                        <p className={s.suhu}>
                            <button disabled={rotateRefresh} className={`${s.switch_temperature} ${rotateRefresh ? s.rotated : ''}`} onClick={handleRefreshAnim}>
                                <RefreshCw className={rotateRefresh ? s.spin : ''} size={15} />
                            </button>
                            {switchSuhu ? weather.temp_f : weather.temp_c}° {switchSuhu ? "F" : "C"} {temperature}
                        </p>
                    </>
                )}
            </div>
            )}
            {menggantiKota && (
                <div className={s.con_input_kota}>
                    <input
                        type="text"
                        placeholder="Masukkan nama kota"
                        value={inputKota}
                        onChange={(e) => setInputKota(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleGantiKota()}
                        autoFocus
                    />
                    <button onClick={handleGantiKota}><Check/></button>
                    <button onClick={() => setGantiKota(false)}><X/></button>
                </div>
            )}
        </div>
    );
}
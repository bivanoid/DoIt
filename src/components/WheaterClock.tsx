import { useState } from 'react'
import { useClock } from '../hooks/useClock'
import s from './WeatherClock.module.css'
import { useWeather } from '../hooks/useWheater';
import { ThermometerSnowflake, ThermometerSun } from 'lucide-react';

export default function WeatherClock() {
    const weather = useWeather();
    const clock = useClock();
    const [switchSuhu, setSwitchSuhu] = useState(false);
    const temperature = weather.temp_c > 35 || weather.temp_f > 50 ? <ThermometerSun/> : <ThermometerSnowflake/>;

    return (
        <div className={s.con_title}>
            <div className={s.title}>
                {/* <h1>Do It!</h1> */}
                <h1>{clock.time}</h1>
                {/* <p>{clock.date} :. {clock.periodeHari}</p> */}
            </div>
            <div className={s.wheater}>
                {weather.isOffline ? (
                    <p>Sedang Offline</p>
                ) : (
                    <>
                        <p>{weather.country} :. {weather.province} :. {weather.city}</p>
                        <p>{switchSuhu ? weather.temp_f : weather.temp_c}° {switchSuhu ? "F" : "C"} <span className={s.temperature}>{temperature}</span></p>
                        
                        {/* <button className={s.switch_temperature} onClick={() => setSwitchSuhu(prev => !prev)}><Thermometer/></button> */}
                    </>
                )}
            </div>
        </div>
    );
}
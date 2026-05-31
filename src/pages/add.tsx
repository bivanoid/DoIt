import s from './add.module.css'
import { useState } from "react";
import { Check, X } from 'lucide-react';
import { db } from '../data/db';
import { scheduleNotification } from '../utils/notif';

const formatCreatedAt = (): string => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} :. ${hours}.${minutes}`;
};

type AddProps = {
    keFalse: () => any;
};

export default function Add({ keFalse }: AddProps) {
    const [task, setTask] = useState("");
    const [level, setLevel] = useState<number>(3);

    const [useDeadline, setUseDeadline] = useState(false);
    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlineTime, setDeadlineTime] = useState("");

    const todayStr = new Date().toISOString().split("T")[0];

    const addTodo = async () => {
        if (!task) return;

        let deadlineISO: string | null = null;

        if (useDeadline) {
            if (!deadlineDate || !deadlineTime) {
                alert("Pilih tanggal dan jam deadline!");
                return;
            }
            deadlineISO = new Date(`${deadlineDate}T${deadlineTime}`).toISOString();
        }

        await db.todos.add({
            task,
            level,
            status: false,
            createdAt: formatCreatedAt(),
            deadline: deadlineISO,
        });
        if (deadlineISO) {
            await scheduleNotification(task, deadlineISO);
        }

        setTask("");
        setDeadlineDate("");
        setDeadlineTime("");
        setUseDeadline(false);
    };

    return (
        <>
            <div className={s.items}>
                <div className={s.title}>
                    <p>{"Add Task"}</p>
                    <p onClick={keFalse} className={s.floating_btn}><X/></p>
                </div>
                <div className={s.form}>
                    <div className={s.level_option}>
                        {[1, 2, 3].map((val) => (
                            
                            <label key={val} className={s.radio}>
                                {/* <h1>{titleRadio(val)}</h1> */}
                                <input
                                    type="radio"
                                    value={val}
                                    checked={level === val}
                                    onChange={(e) => setLevel(Number(e.target.value))}
                                />
                                <span className={s.custom}></span>
                            </label>
                        ))}
                    </div>
                    <textarea
                        className={s.inputDesc}
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Masukkan tugas..."
                    />
                    <label className={s.deadlineToggle}>
                        <label htmlFor="">
                            <Check/>
                            <input
                            type="checkbox"
                            checked={useDeadline}
                            onChange={(e) => setUseDeadline(e.target.checked)}
                            name='checkbox'
                            />
                        </label>
                        <p>Add Deadline?</p>
                    </label>
                    {useDeadline && (
                        <div className={s.deadlineInputs}>
                            <input
                                type="date"
                                className={s.deadlineDate}
                                value={deadlineDate}
                                min={todayStr}
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}

                                onChange={(e) => setDeadlineDate(e.target.value)}
                            />
                            <input
                                type="time"
                                className={s.deadlineTime}
                                value={deadlineTime}
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                onChange={(e) => setDeadlineTime(e.target.value)}
                            />
                        </div>
                    )}

                    <button 
                    style={{filter: !task ? "saturate(0%)" : "saturate(100%)"}}
                    disabled={!task }
                    onClick={async () => { await addTodo(); keFalse(); }}><h1>Let's Go</h1></button>
                </div>
            </div>
        </>
    );
}
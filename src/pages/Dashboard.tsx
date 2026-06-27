import { useEffect, useState } from 'react'
import { db } from '../data/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus } from 'lucide-react'
import TodoList from '../components/TodoList'
import s from './dashboard.module.css'
import WeatherClock from '../components/WheaterClock'
import Add from './add'

export default function Dashboard() {
    const todos = useLiveQuery(() => db.todos.toArray(), []);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [openAdd, setOpenAdd] = useState(false);

    useEffect(() => {
        document.body.style.overflow = openAdd ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [openAdd]);

    const handleDelete = (id: number) => {
        setDeletingId(id);
        setTimeout(async () => {
            await db.todos.delete(id);
            setDeletingId(null);
        }, 300);
    };

    const bgRedup: React.CSSProperties = {
        transition: "filter 0.5s",
        filter: openAdd ? "brightness(20%)" : "brightness(100%)",
        pointerEvents: openAdd ? "none" : "auto",
    };

    return (
        <div className={s.container} >
            <div style={bgRedup}>
                <WeatherClock />
            </div>
            
            <div style={bgRedup} className={s.con_items}>
                <TodoList
                    todos={todos}
                    deletingId={deletingId}
                    onDelete={handleDelete}
                />
            </div>
            <div className={`${s.container_add} ${openAdd ? s.show : s.close}`}>
                <Add keFalse={() => setOpenAdd(false)} />
            </div>
            <div onClick={() => setOpenAdd(prev => !prev)} style={bgRedup} className={s.title_items}>
                <Plus />
            </div>
        </div>
    );
}
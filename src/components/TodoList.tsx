import { CalendarCheckIcon } from 'lucide-react'
import type { Todo } from '../data/db'  // ← tambah ini
import TodoItem from './TodoItem'
import s from './TodoList.module.css'

interface Props {
    todos: Todo[] | undefined;
    deletingId: number | null;
    onDelete: (id: number) => void;
}

const labelForLevel = (level: number) => {
    switch (level) {
        case 1: return 'Important';
        case 2: return 'Warning';
        case 3: return 'Normal';
        default: return 'Unknown';
    }
};

export default function TodoList({ todos, deletingId, onDelete }: Props) {
    if (!todos || todos.length === 0) {
        return (
            <div className={s.empty_state}>
                <div className={s.empty_icon}><CalendarCheckIcon /></div>
                <h3>Tidak ada tugas</h3>
                <p>Semua beres! Tambahkan tugas baru.</p>
            </div>
        );
    }

    const grouped = [1, 2, 3].reduce((acc, level) => {
        const filtered = todos.filter(t => t.level === level);
        if (filtered.length > 0) acc[level] = filtered;
        return acc;
    }, {} as Record<number, Todo[]>);

    return (
        <>
            {[1, 2, 3].map(level => grouped[level] && (
                <div key={level} className={s.group}>
                    <div className={s.header_item}>
                        <h1 className={s.title_level}>
                            <span className={s[labelForLevel(level)]}></span>
                            {labelForLevel(level)}
                        </h1>
                        <h1 className={s.count_level}>{grouped[level].length}</h1>
                    </div>
                    {grouped[level].map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            isDeleting={deletingId === todo.id}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}
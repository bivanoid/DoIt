import { Check } from 'lucide-react'
import type { Todo } from '../data/db'  // ← tambah ini
import s from './TodoItem.module.css'

// ← hapus interface Todo yang manual

interface Props {
    todo: Todo;
    isDeleting: boolean;
    onDelete: (id: number) => void;
}

const isOverdue = (isoString: string) => new Date(isoString) < new Date();

const formatDeadline = (isoString: string): string => {
    const d = new Date(isoString);
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = d.toLocaleString("en-US", { month: "long" });
    const yy = d.getFullYear().toString().slice(-2);
    const hh = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${dd} :. ${mm} :. ${yy} [${hh}.${min}]`;
};

export default function TodoItem({ todo, isDeleting, onDelete }: Props) {
    return (
        <li
            style={{
                opacity: isDeleting ? 0 : 1,
                height: isDeleting ? '0%' : '100%',
                transition: 'opacity 0.3s ease, height 0.3s ease',
                userSelect: 'none',
            }}
            className={s.todo_item}
        >
            <div className={s.todo_header}>
                <button
                    className={s.delete_btn}
                    onClick={() => onDelete(todo.id!)}
                    aria-label="Hapus tugas"
                >
                    <Check />
                </button>
            </div>
            <div className={s.con_task}>
                <p className={s.con_task}>{todo.task}</p>
            {todo.deadline && (
                <p className={`${s.deadline} ${isOverdue(todo.deadline) ? s.overdue : ''}`}>
                    {isOverdue(todo.deadline) ? "Outdate Since : " : ''}
                    {formatDeadline(todo.deadline)}
                </p>
            )}
            </div>
        </li>
    );
}
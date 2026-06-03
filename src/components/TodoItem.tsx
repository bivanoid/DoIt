import { Check } from 'lucide-react'
import type { Todo } from '../data/db'
import s from './TodoItem.module.css'

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
    const day = d.toLocaleString("en-US", { weekday: "long" });
    return `${dd} : . ${mm} : . ${yy}, ${day}`;
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
                    <p
                        className={`${s.deadline} ${isOverdue(todo.deadline) ? s.overdue : ''}`}
                        style={{ color: isOverdue(todo.deadline) ? 'var(--danger)' : '' }}
                    >
                        {formatDeadline(todo.deadline)}
                    </p>
                )}
            </div>
        </li>
    );
}
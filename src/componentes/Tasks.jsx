import {
  ChevronRight,
  Trash2,
  Check,
  ClipboardList,
  AlertCircle,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDueDateInfo } from "../utils/dueDate";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-accent-soft border border-accent/20 flex items-center justify-center mb-4">
        <ClipboardList size={28} className="text-accent" />
      </div>
      <p className="text-ink-700 font-medium">Nenhuma tarefa por aqui</p>
      <p className="text-ink-400 text-sm mt-1">
        Adicione sua primeira tarefa acima ✨
      </p>
    </div>
  );
}

function DueDateBadge({ dueDate, isCompleted }) {
  const info = getDueDateInfo(dueDate, isCompleted);
  if (!info) return null;

  const variantClass = {
    overdue: "badge-overdue",
    today: "badge-today",
    soon: "badge-soon",
    future: "badge-future",
    done: "badge-done",
  }[info.variant];

  const Icon =
    info.variant === "overdue"
      ? AlertCircle
      : info.variant === "today"
        ? Clock
        : CalendarDays;

  return (
    <span className={variantClass}>
      <Icon size={11} strokeWidth={2.5} />
      {info.label}
    </span>
  );
}

function Tasks({ tasks, onTaskClick, onDeleteTaskClick }) {
  const navigate = useNavigate();

  function onSeeDetails(task) {
    const query = new URLSearchParams();
    query.set("title", task.title);
    query.set("description", task.description);
    if (task.dueDate) query.set("dueDate", task.dueDate);
    navigate(`/tasks?${query.toString()}`);
  }

  if (tasks.length === 0) {
    return (
      <div className="soft-card p-2">
        <EmptyState />
      </div>
    );
  }

  return (
    <ul className="soft-card p-4 space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="group flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-soft border border-transparent hover:border-ink-300/30 transition-all animate-slide-in"
        >
          <button
            onClick={() => onTaskClick(task.id)}
            className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              task.isCompleted
                ? "bg-accent border-accent"
                : "border-ink-300 hover:border-accent"
            }`}
            aria-label={
              task.isCompleted ? "Marcar como pendente" : "Concluir tarefa"
            }
          >
            {task.isCompleted && (
              <Check size={14} strokeWidth={3} className="text-white" />
            )}
          </button>

          <button
            onClick={() => onTaskClick(task.id)}
            className="flex-1 text-left min-w-0"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-medium ${
                  task.isCompleted
                    ? "text-ink-400 line-through"
                    : "text-ink-900"
                }`}
              >
                {task.title}
              </span>
              <DueDateBadge
                dueDate={task.dueDate}
                isCompleted={task.isCompleted}
              />
            </div>
          </button>

          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onSeeDetails(task)}
              className="btn-ghost"
              aria-label="Ver detalhes"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => onDeleteTaskClick(task.id)}
              className="btn-danger"
              aria-label="Excluir tarefa"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Tasks;

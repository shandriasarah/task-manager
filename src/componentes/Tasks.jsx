import {
  ChevronRight,
  Trash2,
  Check,
  ClipboardList,
  AlertCircle,
  Clock,
  CalendarDays,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDueDateInfo } from "../utils/dueDate";
import CategoryChip from "./CategoryChip";

function EmptyState({ message, hint }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-accent-soft dark:bg-accent/15 border border-accent/20 flex items-center justify-center mb-4">
        <ClipboardList size={28} className="text-accent" />
      </div>
      <p className="text-ink-700 dark:text-ink-300 font-medium">{message}</p>
      <p className="text-ink-400 text-sm mt-1">{hint}</p>
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

function PriorityDot({ priority }) {
  const colorClass = {
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  }[priority || "medium"];

  const label = {
    high: "Prioridade alta",
    medium: "Prioridade média",
    low: "Prioridade baixa",
  }[priority || "medium"];

  return (
    <span
      className={`flex-shrink-0 w-1.5 self-stretch rounded-full ${colorClass}`}
      title={label}
      aria-label={label}
    />
  );
}

function Tasks({
  tasks,
  getCategory,
  onTaskClick,
  onDeleteTaskClick,
  onEditTask,
  emptyMessage = "Nenhuma tarefa por aqui",
  emptyHint = "Adicione sua primeira tarefa acima ✨",
}) {
  const navigate = useNavigate();

  function onSeeDetails(task) {
    const query = new URLSearchParams();
    query.set("title", task.title);
    query.set("description", task.description);
    if (task.startDate) query.set("startDate", task.startDate);
    if (task.endDate) query.set("endDate", task.endDate);
    if (task.priority) query.set("priority", task.priority);
    if (task.categoryId) query.set("categoryId", task.categoryId);
    navigate(`/tasks?${query.toString()}`);
  }

  if (tasks.length === 0) {
    return (
      <div className="soft-card p-2">
        <EmptyState message={emptyMessage} hint={emptyHint} />
      </div>
    );
  }

  return (
    <ul className="soft-card p-4 space-y-2">
      {tasks.map((task) => {
        const category = task.categoryId ? getCategory?.(task.categoryId) : null;
        return (
          <li
            key={task.id}
            className="group flex items-stretch gap-3 p-3 rounded-xl bg-surface dark:bg-white/[0.02] hover:bg-surface-soft dark:hover:bg-white/[0.05] border border-transparent hover:border-ink-300/30 dark:hover:border-white/[0.06] transition-all animate-slide-in"
          >
            <PriorityDot priority={task.priority} />

            <button
              onClick={() => onTaskClick(task.id)}
              className={`flex-shrink-0 w-6 h-6 self-center rounded-md border-2 flex items-center justify-center transition-all ${
                task.isCompleted
                  ? "bg-accent border-accent"
                  : "border-ink-300 dark:border-ink-500 hover:border-accent"
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
              className="flex-1 text-left min-w-0 self-center"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`font-medium ${
                    task.isCompleted
                      ? "text-ink-400 line-through"
                      : "text-ink-900 dark:text-ink-300"
                  }`}
                >
                  {task.title}
                </span>
                <CategoryChip category={category} />
                <DueDateBadge
                  dueDate={task.endDate}
                  isCompleted={task.isCompleted}
                />
              </div>
            </button>

            <div className="flex items-center gap-1 self-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditTask(task)}
                className="btn-ghost"
                aria-label="Editar tarefa"
              >
                <Pencil size={16} />
              </button>
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
        );
      })}
    </ul>
  );
}

export default Tasks;

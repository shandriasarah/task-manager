import { ChevronRight, Trash2, Check, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
        <ClipboardList size={28} className="text-zinc-500" />
      </div>
      <p className="text-zinc-300 font-medium">Nenhuma tarefa por aqui</p>
      <p className="text-zinc-500 text-sm mt-1">
        Adicione sua primeira tarefa acima ✨
      </p>
    </div>
  );
}

function Tasks({ tasks, onTaskClick, onDeleteTaskClick }) {
  const navigate = useNavigate();

  function onSeeDetails(task) {
    const query = new URLSearchParams();
    query.set("title", task.title);
    query.set("description", task.description);
    navigate(`/tasks?${query.toString()}`);
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-2">
        <EmptyState />
      </div>
    );
  }

  return (
    <ul className="glass-card p-4 space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all animate-slide-in"
        >
          <button
            onClick={() => onTaskClick(task.id)}
            className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              task.isCompleted
                ? "bg-accent border-accent"
                : "border-zinc-600 hover:border-accent"
            }`}
            aria-label={task.isCompleted ? "Marcar como pendente" : "Concluir tarefa"}
          >
            {task.isCompleted && <Check size={14} strokeWidth={3} className="text-white" />}
          </button>

          <button
            onClick={() => onTaskClick(task.id)}
            className={`flex-1 text-left transition-all ${
              task.isCompleted
                ? "text-zinc-500 line-through"
                : "text-zinc-100"
            }`}
          >
            <span className="font-medium">{task.title}</span>
          </button>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

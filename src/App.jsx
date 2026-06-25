import { useMemo, useState } from "react";
import { v4 } from "uuid";
import { CheckCircle2, AlertCircle } from "lucide-react";
import AddTask from "./componentes/AddTask";
import Tasks from "./componentes/Tasks";
import Title from "./componentes/Title";
import { getDueDateInfo } from "./utils/dueDate";

function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || [],
  );
  const [filter, setFilter] = useState("all");

  function saveTasks(newTasks) {
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTasks(newTasks);
  }

  function onTaskClick(taskId) {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
    );
    saveTasks(newTasks);
  }

  function onDeleteTaskClick(taskId) {
    saveTasks(tasks.filter((task) => task.id !== taskId));
  }

  function onAddTaskSubmit(title, description, dueDate) {
    const newTask = {
      id: v4(),
      title,
      description,
      dueDate: dueDate || null,
      isCompleted: false,
    };
    saveTasks([...tasks, newTask]);
  }

  const completedCount = useMemo(
    () => tasks.filter((t) => t.isCompleted).length,
    [tasks],
  );

  const overdueCount = useMemo(
    () =>
      tasks.filter((t) => {
        if (t.isCompleted) return false;
        const info = getDueDateInfo(t.dueDate, false);
        return info?.variant === "overdue";
      }).length,
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.isCompleted);
    if (filter === "completed") return tasks.filter((t) => t.isCompleted);
    return tasks;
  }, [tasks, filter]);

  const filters = [
    { key: "all", label: "Todas", count: tasks.length },
    {
      key: "pending",
      label: "Pendentes",
      count: tasks.length - completedCount,
    },
    { key: "completed", label: "Concluídas", count: completedCount },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-xl space-y-8">
        <Title subtitle="Organize seu dia com simplicidade">
          Gerenciador de Tarefas
        </Title>

        {tasks.length > 0 && (
          <div className="flex items-center justify-between text-sm animate-fade-in">
            <div className="flex items-center gap-2 text-ink-500">
              <CheckCircle2 size={16} className="text-accent" />
              <span>
                <span className="text-ink-900 font-semibold">
                  {completedCount}
                </span>
                {" de "}
                <span className="text-ink-900 font-semibold">
                  {tasks.length}
                </span>
                {" concluídas"}
              </span>
            </div>
            {overdueCount > 0 && (
              <div className="badge-overdue">
                <AlertCircle size={12} strokeWidth={2.5} />
                {overdueCount} atrasada{overdueCount > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        <AddTask onAddTaskSubmit={onAddTaskSubmit} />

        {tasks.length > 0 && (
          <div className="flex items-center gap-2 animate-fade-in">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f.key
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "bg-surface text-ink-500 hover:bg-surface-soft hover:text-ink-900 border border-ink-300/30"
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-70">{f.count}</span>
              </button>
            ))}
          </div>
        )}

        <Tasks
          tasks={filteredTasks}
          onTaskClick={onTaskClick}
          onDeleteTaskClick={onDeleteTaskClick}
        />

        <footer className="text-center text-ink-400 text-xs pt-8">
          Feito com React + Tailwind
        </footer>
      </div>
    </div>
  );
}

export default App;

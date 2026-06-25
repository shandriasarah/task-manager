import { useMemo, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import AddTask from "./componentes/AddTask";
import Tasks from "./componentes/Tasks";
import Title from "./componentes/Title";
import Toolbar from "./componentes/Toolbar";
import SearchBar from "./componentes/SearchBar";
import EditTaskModal from "./componentes/EditTaskModal";
import CategoryManagerModal from "./componentes/CategoryManagerModal";
import { useTasks } from "./hooks/useTasks";
import { useCategories } from "./hooks/useCategories";
import { getDueDateInfo } from "./utils/dueDate";
import { exportData, importDataFromFile } from "./utils/backup";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    replaceTasks,
  } = useTasks();
  const {
    categories,
    addCategory,
    deleteCategory,
    getCategory,
  } = useCategories();

  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.isCompleted).length,
    [tasks],
  );

  const overdueCount = useMemo(
    () =>
      tasks.filter((t) => {
        if (t.isCompleted) return false;
        const info = getDueDateInfo(t.endDate, false);
        return info?.variant === "overdue";
      }).length,
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    let list = tasks;

    if (filter === "pending") list = list.filter((t) => !t.isCompleted);
    if (filter === "completed") list = list.filter((t) => t.isCompleted);

    if (categoryFilter !== "all") {
      list = list.filter((t) => t.categoryId === categoryFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority] ?? 1;
      const pb = PRIORITY_ORDER[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      if (a.endDate && b.endDate) return a.endDate.localeCompare(b.endDate);
      if (a.endDate) return -1;
      if (b.endDate) return 1;
      return 0;
    });
  }, [tasks, filter, categoryFilter, search]);

  const filters = [
    { key: "all", label: "Todas", count: tasks.length },
    {
      key: "pending",
      label: "Pendentes",
      count: tasks.length - completedCount,
    },
    { key: "completed", label: "Concluídas", count: completedCount },
  ];

  async function handleImport(file) {
    try {
      const { tasks: importedTasks, categories: importedCategories } =
        await importDataFromFile(file);
      const confirmMessage = `Importar ${importedTasks.length} tarefa(s)? Isso vai substituir suas tarefas atuais.`;
      if (!confirm(confirmMessage)) return;
      replaceTasks(importedTasks);
      if (importedCategories) {
        localStorage.setItem("categories", JSON.stringify(importedCategories));
        window.location.reload();
      }
    } catch (err) {
      alert("Não foi possível importar o arquivo: " + err.message);
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Title subtitle="Organize seu dia com simplicidade">
              Gerenciador de Tarefas
            </Title>
          </div>
          <Toolbar
            onExport={() => exportData({ tasks, categories })}
            onImport={handleImport}
            onManageCategories={() => setShowCategoryManager(true)}
          />
        </div>

        {tasks.length > 0 && (
          <div className="flex items-center justify-between text-sm animate-fade-in">
            <div className="flex items-center gap-2 text-ink-500">
              <CheckCircle2 size={16} className="text-accent" />
              <span>
                <span className="text-ink-900 dark:text-white font-semibold">
                  {completedCount}
                </span>
                {" de "}
                <span className="text-ink-900 dark:text-white font-semibold">
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

        <AddTask
          onAddTaskSubmit={addTask}
          categories={categories}
          onOpenCategoryManager={() => setShowCategoryManager(true)}
        />

        {tasks.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <SearchBar value={search} onChange={setSearch} />

            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f.key
                      ? "bg-accent text-white shadow-md shadow-accent/25"
                      : "bg-surface dark:bg-white/[0.04] text-ink-500 hover:bg-surface-soft dark:hover:bg-white/[0.08] hover:text-ink-900 dark:hover:text-white border border-ink-300/30 dark:border-white/[0.06]"
                  }`}
                >
                  {f.label}
                  <span className="ml-1.5 opacity-70">{f.count}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`chip transition-all ${
                  categoryFilter === "all"
                    ? "bg-ink-700 dark:bg-white text-white dark:text-ink-900"
                    : "bg-surface dark:bg-white/[0.04] text-ink-500 hover:bg-surface-soft hover:text-ink-900 dark:hover:text-white border border-ink-300/30 dark:border-white/[0.06]"
                }`}
              >
                Todas categorias
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`chip transition-all ${
                    categoryFilter === cat.id
                      ? "bg-ink-700 dark:bg-white text-white dark:text-ink-900"
                      : "bg-surface dark:bg-white/[0.04] text-ink-500 hover:bg-surface-soft hover:text-ink-900 dark:hover:text-white border border-ink-300/30 dark:border-white/[0.06]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      {
                        accent: "bg-accent",
                        sage: "bg-sage",
                        peach: "bg-peach",
                        rose: "bg-rose",
                        violet: "bg-violet-400",
                        amber: "bg-amber-400",
                        teal: "bg-teal-400",
                        pink: "bg-pink-400",
                      }[cat.color] || "bg-accent"
                    }`}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <Tasks
          tasks={filteredTasks}
          getCategory={getCategory}
          onTaskClick={toggleTask}
          onDeleteTaskClick={deleteTask}
          onEditTask={setEditingTask}
          emptyMessage={
            search || categoryFilter !== "all" || filter !== "all"
              ? "Nenhuma tarefa encontrada"
              : "Nenhuma tarefa por aqui"
          }
          emptyHint={
            search || categoryFilter !== "all" || filter !== "all"
              ? "Tente ajustar os filtros ou a busca"
              : "Adicione sua primeira tarefa acima ✨"
          }
        />

        <footer className="text-center text-ink-400 text-xs pt-4">
          Feito com React + Tailwind
        </footer>
      </div>

      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        categories={categories}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
        onOpenCategoryManager={() => setShowCategoryManager(true)}
      />

      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onAdd={addCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}

export default App;

import { useState } from "react";
import {
  Plus,
  Calendar,
  Tag,
  Flag,
  Settings2,
  Save,
  X,
} from "lucide-react";
import Input from "./input";
import DatePicker from "./DatePicker";

const PRIORITIES = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
];

const COLOR_DOT = {
  accent: "bg-accent",
  sage: "bg-sage",
  peach: "bg-peach",
  rose: "bg-rose",
  violet: "bg-violet-400",
  amber: "bg-amber-400",
  teal: "bg-teal-400",
  pink: "bg-pink-400",
};

function TaskForm({
  initialValues,
  categories,
  onSubmit,
  onOpenCategoryManager,
  mode = "create",
}) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );
  const [startDate, setStartDate] = useState(initialValues?.startDate || "");
  const [endDate, setEndDate] = useState(initialValues?.endDate || "");
  const [priority, setPriority] = useState(
    initialValues?.priority || "medium",
  );
  const [categoryId, setCategoryId] = useState(
    initialValues?.categoryId || "",
  );
  const [showDates, setShowDates] = useState(
    Boolean(initialValues?.startDate || initialValues?.endDate),
  );
  const [showPriority, setShowPriority] = useState(
    Boolean(initialValues?.priority && initialValues.priority !== "medium"),
  );
  const [error, setError] = useState("");

  function handleSubmit() {
    setError("");

    if (!title.trim()) {
      setError("Dê um título à tarefa.");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      setError("A data de início não pode ser depois da data final.");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      priority,
      categoryId: categoryId || null,
    });

    if (mode === "create") {
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setPriority("medium");
      setCategoryId("");
      setShowDates(false);
      setShowPriority(false);
    }
  }

  function clearDates() {
    setStartDate("");
    setEndDate("");
    setShowDates(false);
  }

  function clearPriority() {
    setPriority("medium");
    setShowPriority(false);
  }

  const currentPriority = PRIORITIES.find((p) => p.value === priority);

  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder="Digite o título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Input
        type="text"
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowDates((v) => !v)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            showDates
              ? "bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-ring"
              : "text-ink-500 hover:text-accent-hover hover:bg-accent-soft dark:hover:bg-accent/10"
          }`}
        >
          <Calendar size={14} />
          {startDate || endDate ? "Datas definidas" : "Adicionar datas"}
        </button>

        <button
          type="button"
          onClick={() => setShowPriority((v) => !v)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            showPriority || priority !== "medium"
              ? "bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-ring"
              : "text-ink-500 hover:text-accent-hover hover:bg-accent-soft dark:hover:bg-accent/10"
          }`}
        >
          <Flag size={14} />
          {priority !== "medium"
            ? `Prioridade ${currentPriority.label}`
            : "Definir prioridade"}
        </button>
      </div>

      {showDates && (
        <div className="space-y-3 p-3 rounded-xl bg-surface-soft dark:bg-white/[0.03] border border-ink-300/30 dark:border-white/[0.06] animate-slide-in">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-1.5">
              <Calendar size={12} /> Datas da tarefa
            </p>
            <button
              type="button"
              onClick={clearDates}
              className="text-xs text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Remover
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-500 mb-1 block pl-1">
                Início
              </label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="dd/mm/aaaa"
              />
            </div>
            <div>
              <label className="text-xs text-ink-500 mb-1 block pl-1">
                Prazo final
              </label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="dd/mm/aaaa"
                fromDate={startDate}
              />
            </div>
          </div>
        </div>
      )}

      {showPriority && (
        <div className="space-y-3 p-3 rounded-xl bg-surface-soft dark:bg-white/[0.03] border border-ink-300/30 dark:border-white/[0.06] animate-slide-in">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-1.5">
              <Flag size={12} /> Prioridade
            </p>
            <button
              type="button"
              onClick={clearPriority}
              className="text-xs text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Remover
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const isSelected = priority === p.value;
              const dotColor = {
                high: "bg-rose-500",
                medium: "bg-peach",
                low: "bg-ink-300 dark:bg-ink-500",
              }[p.value];
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`chip transition-all ${
                    isSelected
                      ? "bg-ink-700 dark:bg-white text-white dark:text-ink-900"
                      : "bg-surface dark:bg-white/[0.04] text-ink-700 dark:text-ink-300 hover:bg-ink-300/20 border border-ink-300/30 dark:border-white/[0.06]"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-ink-500 flex items-center gap-1.5">
            <Tag size={12} /> Categoria
          </p>
          {onOpenCategoryManager && (
            <button
              type="button"
              onClick={onOpenCategoryManager}
              className="text-xs text-accent-hover hover:underline flex items-center gap-1"
            >
              <Settings2 size={12} /> Gerenciar
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId("")}
            className={`chip transition-all ${
              categoryId === ""
                ? "bg-ink-700 dark:bg-white text-white dark:text-ink-900"
                : "bg-surface-soft dark:bg-white/[0.04] text-ink-500 hover:bg-ink-300/20"
            }`}
          >
            Sem categoria
          </button>
          {categories.map((cat) => {
            const isSelected = categoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`chip transition-all ${
                  isSelected
                    ? "bg-ink-700 dark:bg-white text-white dark:text-ink-900"
                    : "bg-surface-soft dark:bg-white/[0.04] text-ink-700 dark:text-ink-300 hover:bg-ink-300/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    COLOR_DOT[cat.color] || "bg-accent"
                  }`}
                />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 pl-1 animate-fade-in">
          ⚠️ {error}
        </p>
      )}

      <button onClick={handleSubmit} className="btn-primary w-full">
        {mode === "edit" ? (
          <>
            <Save size={18} strokeWidth={2.5} /> Salvar alterações
          </>
        ) : (
          <>
            <Plus size={18} strokeWidth={2.5} /> Adicionar tarefa
          </>
        )}
      </button>
    </div>
  );
}

export default TaskForm;

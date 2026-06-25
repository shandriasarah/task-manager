import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import Input from "./input";

function AddTask({ onAddTaskSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      return alert("Por favor, preencha o título e a descrição da tarefa.");
    }
    onAddTaskSubmit(title, description, dueDate || null);
    setTitle("");
    setDescription("");
    setDueDate("");
  }

  return (
    <div className="soft-card p-6 space-y-3 animate-fade-in">
      <Input
        type="text"
        placeholder="Digite o título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Digite a descrição da tarefa"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <div className="relative">
        <Calendar
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-modern pl-10"
          placeholder="Data limite (opcional)"
        />
      </div>
      {!dueDate && (
        <p className="text-xs text-ink-400 pl-1">
          💡 Defina uma data limite para usar como lembrete
        </p>
      )}

      <button onClick={handleSubmit} className="btn-primary w-full">
        <Plus size={18} strokeWidth={2.5} /> Adicionar tarefa
      </button>
    </div>
  );
}

export default AddTask;

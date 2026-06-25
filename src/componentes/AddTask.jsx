import { useState } from "react";
import { Plus } from "lucide-react";
import Input from "./input";

function AddTask({ onAddTaskSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      return alert("Por favor, preencha o título e a descrição da tarefa.");
    }
    onAddTaskSubmit(title, description);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="glass-card p-6 space-y-3 animate-fade-in">
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
      <button onClick={handleSubmit} className="btn-primary w-full">
        <Plus size={18} strokeWidth={2.5} /> Adicionar tarefa
      </button>
    </div>
  );
}

export default AddTask;

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { CATEGORY_COLORS, getCategoryColor } from "../hooks/useCategories";

function CategoryManagerModal({ isOpen, onClose, categories, onAdd, onDelete }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(CATEGORY_COLORS[0].key);

  if (!isOpen) return null;

  function handleAdd() {
    if (!name.trim()) return;
    if (categories.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
      return alert("Já existe uma categoria com esse nome.");
    }
    onAdd({ name, color });
    setName("");
    setColor(CATEGORY_COLORS[0].key);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-ink-900 dark:text-white">
            Gerenciar categorias
          </h3>
          <button onClick={onClose} className="btn-ghost" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
          {categories.map((cat) => {
            const c = getCategoryColor(cat.color);
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface-soft dark:bg-white/[0.03] border border-ink-300/20 dark:border-white/[0.05]"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                  <span className="text-sm font-medium text-ink-900 dark:text-ink-300">
                    {cat.name}
                  </span>
                  {cat.isDefault && (
                    <span className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                      padrão
                    </span>
                  )}
                </div>
                {!cat.isDefault && (
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="btn-danger"
                    aria-label={`Excluir ${cat.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-5 border-t border-ink-300/30 dark:border-white/[0.06] space-y-3">
          <p className="text-sm font-semibold text-ink-700 dark:text-ink-300">
            Criar nova categoria
          </p>
          <input
            type="text"
            placeholder="Nome da categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="input-modern"
          />
          <div>
            <p className="text-xs text-ink-500 mb-2">Cor</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setColor(c.key)}
                  className={`w-8 h-8 rounded-full ${c.dot} transition-all ${
                    color === c.key
                      ? "ring-2 ring-offset-2 ring-ink-700 dark:ring-white ring-offset-surface dark:ring-offset-surface-dark scale-110"
                      : "hover:scale-105"
                  }`}
                  aria-label={c.label}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <button onClick={handleAdd} className="btn-primary w-full">
            <Plus size={16} /> Adicionar categoria
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagerModal;

import { X } from "lucide-react";
import TaskForm from "./TaskForm";

function EditTaskModal({
  isOpen,
  onClose,
  task,
  categories,
  onSave,
  onOpenCategoryManager,
}) {
  if (!isOpen || !task) return null;

  function handleSave(updates) {
    onSave(task.id, updates);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-ink-900 dark:text-white">
            Editar tarefa
          </h3>
          <button onClick={onClose} className="btn-ghost" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <TaskForm
          initialValues={task}
          categories={categories}
          onSubmit={handleSave}
          onOpenCategoryManager={onOpenCategoryManager}
          mode="edit"
        />
      </div>
    </div>
  );
}

export default EditTaskModal;

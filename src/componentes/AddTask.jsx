import TaskForm from "./TaskForm";

function AddTask({ onAddTaskSubmit, categories, onOpenCategoryManager }) {
  return (
    <div className="soft-card p-6 animate-fade-in">
      <TaskForm
        categories={categories}
        onSubmit={onAddTaskSubmit}
        onOpenCategoryManager={onOpenCategoryManager}
        mode="create"
      />
    </div>
  );
}

export default AddTask;

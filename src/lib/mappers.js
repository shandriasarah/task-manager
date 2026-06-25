export function dbToTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    startDate: row.start_date,
    endDate: row.end_date,
    priority: row.priority || "medium",
    categoryId: row.category_id,
    isCompleted: row.is_completed,
    createdAt: row.created_at,
  };
}

export function taskToDb(task) {
  const out = {};
  if (task.title !== undefined) out.title = task.title;
  if (task.description !== undefined) out.description = task.description;
  if (task.startDate !== undefined) out.start_date = task.startDate || null;
  if (task.endDate !== undefined) out.end_date = task.endDate || null;
  if (task.priority !== undefined) out.priority = task.priority;
  if (task.categoryId !== undefined) out.category_id = task.categoryId || null;
  if (task.isCompleted !== undefined) out.is_completed = task.isCompleted;
  return out;
}

export function dbToCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    isDefault: row.is_default,
  };
}

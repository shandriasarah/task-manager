import { useEffect, useState } from "react";
import { v4 } from "uuid";

const STORAGE_KEY = "tasks";

function migrate(task) {
  if (!task) return task;
  if (task.dueDate && !task.endDate) {
    const { dueDate, ...rest } = task;
    return { ...rest, endDate: dueDate, startDate: null };
  }
  return { startDate: null, endDate: null, ...task };
}

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored).map(migrate);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask({
    title,
    description,
    startDate,
    endDate,
    priority,
    categoryId,
  }) {
    setTasks((prev) => [
      ...prev,
      {
        id: v4(),
        title,
        description,
        startDate: startDate || null,
        endDate: endDate || null,
        priority: priority || "medium",
        categoryId: categoryId || null,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  function updateTask(id, updates) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function replaceTasks(newTasks) {
    setTasks(Array.isArray(newTasks) ? newTasks.map(migrate) : []);
  }

  return {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    replaceTasks,
  };
}

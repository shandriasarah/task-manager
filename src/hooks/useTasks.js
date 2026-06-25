import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { dbToTask, taskToDb } from "../lib/mappers";
import { useAuth } from "./useAuth";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar tarefas:", error);
      setTasks([]);
    } else {
      setTasks(data.map(dbToTask));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function addTask(taskData) {
    if (!user) return;

    const payload = { ...taskToDb(taskData), user_id: user.id, is_completed: false };

    const { data, error } = await supabase
      .from("tasks")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Não foi possível adicionar a tarefa.");
      return;
    }

    setTasks((prev) => [dbToTask(data), ...prev]);
  }

  async function updateTask(id, updates) {
    const dbUpdates = taskToDb(updates);

    const { error } = await supabase
      .from("tasks")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Não foi possível atualizar a tarefa.");
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  }

  async function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newValue = !task.isCompleted;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: newValue } : t)),
    );

    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: newValue })
      .eq("id", id);

    if (error) {
      console.error("Erro ao alternar tarefa:", error);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: !newValue } : t)),
      );
    }
  }

  async function deleteTask(id) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar tarefa:", error);
      alert("Não foi possível excluir a tarefa.");
      setTasks(previous);
    }
  }

  async function replaceTasks(newTasks) {
    if (!user) return;
    if (!Array.isArray(newTasks)) return;

    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Erro ao limpar tarefas:", deleteError);
      alert("Erro ao importar: " + deleteError.message);
      return;
    }

    if (newTasks.length === 0) {
      setTasks([]);
      return;
    }

    const payload = newTasks.map((t) => ({
      ...taskToDb(t),
      user_id: user.id,
      is_completed: Boolean(t.isCompleted),
    }));

    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert(payload)
      .select();

    if (insertError) {
      console.error("Erro ao importar tarefas:", insertError);
      alert("Erro ao importar tarefas: " + insertError.message);
      return;
    }

    setTasks(data.map(dbToTask));
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    replaceTasks,
  };
}

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { dbToCategory } from "../lib/mappers";
import { useAuth } from "./useAuth";

const DEFAULT_CATEGORIES = [
  { name: "Casa", color: "sage", is_default: true },
  { name: "Trabalho", color: "accent", is_default: true },
  { name: "Pessoal", color: "peach", is_default: true },
  { name: "Consulta", color: "rose", is_default: true },
  { name: "Estudos", color: "violet", is_default: true },
];

export const CATEGORY_COLORS = [
  { key: "accent", label: "Azul", bg: "bg-accent-soft", text: "text-accent-hover", dot: "bg-accent" },
  { key: "sage", label: "Verde", bg: "bg-sage-soft", text: "text-emerald-700", dot: "bg-sage" },
  { key: "peach", label: "Pêssego", bg: "bg-peach-soft", text: "text-orange-700", dot: "bg-peach" },
  { key: "rose", label: "Rosa", bg: "bg-rose-soft", text: "text-rose-700", dot: "bg-rose" },
  { key: "violet", label: "Violeta", bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300", dot: "bg-violet-400" },
  { key: "amber", label: "Âmbar", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-400" },
  { key: "teal", label: "Verde-água", bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-300", dot: "bg-teal-400" },
  { key: "pink", label: "Pink", bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300", dot: "bg-pink-400" },
];

export function getCategoryColor(colorKey) {
  return CATEGORY_COLORS.find((c) => c.key === colorKey) || CATEGORY_COLORS[0];
}

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      const seeded = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: user.id }));
      const { data: inserted, error: insertError } = await supabase
        .from("categories")
        .insert(seeded)
        .select();

      if (insertError) {
        console.error("Erro ao criar categorias padrão:", insertError);
        setCategories([]);
      } else {
        setCategories(inserted.map(dbToCategory));
      }
    } else {
      setCategories(data.map(dbToCategory));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function addCategory({ name, color }) {
    if (!user) return;
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), color, is_default: false, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert("Não foi possível adicionar a categoria.");
      return null;
    }

    const newCategory = dbToCategory(data);
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }

  async function updateCategory(id, updates) {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.color !== undefined) dbUpdates.color = updates.color;

    const { error } = await supabase
      .from("categories")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar categoria:", error);
      return;
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  }

  async function deleteCategory(id) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Erro ao deletar categoria:", error);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function getCategory(id) {
    return categories.find((c) => c.id === id);
  }

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
  };
}

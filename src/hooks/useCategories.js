import { useEffect, useState } from "react";
import { v4 } from "uuid";

const STORAGE_KEY = "categories";

export const DEFAULT_CATEGORIES = [
  { id: "cat-casa", name: "Casa", color: "sage", isDefault: true },
  { id: "cat-trabalho", name: "Trabalho", color: "accent", isDefault: true },
  { id: "cat-pessoal", name: "Pessoal", color: "peach", isDefault: true },
  { id: "cat-consulta", name: "Consulta", color: "rose", isDefault: true },
  { id: "cat-estudos", name: "Estudos", color: "violet", isDefault: true },
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
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  function addCategory({ name, color }) {
    const newCategory = {
      id: v4(),
      name: name.trim(),
      color,
      isDefault: false,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }

  function updateCategory(id, updates) {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
    );
  }

  function deleteCategory(id) {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }

  function getCategory(id) {
    return categories.find((c) => c.id === id);
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
  };
}

import { getCategoryColor } from "../hooks/useCategories";

function CategoryChip({ category, size = "sm" }) {
  if (!category) return null;
  const color = getCategoryColor(category.color);
  const sizeClass = size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${color.bg} ${color.text} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
      {category.name}
    </span>
  );
}

export default CategoryChip;

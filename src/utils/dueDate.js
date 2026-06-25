export function getDueDateInfo(dueDate, isCompleted) {
  if (!dueDate) return null;

  const due = new Date(dueDate + "T23:59:59");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

  if (isCompleted) {
    return { label: "Concluída", variant: "done" };
  }

  if (diffDays < 0) {
    const dias = Math.abs(diffDays);
    return {
      label: dias === 1 ? "Atrasada 1 dia" : `Atrasada ${dias} dias`,
      variant: "overdue",
    };
  }

  if (diffDays === 0) return { label: "Hoje", variant: "today" };
  if (diffDays === 1) return { label: "Amanhã", variant: "today" };
  if (diffDays <= 7) return { label: `Em ${diffDays} dias`, variant: "soon" };

  const formatted = dueDay.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
  return { label: formatted, variant: "future" };
}

export function formatFullDate(dueDate) {
  if (!dueDate) return null;
  const due = new Date(dueDate + "T00:00:00");
  return due.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

export function getDueDateInfo(endDate, isCompleted) {
  if (!endDate) return null;

  const due = parseDate(endDate);
  if (!due) return null;

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

export function formatFullDate(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(startDate, endDate) {
  const start = formatShortDate(startDate);
  const end = formatShortDate(endDate);
  if (start && end) return `${start} → ${end}`;
  if (end) return `Até ${end}`;
  if (start) return `A partir de ${start}`;
  return null;
}

export const DATE_MIN = "2020-01-01";
export const DATE_MAX = "2099-12-31";

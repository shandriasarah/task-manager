import { ArrowLeft, CalendarDays, Flag, PlayCircle } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  formatFullDate,
  formatShortDate,
  getDueDateInfo,
} from "../utils/dueDate";
import { useCategories } from "../hooks/useCategories";
import CategoryChip from "../componentes/CategoryChip";

const PRIORITY_LABELS = {
  high: {
    label: "Alta",
    color: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  medium: {
    label: "Média",
    color: "text-orange-600 dark:text-orange-400",
    dot: "bg-peach",
  },
  low: {
    label: "Baixa",
    color: "text-ink-500",
    dot: "bg-ink-300 dark:bg-ink-500",
  },
};

function InfoCard({ icon: Icon, iconColor, iconBg, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-400 uppercase tracking-wider font-semibold mb-1">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function TaskPages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCategory } = useCategories();

  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const priority = searchParams.get("priority") || "medium";
  const categoryId = searchParams.get("categoryId");

  const fullEndDate = formatFullDate(endDate);
  const shortStartDate = formatShortDate(startDate);
  const dueInfo = getDueDateInfo(endDate, false);
  const category = categoryId ? getCategory(categoryId) : null;
  const priorityInfo = PRIORITY_LABELS[priority] || PRIORITY_LABELS.medium;

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-xl space-y-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-900 dark:hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="soft-card p-8 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-block px-2.5 py-1 rounded-md bg-accent-soft dark:bg-accent/15 border border-accent/20 text-accent-hover dark:text-accent-ring text-xs font-semibold uppercase tracking-wider">
              Detalhes da tarefa
            </div>
            {category && <CategoryChip category={category} size="md" />}
          </div>

          <h2 className="text-3xl font-bold text-ink-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-ink-700 dark:text-ink-400 leading-relaxed">
            {description}
          </p>

          <div className="pt-4 border-t border-ink-300/30 dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon={Flag}
              iconColor={priorityInfo.color}
              iconBg="bg-surface-soft dark:bg-white/[0.04]"
              label="Prioridade"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${priorityInfo.dot}`} />
                <span className={`font-medium ${priorityInfo.color}`}>
                  {priorityInfo.label}
                </span>
              </div>
            </InfoCard>

            {shortStartDate && (
              <InfoCard
                icon={PlayCircle}
                iconColor="text-sage"
                iconBg="bg-sage-soft dark:bg-sage/15"
                label="Início"
              >
                <p className="text-ink-900 dark:text-white font-medium text-sm">
                  {shortStartDate}
                </p>
              </InfoCard>
            )}

            {fullEndDate && (
              <InfoCard
                icon={CalendarDays}
                iconColor="text-accent-hover dark:text-accent-ring"
                iconBg="bg-accent-soft dark:bg-accent/15"
                label="Prazo final"
              >
                <p className="text-ink-900 dark:text-white font-medium capitalize text-sm">
                  {fullEndDate}
                </p>
                {dueInfo && (
                  <p
                    className={`text-xs mt-0.5 ${
                      dueInfo.variant === "overdue"
                        ? "text-rose-600 dark:text-rose-400"
                        : dueInfo.variant === "today"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-ink-500"
                    }`}
                  >
                    {dueInfo.label}
                  </p>
                )}
              </InfoCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskPages;

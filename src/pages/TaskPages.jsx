import { ArrowLeft, CalendarDays } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatFullDate, getDueDateInfo } from "../utils/dueDate";

function TaskPages() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const dueDate = searchParams.get("dueDate");
  const navigate = useNavigate();

  const fullDate = formatFullDate(dueDate);
  const dueInfo = getDueDateInfo(dueDate, false);

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-xl space-y-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-900 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="soft-card p-8 space-y-5">
          <div className="inline-block px-2.5 py-1 rounded-md bg-accent-soft border border-accent/20 text-accent-hover text-xs font-semibold uppercase tracking-wider">
            Detalhes da tarefa
          </div>
          <h2 className="text-3xl font-bold text-ink-900 tracking-tight">
            {title}
          </h2>
          <p className="text-ink-700 leading-relaxed">{description}</p>

          {fullDate && (
            <div className="pt-4 border-t border-ink-300/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={18} className="text-accent-hover" />
                </div>
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wider font-semibold mb-1">
                    Data limite
                  </p>
                  <p className="text-ink-900 font-medium capitalize">
                    {fullDate}
                  </p>
                  {dueInfo && (
                    <p
                      className={`text-sm mt-1 ${
                        dueInfo.variant === "overdue"
                          ? "text-rose-600"
                          : dueInfo.variant === "today"
                            ? "text-orange-600"
                            : "text-ink-500"
                      }`}
                    >
                      {dueInfo.label}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPages;

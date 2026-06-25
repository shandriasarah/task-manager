import { ArrowLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

function TaskPages() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-xl space-y-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="glass-card p-8 space-y-4">
          <div className="inline-block px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            Detalhes da tarefa
          </div>
          <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">
            {title}
          </h2>
          <p className="text-zinc-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default TaskPages;

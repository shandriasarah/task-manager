import { useState } from "react";
import { Mail, Lock, LogIn, UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import Title from "../componentes/Title";
import { useAuth } from "../hooks/useAuth";

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function getErrorMessage(err) {
    console.error("Auth error:", err);
    let msg = "";
    if (typeof err === "string") msg = err;
    else if (err?.message) msg = err.message;
    else if (err?.error_description) msg = err.error_description;
    else if (err) {
      try {
        msg = JSON.stringify(err);
      } catch {
        msg = String(err);
      }
    }
    if (msg.includes("Invalid login credentials"))
      return "Email ou senha incorretos.";
    if (msg.includes("User already registered"))
      return "Este email já está cadastrado. Faça login.";
    if (msg.includes("Password should be at least"))
      return "A senha deve ter pelo menos 6 caracteres.";
    if (msg.includes("Unable to validate email"))
      return "Email inválido.";
    if (msg.includes("Email signups are disabled"))
      return "Cadastro por email está desativado no Supabase. Habilite em Authentication → Providers.";
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError"))
      return "Erro de conexão com o Supabase. Verifique a URL e a chave no arquivo .env";
    return msg || "Algo deu errado. Tente novamente.";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Preencha email e senha.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setSuccess(
          "Conta criada! Verifique seu email para confirmar (caso esteja ativado) ou entre direto abaixo.",
        );
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
    setSuccess("");
  }

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <Title subtitle="Organize seu dia com simplicidade">
          Gerenciador de Tarefas
        </Title>

        <form onSubmit={handleSubmit} className="soft-card p-7 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-white">
              {isLogin ? "Entrar na sua conta" : "Criar uma conta"}
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              {isLogin
                ? "Bem-vinda de volta! Acesse suas tarefas."
                : "Comece a organizar suas tarefas agora."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
              />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="input-modern pl-10"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
              />
              <input
                type="password"
                placeholder="Senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="input-modern pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 pl-1 animate-fade-in">
              ⚠️ {error}
            </p>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-sage-soft dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 animate-fade-in">
              <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn size={18} strokeWidth={2.5} /> Entrar
              </>
            ) : (
              <>
                <UserPlus size={18} strokeWidth={2.5} /> Criar conta
              </>
            )}
          </button>

          <div className="pt-2 text-center text-sm text-ink-500">
            {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-accent-hover font-semibold hover:underline"
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-ink-400">
          Suas tarefas ficam salvas com segurança em sua conta.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

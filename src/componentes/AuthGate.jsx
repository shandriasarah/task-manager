import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import AuthPage from "../pages/AuthPage";

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  useTheme();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return children;
}

export default AuthGate;

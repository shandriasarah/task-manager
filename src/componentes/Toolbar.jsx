import { useRef } from "react";
import { Download, Upload, Tag, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";

function Toolbar({ onExport, onImport, onManageCategories }) {
  const fileInputRef = useRef(null);
  const { user, signOut } = useAuth();

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = "";
  }

  async function handleSignOut() {
    if (confirm("Deseja realmente sair?")) {
      await signOut();
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {user?.email && (
        <span className="hidden sm:inline text-xs text-ink-500 mr-2 truncate max-w-[140px]">
          {user.email}
        </span>
      )}
      <button
        onClick={onManageCategories}
        className="btn-ghost"
        aria-label="Gerenciar categorias"
        title="Categorias"
      >
        <Tag size={18} />
      </button>
      <button
        onClick={onExport}
        className="btn-ghost"
        aria-label="Exportar backup"
        title="Exportar backup"
      >
        <Download size={18} />
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn-ghost"
        aria-label="Importar backup"
        title="Importar backup"
      >
        <Upload size={18} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />
      <ThemeToggle />
      <button
        onClick={handleSignOut}
        className="btn-ghost"
        aria-label="Sair"
        title="Sair"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}

export default Toolbar;

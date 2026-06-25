import { useRef } from "react";
import { Download, Upload, Tag } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Toolbar({ onExport, onImport, onManageCategories }) {
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = "";
  }

  return (
    <div className="flex items-center justify-end gap-1">
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
    </div>
  );
}

export default Toolbar;

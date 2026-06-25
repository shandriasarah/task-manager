import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { Calendar, X } from "lucide-react";
import "react-day-picker/style.css";

function parseISO(value) {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatISO(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(value) {
  const d = parseISO(value);
  if (!d) return "";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function DatePicker({ value, onChange, placeholder = "Selecionar data", fromDate }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedDate = parseISO(value);
  const display = formatDisplay(value);

  function handleSelect(date) {
    if (!date) return;
    onChange(formatISO(date));
    setOpen(false);
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange("");
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input-modern flex items-center justify-between gap-2 cursor-pointer text-left"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Calendar size={16} className="text-ink-400 flex-shrink-0" />
          <span
            className={display ? "text-ink-900 dark:text-ink-300" : "text-ink-400"}
          >
            {display || placeholder}
          </span>
        </span>
        {value && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
            className="text-ink-400 hover:text-rose-600 p-0.5 rounded"
            aria-label="Limpar data"
          >
            <X size={14} />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-30 mt-2 left-0 soft-card p-3 animate-scale-in">
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={fromDate ? { before: parseISO(fromDate) } : undefined}
            showOutsideDays
            weekStartsOn={0}
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;

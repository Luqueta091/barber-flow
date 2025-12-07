import { ViewState } from "../types";

interface SidebarProps {
  current: ViewState;
  onChange: (v: ViewState) => void;
}

export function Sidebar({ current, onChange }: SidebarProps) {
  const items: { key: ViewState; label: string }[] = [
    { key: "dashboard", label: "Resumo" },
    { key: "booking", label: "Novo agendamento" },
    { key: "appointments", label: "Agendamentos" },
    { key: "metrics", label: "Métricas" },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Cliente</div>
        <div className="text-lg font-bold text-slate-900">Meus Agendamentos</div>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              current === item.key
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

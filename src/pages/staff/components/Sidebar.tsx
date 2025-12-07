interface Props {
  current: "agenda" | "bloqueios" | "slots" | "notificacoes";
  onChange: (v: Props["current"]) => void;
}

export function Sidebar({ current, onChange }: Props) {
  const items: Props["current"][] = ["agenda", "bloqueios", "slots", "notificacoes"];
  const labels: Record<Props["current"], string> = {
    agenda: "Agenda",
    bloqueios: "Bloqueios e Exceções",
    slots: "Disponibilidade",
    notificacoes: "Notificações",
  };

  return (
    <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Staff</div>
        <div className="text-lg font-bold text-slate-900">Painel do Barbeiro</div>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
              current === item ? "bg-emerald-600 text-white shadow-md" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {labels[item]}
          </button>
        ))}
      </nav>
    </aside>
  );
}

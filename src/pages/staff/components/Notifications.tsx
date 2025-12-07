interface Notification {
  id: string;
  message: string;
  type: "success" | "alert" | "info";
}

interface Props {
  items: Notification[];
}

export function Notifications({ items }: Props) {
  const colorMap: Record<Notification["type"], string> = {
    success: "bg-emerald-50 text-emerald-700",
    alert: "bg-amber-50 text-amber-700",
    info: "bg-slate-100 text-slate-700",
  };
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Notificações</h3>
      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id} className={`p-3 rounded-xl text-sm font-semibold ${colorMap[n.type]}`}>
            {n.message}
          </div>
        ))}
        {items.length === 0 && <div className="text-slate-500 text-sm">Tudo tranquilo por aqui.</div>}
      </div>
    </div>
  );
}

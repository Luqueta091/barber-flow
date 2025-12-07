import { Appointment } from "../types";

interface Props {
  appointments: Appointment[];
}

export function MetricsView({ appointments }: Props) {
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Métricas simples</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
          <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Agendamentos</div>
          <div className="text-2xl font-bold text-slate-900">{total}</div>
        </div>
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
          <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Concluídos</div>
          <div className="text-2xl font-bold text-slate-900">{completed}</div>
        </div>
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
          <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Cancelados</div>
          <div className="text-2xl font-bold text-slate-900">{cancelled}</div>
        </div>
      </div>
    </div>
  );
}

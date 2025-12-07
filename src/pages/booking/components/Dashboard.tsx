import { format } from "date-fns";
import { Appointment } from "../types";
import { IconCalendar, IconClock, IconMapPin, IconCheck } from "./Icons";

interface DashboardProps {
  appointments: Appointment[];
  onNewBooking: () => void;
}

export function Dashboard({ appointments, onNewBooking }: DashboardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-slate-500">Olá, cliente</p>
          <h2 className="text-2xl font-bold text-slate-900">Acompanhe seus agendamentos</h2>
        </div>
        <button
          onClick={onNewBooking}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
        >
          Novo agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
          <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Próximo horário</div>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <IconClock className="w-5 h-5 text-emerald-600" />
            {appointments[0]
              ? `${format(new Date(appointments[0].startAt), "dd/MM")} às ${format(new Date(appointments[0].startAt), "HH:mm")}`
              : "Nenhum agendamento"}
          </div>
        </div>
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
          <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Total agendamentos</div>
          <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
        </div>
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
          <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Status</div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <IconCheck className="w-5 h-5" />
            Em dia
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Agendamentos recentes</h3>
        <div className="space-y-3">
          {appointments.slice(0, 3).map((appt) => (
            <div key={appt.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <IconCalendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {appt.service.name} • {format(new Date(appt.startAt), "dd/MM HH:mm")}
                  </div>
                  <div className="text-slate-500 text-sm flex items-center gap-2">
                    <IconMapPin className="w-4 h-4" />
                    {appt.unit.name}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 capitalize">
                {appt.status}
              </span>
            </div>
          ))}
          {appointments.length === 0 && <div className="text-slate-500 text-sm">Nenhum agendamento ainda.</div>}
        </div>
      </div>
    </div>
  );
}

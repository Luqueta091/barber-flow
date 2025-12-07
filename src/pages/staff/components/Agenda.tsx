import { format } from "date-fns";
import { Appointment } from "../types";
import { IconCalendar, IconClock, IconUser } from "./Icons";

interface Props {
  appointments: Appointment[];
  onMarkNoShow: (id: string) => void;
  onCheckIn: (id: string) => void;
  barbers?: { id: string; name: string }[];
  selectedBarberId?: string;
  onSelectBarber?: (id: string) => void;
}

export function Agenda({ appointments, onMarkNoShow, onCheckIn, barbers = [], selectedBarberId, onSelectBarber }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-slate-900">Agenda do dia</h3>
          <div className="text-sm text-slate-500">Total: {appointments.length}</div>
        </div>
        {barbers.length > 0 && onSelectBarber && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Barbeiro</span>
            <select
              className="p-2 rounded-lg border border-slate-200 text-sm"
              value={selectedBarberId || ""}
              onChange={(e) => onSelectBarber(e.target.value)}
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {appointments.map((appt) => (
          <div key={appt.id} data-appointment-id={appt.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <IconCalendar className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">
                  {format(new Date(appt.startAt), "HH:mm")} - {appt.serviceName}
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <IconUser className="w-4 h-4" />
                  {appt.clientName}
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <IconClock className="w-4 h-4" />
                  {format(new Date(appt.startAt), "dd/MM/yyyy HH:mm")}
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <IconCalendar className="w-4 h-4" />
                  {appt.unitAddress || appt.unitName || "Local não informado"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                data-action="check-in"
                onClick={() => onCheckIn(appt.id)}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
              >
                Check-in
              </button>
              <button
                data-action="mark-noshow"
                onClick={() => onMarkNoShow(appt.id)}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                Falta
              </button>
            </div>
          </div>
        ))}
        {appointments.length === 0 && <div className="text-slate-500 text-sm">Agenda livre hoje.</div>}
      </div>
    </div>
  );
}

import { format } from "date-fns";
import { Appointment } from "../types";
import { IconCalendar, IconClock, IconMapPin, IconUser } from "./Icons";

interface Props {
  appointments: Appointment[];
}

export function AppointmentsList({ appointments }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Meus agendamentos</h3>
      <div className="space-y-3">
        {appointments.map((appt) => (
          <div key={appt.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <IconCalendar className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">{appt.service.name}</div>
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <IconClock className="w-4 h-4" />
                  {format(new Date(appt.startAt), "dd/MM/yyyy HH:mm")}
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-2">
                  <IconMapPin className="w-4 h-4" />
                  {appt.unit.name}
                </div>
                {appt.barber && (
                  <div className="text-slate-500 text-sm flex items-center gap-2">
                    <IconUser className="w-4 h-4" />
                    {appt.barber.name}
                  </div>
                )}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 capitalize">
              {appt.status}
            </span>
          </div>
        ))}
        {appointments.length === 0 && <div className="text-slate-500 text-sm">Nenhum agendamento encontrado.</div>}
      </div>
    </div>
  );
}

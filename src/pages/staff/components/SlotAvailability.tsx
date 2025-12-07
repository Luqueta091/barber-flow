import { Slot } from "../types";

interface Props {
  slots: Slot[];
  onToggle: (slot: Slot) => void;
}

const stateColors: Record<Slot["state"], string> = {
  free: "bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:text-emerald-600",
  blocked: "bg-slate-200 text-slate-500 border-slate-300",
  booked: "bg-emerald-600 text-white border-emerald-600",
};

export function SlotAvailability({ slots, onToggle }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Disponibilidade</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.id}
            data-slot-id={slot.id}
            data-slot-state={slot.state}
            onClick={() => onToggle(slot)}
            className={`py-3 px-3 rounded-xl text-sm font-semibold border transition-all ${stateColors[slot.state]}`}
          >
            {new Date(slot.start).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </button>
        ))}
      </div>
      {slots.length === 0 && <div className="text-slate-500 text-sm mt-2">Sem slots carregados.</div>}
    </div>
  );
}

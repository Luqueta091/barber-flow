import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

type Slot = { start: string; end: string };

const unitId = "u1";
const serviceId = "s1";

export default function DemoBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [userId, setUserId] = useState("user-demo");

  useEffect(() => {
    setLoading(true);
    apiFetch<{ slots: Slot[] }>(`/bff/availability?unitId=${unitId}&serviceId=${serviceId}&date=${new Date().toISOString().slice(0, 10)}`)
      .then((data) => setSlots(data.slots))
      .catch(() => toast.error("Falha ao carregar disponibilidade"))
      .finally(() => setLoading(false));
  }, []);

  const book = async () => {
    if (!selected) return;
    setBooking(true);
    try {
      const res = await apiFetch<{ appointmentId: string }>(`/bff/book`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          unitId,
          serviceId,
          startAt: selected.start,
          endAt: selected.end,
        }),
      });
      toast.success(`Agendamento criado! ID: ${res.appointmentId}`);
    } catch (e) {
      toast.error("Não foi possível agendar (conflito?)");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Demo de Agendamento</h1>
      <p className="text-muted-foreground mb-6">Fluxo mínimo: consulta disponibilidade, seleciona slot e cria agendamento via BFF.</p>

      <div className="space-y-3 mb-4">
        <label className="text-sm text-muted-foreground">User ID</label>
        <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </div>

      {loading ? (
        <p>Carregando horários...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {slots.map((slot) => (
            <button
              key={slot.start}
              onClick={() => setSelected(slot)}
              className={`p-3 rounded border ${selected?.start === slot.start ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              <div className="font-medium">{format(new Date(slot.start), "HH:mm")}</div>
              <div className="text-xs text-muted-foreground">{format(new Date(slot.start), "dd/MM/yyyy")}</div>
            </button>
          ))}
        </div>
      )}

      <button
        className="btn-primary"
        onClick={book}
        disabled={!selected || booking}
      >
        {booking ? "Agendando..." : "Agendar slot selecionado"}
      </button>
    </div>
  );
}

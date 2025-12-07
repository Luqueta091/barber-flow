import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "@/config/env";
import { AppointmentsList } from "./components/AppointmentsList";
import { BookingWizard } from "./components/BookingWizard";
import { Dashboard } from "./components/Dashboard";
import { MetricsView } from "./components/MetricsView";
import { Sidebar } from "./components/Sidebar";
import type { Appointment, Barber, Service, Slot, Unit, ViewState } from "./types";

const SESSION_KEY = "barber-flow-session";

const FALLBACK_UNITS: Unit[] = [
  { id: "u1", name: "Barbearia Downtown", address: "Av. Paulista, 1000 - SP", image: "https://picsum.photos/400/200?random=1" },
  { id: "u2", name: "Vila Madalena Club", address: "Rua Fradique Coutinho, 500 - SP", image: "https://picsum.photos/400/200?random=2" },
];

const FALLBACK_SERVICES: Service[] = [
  { id: "s1", name: "Corte Clássico", price: 60, durationMin: 45, description: "Corte tradicional com tesoura e máquina" },
  { id: "s2", name: "Barba Terapia", price: 45, durationMin: 30, description: "Toalha quente, massagem facial e hidratação" },
];

export function BookingFlowPage() {
  const [view, setView] = useState<ViewState>("dashboard");
  const [units, setUnits] = useState<Unit[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [toast, setToast] = useState<{ message: string; kind?: "success" | "error" } | null>(null);
  const session = useMemo(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { user?: { id?: string; fullName?: string } }) : null;
  }, []);

  const apiFetch = useCallback(
    async (path: string, options?: RequestInit) => {
      const res = await fetch(`${env.VITE_API_BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
        ...options,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro na requisição: ${res.status}`);
      }
      return res.json();
    },
    [env.VITE_API_BASE],
  );

  useEffect(() => {
    (async () => {
      try {
        const unitsRes = await apiFetch("/admin/units");
        setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : []);
      } catch {
        setUnits([]);
      }

      try {
        const servicesRes = await apiFetch("/admin/services");
        setServices(
          (Array.isArray(servicesRes.data) ? servicesRes.data : []).map((s: any) => ({
            id: s.id,
            name: s.name,
            price: Number(s.price ?? 0),
            durationMin: s.durationMinutes ?? 30,
            description: s.description,
            unitId: s.unitId,
          })),
        );
      } catch {
        setServices([]);
      }

      try {
        const barbersRes = await apiFetch("/admin/barbers");
        setBarbers(Array.isArray(barbersRes.data) ? barbersRes.data : []);
      } catch {
        setBarbers([]);
      }
    })();
  }, [apiFetch]);

  const handleAskSlots = useCallback(
    async (dateISO: string, unitId: string, serviceId: string) => {
      try {
        setLoadingSlots(true);
        setSlots([]);
        const url = `/units/${unitId}/availability?serviceId=${serviceId}&startDate=${dateISO}&endDate=${dateISO}`;
        const res = await apiFetch(url);
        const data: Slot[] = res.data?.[0]?.slots ?? [];
        setSlots(data);
      } catch (err) {
        console.error(err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [apiFetch],
  );

  const handleConfirm = useCallback(
    async ({ unit, service, slot, barber }: { unit: Unit; service: Service; slot: Slot; barber?: Barber }) => {
      if (!session?.user?.id) {
        alert("Faça login novamente para agendar.");
        return;
      }
      try {
        const duration = service.durationMin || 30;
        const startAt = slot.start;
        const endAt = new Date(new Date(slot.start).getTime() + duration * 60_000).toISOString();
        const body = { userId: session.user.id, unitId: unit.id, serviceId: service.id, barberId: barber?.id, startAt, endAt };
        const res = await apiFetch("/bff/book", { method: "POST", body: JSON.stringify(body) });
        const appt: Appointment = {
          id: res.appointmentId || crypto.randomUUID(),
          unit,
          service,
          barber,
          startAt,
          endAt,
          status: "scheduled",
        };
        setAppointments((prev) => [appt, ...prev]);
        setView("appointments");
        setToast({ message: "Agendamento criado com sucesso!", kind: "success" });
      } catch (err) {
        console.error(err);
        setToast({ message: "Não foi possível criar o agendamento (conflito ou erro de rede).", kind: "error" });
      }
    },
    [apiFetch, session],
  );

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[240px,1fr] gap-6">
        <Sidebar current={view} onChange={setView} />

        <div className="space-y-6">
          {view === "dashboard" && <Dashboard appointments={appointments} onNewBooking={() => setView("booking")} />}
          {view === "booking" && (
            <BookingWizard
              units={units}
              services={services}
              barbers={barbers}
              slots={slots}
              loadingSlots={loadingSlots}
              onAskSlots={handleAskSlots}
              onConfirm={handleConfirm}
              onCancel={() => setView("dashboard")}
            />
          )}
          {view === "appointments" && <AppointmentsList appointments={appointments} />}
          {view === "metrics" && <MetricsView appointments={appointments} />}
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`rounded-2xl shadow-xl px-4 py-3 text-sm font-semibold text-white transition-all ${
              toast.kind === "error" ? "bg-rose-500" : "bg-emerald-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

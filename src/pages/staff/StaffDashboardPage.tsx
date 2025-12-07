import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "@/config/env";
import { Agenda } from "./components/Agenda";
import { BlockManager } from "./components/BlockManager";
import { Notifications } from "./components/Notifications";
import { Sidebar } from "./components/Sidebar";
import { SlotAvailability } from "./components/SlotAvailability";
import { Appointment, Block, Slot } from "./types";

const SESSION_KEY = "barber-flow-session";

export default function StaffDashboardPage() {
  const [view, setView] = useState<"agenda" | "bloqueios" | "slots" | "notificacoes">("agenda");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "alert" | "info" }[]>([]);
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
    // Para demo, usa agenda fake; para produção, criaria endpoint GET /agendamentos?date=...
    setAppointments([
      { id: "a1", clientName: "João", serviceName: "Corte", startAt: new Date().toISOString(), status: "scheduled" },
      { id: "a2", clientName: "Maria", serviceName: "Barba", startAt: new Date(Date.now() + 3600_000).toISOString(), status: "scheduled" },
    ]);
    // Slots iniciais (pode vir de GET /units/:id/availability)
    setSlots(
      Array.from({ length: 8 }).map((_, i) => {
        const start = new Date();
        start.setHours(9 + i, 0, 0, 0);
        const end = new Date(start.getTime() + 30 * 60_000);
        return { id: `slot-${i}`, start: start.toISOString(), end: end.toISOString(), state: i % 3 === 0 ? "booked" : "free" };
      }),
    );
  }, []);

  const reloadSlots = useCallback(async () => {
    try {
      // Aqui poderia chamar GET /units/{id}/availability?serviceId=...&startDate=...&endDate=...
      // Por simplicidade, reaproveita o mock atual.
      setSlots((prev) => [...prev]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleToggleSlot = async (slot: Slot) => {
    try {
      if (slot.state === "free") {
        // Bloquear
        await apiFetch("/slots/lock", {
          method: "POST",
          body: JSON.stringify({
            unitId: "u1",
            serviceId: "s1",
            start: slot.start,
            end: slot.end,
          }),
        });
        setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, state: "blocked" } : s)));
      } else if (slot.state === "blocked") {
        await apiFetch("/slots/release", {
          method: "POST",
          body: JSON.stringify({ reservationToken: slot.id }),
        });
        setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, state: "free" } : s)));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar slot");
    }
  };

  const handleMarkNoShow = async (id: string) => {
    try {
      await apiFetch(`/agendamentos/${id}/falta`, { method: "PUT" });
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "no_show" } : a)));
      setNotifications((n) => [{ id: crypto.randomUUID(), message: `Agendamento ${id} marcado como falta`, type: "alert" }, ...n]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      // Não há endpoint específico para check-in; simulamos completado
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a)));
      setNotifications((n) => [{ id: crypto.randomUUID(), message: `Check-in confirmado para ${id}`, type: "success" }, ...n]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBlock = async (block: Omit<Block, "id">) => {
    try {
      const newBlock: Block = { id: crypto.randomUUID(), ...block };
      setBlocks((prev) => [...prev, newBlock]);
      // Em backend real, chamar endpoint de bloqueio
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBlock = async (id: string) => {
    try {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      // Chamada de remoção no backend, se existir
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[240px,1fr] gap-6">
        <Sidebar current={view} onChange={setView} />
        <div className="space-y-6">
          {view === "agenda" && <Agenda appointments={appointments} onCheckIn={handleCheckIn} onMarkNoShow={handleMarkNoShow} />}
          {view === "bloqueios" && <BlockManager blocks={blocks} onCreate={handleCreateBlock} onRemove={handleRemoveBlock} />}
          {view === "slots" && <SlotAvailability slots={slots} onToggle={handleToggleSlot} />}
          {view === "notificacoes" && <Notifications items={notifications} />}
        </div>
      </div>
    </div>
  );
}

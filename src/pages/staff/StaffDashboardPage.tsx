import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { env } from "@/config/env";
import { Agenda } from "./components/Agenda";
import { BlockManager } from "./components/BlockManager";
import { Notifications } from "./components/Notifications";
import { Sidebar } from "./components/Sidebar";
import { SlotAvailability } from "./components/SlotAvailability";
import { Appointment, Block, Slot } from "./types";

const SESSION_KEY = "barber-flow-session";

export default function StaffDashboardPage() {
  const session = useMemo(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }, []);
  const [isReady, setIsReady] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const lastSyncKeyRef = useRef<string>("");

  const [unitId, setUnitId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [barbers, setBarbers] = useState<any[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [units, setUnits] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [view, setView] = useState<"agenda" | "bloqueios" | "slots" | "notificacoes">("agenda");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "alert" | "info" }[]>([]);

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
  const reloadAppointments = useCallback(
    async (options?: { unitList?: any[]; serviceList?: any[]; barberList?: any[]; barberId?: string }) => {
      if (!isReady) return;
      const unitList = options?.unitList ?? units;
      const serviceList = options?.serviceList ?? services;
      const barberList = options?.barberList ?? barbers;
      const barberId = options?.barberId ?? selectedBarberId;

      const query = barberId ? `/appointments?date=${selectedDate}&barberId=${barberId}` : `/appointments?date=${selectedDate}`;
      const res = await apiFetch(query);
      const appointmentsData: Appointment[] = (res.data ?? []).map((a: any) => {
        const unitInfo = unitList.find((u: any) => u.id === a.unitId);
        const serviceInfo = serviceList.find((s: any) => s.id === a.serviceId);
        const barberInfo = barberList.find((b: any) => b.id === a.barberId);
        return {
          id: a.id,
          clientName: a.clientName || a.userId || "Cliente",
          serviceName: serviceInfo?.name || a.serviceId,
          unitName: unitInfo?.name,
          unitAddress: unitInfo?.address,
          startAt: a.startAt,
          status: a.status || "scheduled",
          barberId: barberInfo?.id,
        };
      });
      setAppointments(appointmentsData);
    },
    [apiFetch, barbers, selectedBarberId, services, units, selectedDate, isReady],
  );

  const reloadBlocks = useCallback(async () => {
    try {
      if (!unitId || !isReady) return;
      const res = await apiFetch(`/admin/blocks?unitId=${unitId}&date=${selectedDate}`);
      const data: Block[] = (res.data ?? []).map((b: any) => ({ ...b, start: b.startAt ?? b.start, end: b.endAt ?? b.end }));
      setBlocks(data);
    } catch (err) {
      console.error(err);
    }
  }, [apiFetch, unitId, selectedDate, isReady]);

  const reloadSlots = useCallback(async () => {
    try {
      if (!unitId || !serviceId || !isReady) return;
      const res = await apiFetch(`/units/${unitId}/availability?serviceId=${serviceId}&startDate=${selectedDate}&endDate=${selectedDate}`);
      const apiSlots: Slot[] =
        res.data?.[0]?.slots?.map((s: any, idx: number) => ({
          id: `${idx}-${s.start}`,
          start: s.start,
          end: s.end,
          state: "free",
        })) ?? [];
      setSlots((prev) => {
        const mapped = apiSlots.map((slot) => {
          const existing = prev.find((p) => p.start === slot.start && p.end === slot.end);
          if (existing) return { ...slot, state: existing.state, reservationToken: existing.reservationToken };
          return slot;
        });
        return mapped;
      });
    } catch (err) {
      console.error(err);
    }
  }, [apiFetch, unitId, serviceId, selectedDate]);

  useEffect(() => {
    (async () => {
      try {
        const [unitsRes, servicesRes, barbersRes] = await Promise.all([
          apiFetch("/admin/units"),
          apiFetch("/admin/services"),
          apiFetch("/admin/barbers"),
        ]);
        const unitList = Array.isArray(unitsRes.data) ? unitsRes.data : [];
        const serviceList = Array.isArray(servicesRes.data) ? servicesRes.data : [];
        const barberList = Array.isArray(barbersRes.data) ? barbersRes.data : [];
        setUnits(unitList);
        setServices(serviceList);
        setBarbers(barberList);
        if (unitList[0]) setUnitId(unitList[0].id);
        if (serviceList[0]) setServiceId(serviceList[0].id);
        const sessionBarberId = session?.barber?.id as string | undefined;
        if (barberList.length) {
          setSelectedBarberId(sessionBarberId || barberList[0].id);
        }
        if (sessionBarberId) {
          const barberUnits = barberList.find((b: any) => b.id === sessionBarberId)?.units || [];
          if (barberUnits[0]) setUnitId(barberUnits[0]);
        } else {
          if (unitList[0]) setUnitId(unitList[0].id);
        }
        setIsReady(true);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [apiFetch, session]);

  // Recarrega dados quando filtros mudam
  useEffect(() => {
    if (!isReady) return;
    if (!selectedBarberId && barbers.length) {
      setSelectedBarberId(session?.barber?.id || barbers[0].id);
      return;
    }
    const key = `${selectedDate}|${unitId}|${serviceId}|${selectedBarberId}`;
    if (lastSyncKeyRef.current === key) return;
    lastSyncKeyRef.current = key;
    reloadAppointments();
    reloadBlocks();
    reloadSlots();
  }, [isReady, selectedDate, unitId, serviceId, selectedBarberId, barbers.length, session, reloadAppointments, reloadBlocks, reloadSlots]);

  const handleToggleSlot = async (slot: Slot) => {
    try {
      if (!unitId || !serviceId) {
        alert("Cadastre unidade e serviço para gerenciar slots.");
        return;
      }
      if (slot.state === "free") {
        // Bloquear
        const res = await apiFetch("/slots/lock", {
          method: "POST",
          body: JSON.stringify({
            unitId,
            serviceId,
            startAt: slot.start,
            endAt: slot.end,
          }),
        });
        setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, state: "blocked", reservationToken: res.reservationToken } : s)));
        setNotifications((n) => [{ id: crypto.randomUUID(), message: "Horário bloqueado.", type: "info" }, ...n]);
      } else if (slot.state === "blocked") {
        if (slot.reservationToken) {
          await apiFetch("/slots/release", {
            method: "POST",
            body: JSON.stringify({ token: slot.reservationToken }),
          });
        }
        setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, state: "free", reservationToken: undefined } : s)));
        setNotifications((n) => [{ id: crypto.randomUUID(), message: "Bloqueio removido.", type: "info" }, ...n]);
      }
    } catch (err) {
      console.error(err);
      setNotifications((n) => [{ id: crypto.randomUUID(), message: "Falha ao alterar slot (possível conflito).", type: "alert" }, ...n]);
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
      if (!unitId) {
        alert("Selecione uma unidade para criar bloqueios.");
        return;
      }
      const startDateTime = `${selectedDate}T${block.start}`;
      const endDateTime = `${selectedDate}T${block.end}`;
      const res = await apiFetch("/admin/blocks", {
        method: "POST",
        body: JSON.stringify({ unitId, startAt: startDateTime, endAt: endDateTime, reason: block.reason }),
      });
      setBlocks((prev) => [...prev, { id: res.id, start: block.start, end: block.end, reason: block.reason }]);
      await reloadSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBlock = async (id: string) => {
    try {
      await apiFetch(`/admin/blocks/${id}`, { method: "DELETE" });
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      await reloadSlots();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[240px,1fr] gap-6">
        <Sidebar current={view} onChange={setView} />
        <div className="space-y-6">
          {view === "agenda" && (
            <Agenda
              appointments={appointments}
              onCheckIn={handleCheckIn}
              onMarkNoShow={handleMarkNoShow}
              barbers={session?.barber ? barbers.filter((b) => b.id === selectedBarberId) : barbers}
              selectedBarberId={selectedBarberId}
              onSelectBarber={session?.barber ? undefined : setSelectedBarberId}
            />
          )}
          {view === "bloqueios" && (
            <BlockManager
              blocks={blocks}
              selectedDate={selectedDate}
              onDateChange={(v) => {
                setSelectedDate(v);
              }}
              onCreate={handleCreateBlock}
              onRemove={handleRemoveBlock}
            />
          )}
          {view === "slots" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-600">Data</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  className="p-2 rounded-lg border border-slate-200"
                />
              </div>
              <SlotAvailability slots={slots} onToggle={handleToggleSlot} />
            </div>
          )}
          {view === "notificacoes" && <Notifications items={notifications} />}
        </div>
      </div>
    </div>
  );
}

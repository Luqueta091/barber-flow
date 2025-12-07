import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "@/config/env";
import type { Unit, Service, Barber } from "./types";

const defaultTimezone = "America/Sao_Paulo";
const mockBarbers: Barber[] = [
  { id: "b1", name: "Lucas", contact: "(11) 99999-9999", units: [], isActive: true },
  { id: "b2", name: "Marcos", contact: "(11) 98888-8888", units: [], isActive: true },
];

type Tab = "units" | "services" | "barbers";

export default function AdminPanelPage() {
  const [tab, setTab] = useState<Tab>("units");
  const [units, setUnits] = useState<Unit[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>(mockBarbers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(
    () => ({
      async get(path: string) {
        const res = await fetch(`${env.VITE_API_BASE}${path}`);
        if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
        return res.json();
      },
      async send(path: string, method: string, body?: unknown) {
        const res = await fetch(`${env.VITE_API_BASE}${path}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Erro ${method} ${path}`);
        }
        return res.json().catch(() => ({}));
      },
    }),
    [],
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const unitsRes = await api.get("/admin/units");
        setUnits(unitsRes.data ?? []);
      } catch (e) {
        console.error(e);
        setUnits([]);
        setError("Falha ao carregar unidades");
      }
      try {
        const servicesRes = await api.get("/admin/services");
        setServices(servicesRes.data ?? []);
      } catch (e) {
        console.error(e);
        setServices([]);
      }
      try {
        const barbersRes = await api.get("/admin/barbers");
        setBarbers(barbersRes.data?.length ? barbersRes.data : mockBarbers);
      } catch (e) {
        console.error(e);
        setBarbers(mockBarbers);
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  const createUnit = useCallback(
    async (input: Partial<Unit>) => {
      const payload = {
        name: input.name || "Unidade sem nome",
        address: input.address,
        timezone: input.timezone || defaultTimezone,
        openTime: input.openTime,
        closeTime: input.closeTime,
        capacity: input.capacity,
        isActive: input.isActive ?? true,
      };
      const res = await api.send("/admin/units", "POST", payload);
      setUnits((prev) => [...prev, res]);
    },
    [api],
  );

  const updateUnit = useCallback(
    async (id: string, input: Partial<Unit>) => {
      const res = await api.send(`/admin/units/${id}`, "PUT", input);
      setUnits((prev) => prev.map((u) => (u.id === id ? res : u)));
    },
    [api],
  );

  const deleteUnit = useCallback(
    async (id: string) => {
      await api.send(`/admin/units/${id}`, "DELETE");
      setUnits((prev) => prev.filter((u) => u.id !== id));
    },
    [api],
  );

  const createService = useCallback(
    async (input: Partial<Service>) => {
      if (!input.unitId) throw new Error("Selecione uma unidade");
      const payload = {
        unitId: input.unitId,
        name: input.name || "Serviço",
        durationMinutes: input.durationMinutes || 30,
        bufferAfterMinutes: input.bufferAfterMinutes ?? 0,
        capacity: input.capacity || 1,
        price: input.price ?? 0,
        image: input.image,
      };
      const res = await api.send("/admin/services", "POST", payload);
      setServices((prev) => [...prev, res]);
    },
    [api],
  );

  const updateService = useCallback(
    async (id: string, input: Partial<Service>) => {
      const res = await api.send(`/admin/services/${id}`, "PUT", input);
      setServices((prev) => prev.map((s) => (s.id === id ? res : s)));
    },
    [api],
  );

  const deleteService = useCallback(
    async (id: string) => {
      await api.send(`/admin/services/${id}`, "DELETE");
      setServices((prev) => prev.filter((s) => s.id !== id));
    },
    [api],
  );

  const createBarber = useCallback(
    async (input: Partial<Barber>) => {
      const payload = {
        name: input.name || "Barbeiro",
        contact: input.contact,
        units: input.units ?? [],
        isActive: input.isActive ?? true,
      };
      const res = await api.send("/admin/barbers", "POST", payload);
      setBarbers((prev) => [...prev, res]);
    },
    [api],
  );

  const updateBarber = useCallback(
    async (id: string, input: Partial<Barber>) => {
      const res = await api.send(`/admin/barbers/${id}`, "PUT", input);
      setBarbers((prev) => prev.map((b) => (b.id === id ? res : b)));
    },
    [api],
  );

  const deleteBarber = useCallback(
    async (id: string) => {
      await api.send(`/admin/barbers/${id}`, "DELETE");
      setBarbers((prev) => prev.filter((b) => b.id !== id));
    },
    [api],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
        <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Admin</div>
            <div className="text-lg font-bold text-slate-900">Painel</div>
          </div>
          <nav className="space-y-2">
            <TabButton active={tab === "units"} onClick={() => setTab("units")} label="Unidades" />
            <TabButton active={tab === "services"} onClick={() => setTab("services")} label="Serviços" />
            <TabButton active={tab === "barbers"} onClick={() => setTab("barbers")} label="Barbeiros" />
          </nav>
        </aside>

        <div className="space-y-6">
          {loading && <p className="text-slate-500">Carregando...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {tab === "units" && (
            <UnitsSection
              units={units}
              onCreate={() => {
                const name = window.prompt("Nome da unidade", "Nova unidade") || "Nova unidade";
                const address = window.prompt("Endereço", "") || "";
                const openTime = window.prompt("Hora de abertura (HH:mm)", "09:00") || "09:00";
                const closeTime = window.prompt("Hora de fechamento (HH:mm)", "18:00") || "18:00";
                const capacity = Number(window.prompt("Capacidade por hora", "1") || 1);
                createUnit({ name, address, openTime, closeTime, capacity, timezone: defaultTimezone });
              }}
              onDelete={deleteUnit}
              onToggle={(id) => {
                const unit = units.find((u) => u.id === id);
                if (!unit) return;
                updateUnit(id, { isActive: !unit.isActive });
              }}
              onEdit={(u) => {
                const name = window.prompt("Nome da unidade", u.name) || u.name;
                const address = window.prompt("Endereço", u.address || "") || u.address;
                const openTime = window.prompt("Hora de abertura", u.openTime || "09:00") || u.openTime;
                const closeTime = window.prompt("Hora de fechamento", u.closeTime || "18:00") || u.closeTime;
                const capacity = Number(window.prompt("Capacidade por hora", String(u.capacity ?? 1)) || u.capacity || 1);
                updateUnit(u.id, { name, address, openTime, closeTime, capacity });
              }}
            />
          )}

          {tab === "services" && (
            <ServicesSection
              services={services}
              units={units}
              onCreate={() => {
                if (!units[0]) return;
                const name = window.prompt("Nome do serviço", "Novo serviço") || "Novo serviço";
                const price = Number(window.prompt("Preço", "0") || 0);
                const duration = Number(window.prompt("Duração (min)", "30") || 30);
                createService({ unitId: units[0].id, name, durationMinutes: duration, bufferAfterMinutes: 0, capacity: 1, price });
              }}
              onDelete={deleteService}
              onEdit={(svc) => {
                const name = window.prompt("Nome do serviço", svc.name) || svc.name;
                const price = Number(window.prompt("Preço", String(svc.price ?? 0)) || svc.price || 0);
                const duration = Number(window.prompt("Duração (min)", String(svc.durationMinutes)) || svc.durationMinutes);
                updateService(svc.id, { name, price, durationMinutes: duration });
              }}
            />
          )}

          {tab === "barbers" && (
            <BarbersSection
              barbers={barbers}
              onCreate={() => {
                const name = window.prompt("Nome do barbeiro", "Barbeiro") || "Barbeiro";
                const contact = window.prompt("Contato", "") || "";
                createBarber({ name, contact, units: units.map((u) => u.id) });
              }}
              onEdit={(b) => {
                const name = window.prompt("Nome", b.name) || b.name;
                const contact = window.prompt("Contato", b.contact || "") || b.contact;
                updateBarber(b.id, { name, contact });
              }}
              onDelete={deleteBarber}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${active ? "bg-emerald-600 text-white shadow-md" : "text-slate-700 hover:bg-slate-100"}`}
    >
      {label}
    </button>
  );
}

function UnitsSection({
  units,
  onCreate,
  onDelete,
  onToggle,
  onEdit,
}: {
  units: Unit[];
  onCreate: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (u: Unit) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Unidades</h3>
        <button onClick={onCreate} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
          + Unidade
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {units.map((u) => (
          <div key={u.id} data-unit-id={u.id} className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-slate-900 text-lg">{u.name}</div>
              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${u.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {u.isActive !== false ? "Ativa" : "Inativa"}
              </span>
            </div>
            {u.address && <div className="text-slate-500 text-sm">{u.address}</div>}
            <div className="text-xs text-slate-500">
              Horário: {u.openTime || "09:00"} - {u.closeTime || "18:00"} | Capacidade: {u.capacity ?? 1}/h
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => onToggle(u.id)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">
                Alternar
              </button>
              <button onClick={() => onEdit(u)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                Editar
              </button>
              <button onClick={() => onDelete(u.id)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                Remover
              </button>
            </div>
          </div>
        ))}
        {units.length === 0 && <div className="text-slate-500 text-sm">Nenhuma unidade cadastrada.</div>}
      </div>
    </div>
  );
}

function ServicesSection({
  services,
  units,
  onCreate,
  onDelete,
  onEdit,
}: {
  services: Service[];
  units: Unit[];
  onCreate: () => void;
  onDelete: (id: string) => void;
  onEdit: (s: Service) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Serviços</h3>
        <button onClick={onCreate} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
          + Serviço
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500 uppercase text-xs">
            <tr>
              <th className="py-2 pr-4">Nome</th>
              <th className="py-2 pr-4">Duração</th>
              <th className="py-2 pr-4">Capacidade</th>
              <th className="py-2 pr-4">Unidade</th>
              <th className="py-2 pr-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((s) => {
              const unit = units.find((u) => u.id === s.unitId);
              return (
                <tr key={s.id} data-service-id={s.id} className="text-slate-800">
                  <td className="py-3 pr-4 font-semibold">{s.name}</td>
                  <td className="py-3 pr-4">{s.durationMinutes} min</td>
                  <td className="py-3 pr-4">{s.capacity}</td>
                  <td className="py-3 pr-4">{unit?.name || s.unitId}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => onEdit(s)}
                      className="mr-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    >
                      Editar
                    </button>
                    <button onClick={() => onDelete(s.id)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })}
            {services.length === 0 && (
              <tr>
                <td className="py-3 pr-4 text-slate-500" colSpan={5}>
                  Nenhum serviço cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BarbersSection({
  barbers,
  onCreate,
  onEdit,
  onDelete,
}: {
  barbers: Barber[];
  onCreate: () => void;
  onEdit: (b: Barber) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Barbeiros</h3>
        <button onClick={onCreate} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
          + Barbeiro
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barbers.map((b) => (
          <div key={b.id} data-barber-id={b.id} className="p-4 border border-slate-200 rounded-xl bg-white">
            <div className="font-bold text-slate-900 text-lg">{b.name}</div>
            {b.contact && <div className="text-slate-500 text-sm">{b.contact}</div>}
            <div className="text-xs text-slate-500 mt-1">Unidades: {b.units?.length ? b.units.join(", ") : "Não vinculado"}</div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onEdit(b)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                Editar
              </button>
              <button onClick={() => onDelete(b.id)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                Remover
              </button>
            </div>
          </div>
        ))}
        {barbers.length === 0 && <div className="text-slate-500 text-sm">Nenhum barbeiro cadastrado.</div>}
      </div>
    </div>
  );
}

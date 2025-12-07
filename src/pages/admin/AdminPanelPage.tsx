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
  const [unitForm, setUnitForm] = useState<Partial<Unit>>({ name: "", address: "", openTime: "09:00", closeTime: "18:00", capacity: 1 });
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({ name: "", durationMinutes: 30, capacity: 1, price: 0 });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [barberForm, setBarberForm] = useState<Partial<Barber>>({ name: "", contact: "" });
  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);
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
        setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : []);
      } catch (e) {
        console.error(e);
        setUnits([]);
        setError("Falha ao carregar unidades");
      }
      try {
        const servicesRes = await api.get("/admin/services");
        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
      } catch (e) {
        console.error(e);
        setServices([]);
      }
      try {
        const barbersRes = await api.get("/admin/barbers");
        if (Array.isArray(barbersRes.data) && barbersRes.data.length) {
          setBarbers(barbersRes.data);
        } else {
          // Seed barbeiros mock no backend para evitar 404 em editar/remover
          const seeded: Barber[] = [];
          for (const b of mockBarbers) {
            try {
              const created = await api.send("/admin/barbers", "POST", b);
              seeded.push(created);
            } catch (err) {
              console.error("Erro ao semear barbeiro", err);
            }
          }
          setBarbers(seeded.length ? seeded : mockBarbers);
        }
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
      setUnitForm({ name: "", address: "", openTime: "09:00", closeTime: "18:00", capacity: 1 });
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
      setServiceForm({ name: "", durationMinutes: 30, capacity: 1, price: 0 });
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
      setBarberForm({ name: "", contact: "" });
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
              form={unitForm}
              onFormChange={setUnitForm}
              onCreate={() => {
                if (!unitForm.name || !unitForm.address || !unitForm.openTime || !unitForm.closeTime || !unitForm.capacity) {
                  alert("Preencha nome, endereço, horário de abertura/fechamento e capacidade.");
                  return;
                }
                const safeCapacity = Number(unitForm.capacity) || 1;
                createUnit({ ...unitForm, capacity: safeCapacity, timezone: defaultTimezone });
              }}
              onDelete={deleteUnit}
              onToggle={(id) => {
                const unit = units.find((u) => u.id === id);
                if (!unit) return;
                updateUnit(id, { isActive: !unit.isActive });
              }}
              onEditStart={(u) => {
                setEditingUnitId(u.id);
                setUnitForm({
                  name: u.name,
                  address: u.address,
                  openTime: u.openTime,
                  closeTime: u.closeTime,
                  capacity: u.capacity,
                });
              }}
              onSaveEdit={(u) => {
                if (!editingUnitId) return;
                updateUnit(editingUnitId, u);
                setEditingUnitId(null);
                setUnitForm({ name: "", address: "", openTime: "09:00", closeTime: "18:00", capacity: 1 });
              }}
              editingId={editingUnitId}
            />
          )}

          {tab === "services" && (
            <ServicesSection
              services={services}
              units={units}
              form={serviceForm}
              onFormChange={setServiceForm}
              onCreate={() => {
                if (!units[0]) return;
                createService({ ...serviceForm, unitId: serviceForm.unitId || units[0].id });
              }}
              onDelete={deleteService}
              onEditStart={(svc) => {
                setEditingServiceId(svc.id);
                setServiceForm({
                  name: svc.name,
                  price: svc.price,
                  durationMinutes: svc.durationMinutes,
                  capacity: svc.capacity,
                  unitId: svc.unitId,
                });
              }}
              onSaveEdit={(svc) => {
                if (!editingServiceId) return;
                updateService(editingServiceId, svc);
                setEditingServiceId(null);
                setServiceForm({ name: "", durationMinutes: 30, capacity: 1, price: 0 });
              }}
              editingId={editingServiceId}
            />
          )}

          {tab === "barbers" && (
            <BarbersSection
              barbers={barbers}
              form={barberForm}
              onFormChange={setBarberForm}
              onCreate={() => createBarber(barberForm)}
              onEditStart={(b) => {
                setEditingBarberId(b.id);
                setBarberForm({ name: b.name, contact: b.contact });
              }}
              onSaveEdit={(b) => {
                if (!editingBarberId) return;
                updateBarber(editingBarberId, b);
                setEditingBarberId(null);
                setBarberForm({ name: "", contact: "" });
              }}
              onDelete={deleteBarber}
              editingId={editingBarberId}
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
  onEditStart,
  onSaveEdit,
  form,
  onFormChange,
  editingId,
}: {
  units: Unit[];
  onCreate: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEditStart: (u: Unit) => void;
  onSaveEdit: (u: Partial<Unit>) => void;
  form: Partial<Unit>;
  onFormChange: (v: Partial<Unit>) => void;
  editingId: string | null;
}) {
  const safeUnits = Array.isArray(units) ? units : [];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Unidades</h3>
        <button onClick={onCreate} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
          + Unidade
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <input
          className="p-3 rounded-xl border border-slate-200"
          placeholder="Nome"
          value={form.name || ""}
          onChange={(e) => onFormChange({ ...form, name: e.target.value })}
        />
        <input
          className="p-3 rounded-xl border border-slate-200"
          placeholder="Endereço"
          value={form.address || ""}
          onChange={(e) => onFormChange({ ...form, address: e.target.value })}
        />
        <input
          className="p-3 rounded-xl border border-slate-200"
          placeholder="Abre (HH:mm)"
          value={form.openTime || ""}
          onChange={(e) => onFormChange({ ...form, openTime: e.target.value })}
        />
        <input
          className="p-3 rounded-xl border border-slate-200"
          placeholder="Fecha (HH:mm)"
          value={form.closeTime || ""}
          onChange={(e) => onFormChange({ ...form, closeTime: e.target.value })}
        />
        <input
          className="p-3 rounded-xl border border-slate-200"
          placeholder="Capacidade/h"
          type="number"
          value={form.capacity ?? ""}
          onChange={(e) => onFormChange({ ...form, capacity: Number(e.target.value) })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeUnits.map((u) => (
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
              <button onClick={() => onEditStart(u)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                Editar
              </button>
              {editingId === u.id && (
                <button
                  onClick={() => onSaveEdit(form)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  Salvar
                </button>
              )}
              <button onClick={() => onDelete(u.id)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                Remover
              </button>
            </div>
          </div>
        ))}
        {safeUnits.length === 0 && <div className="text-slate-500 text-sm">Nenhuma unidade cadastrada.</div>}
      </div>
    </div>
  );
}

function ServicesSection({
  services,
  units,
  onCreate,
  onDelete,
  onEditStart,
  onSaveEdit,
  form,
  onFormChange,
  editingId,
}: {
  services: Service[];
  units: Unit[];
  onCreate: () => void;
  onDelete: (id: string) => void;
  onEditStart: (s: Service) => void;
  onSaveEdit: (s: Partial<Service>) => void;
  form: Partial<Service>;
  onFormChange: (v: Partial<Service>) => void;
  editingId: string | null;
}) {
  const safeServices = Array.isArray(services) ? services : [];
  const safeUnits = Array.isArray(units) ? units : [];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Serviços</h3>
        <button onClick={onCreate} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
          + Serviço
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Nome</label>
          <input
            className="p-3 rounded-xl border border-slate-200"
            placeholder="Ex.: Corte clássico"
            value={form.name || ""}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Preço (R$)</label>
          <input
            className="p-3 rounded-xl border border-slate-200"
            placeholder="Ex.: 60"
            type="number"
            value={form.price ?? ""}
            onChange={(e) => onFormChange({ ...form, price: Number(e.target.value) })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Duração (min)</label>
          <input
            className="p-3 rounded-xl border border-slate-200"
            placeholder="Ex.: 30"
            type="number"
            value={form.durationMinutes ?? ""}
            onChange={(e) => onFormChange({ ...form, durationMinutes: Number(e.target.value) })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Capacidade/h</label>
          <input
            className="p-3 rounded-xl border border-slate-200"
            placeholder="Ex.: 1"
            type="number"
            value={form.capacity ?? ""}
            onChange={(e) => onFormChange({ ...form, capacity: Number(e.target.value) })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Unidade</label>
          <select
            className="p-3 rounded-xl border border-slate-200"
            value={form.unitId || ""}
            onChange={(e) => onFormChange({ ...form, unitId: e.target.value })}
          >
            <option value="">Selecione</option>
          {safeUnits.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
          </select>
        </div>
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
            {safeServices.map((s) => {
              const unit = safeUnits.find((u) => u.id === s.unitId);
              return (
                <tr key={s.id} data-service-id={s.id} className="text-slate-800">
                  <td className="py-3 pr-4 font-semibold">{s.name}</td>
                  <td className="py-3 pr-4">{s.durationMinutes} min</td>
                  <td className="py-3 pr-4">{s.capacity}</td>
                  <td className="py-3 pr-4">{unit?.name || s.unitId}</td>
                  <td className="py-3 pr-4">
                    <button onClick={() => onEditStart(s)} className="mr-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                      Editar
                    </button>
                    {editingId === s.id && (
                      <button
                        onClick={() => onSaveEdit(form)}
                        className="mr-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Salvar
                      </button>
                    )}
                    <button onClick={() => onDelete(s.id)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })}
            {safeServices.length === 0 && (
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
  onEditStart,
  onSaveEdit,
  onDelete,
  form,
  onFormChange,
  editingId,
}: {
  barbers: Barber[];
  onCreate: () => void;
  onEditStart: (b: Barber) => void;
  onSaveEdit: (b: Partial<Barber>) => void;
  onDelete: (id: string) => void;
  form: Partial<Barber>;
  onFormChange: (v: Partial<Barber>) => void;
  editingId: string | null;
}) {
  const safeBarbers = Array.isArray(barbers) ? barbers : [];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Barbeiros</h3>
        <button onClick={onCreate} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
          + Barbeiro
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          className="p-3 rounded-xl border border-slate-200"
          placeholder="Nome"
          value={form.name || ""}
          onChange={(e) => onFormChange({ ...form, name: e.target.value })}
        />
        <input
          className="p-3 rounded-xl border border-slate-200"
          placeholder="Contato"
          value={form.contact || ""}
          onChange={(e) => onFormChange({ ...form, contact: e.target.value })}
        />
        <select
          className="p-3 rounded-xl border border-slate-200"
          value={form.isActive === false ? "inactive" : "active"}
          onChange={(e) => onFormChange({ ...form, isActive: e.target.value === "active" })}
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeBarbers.map((b) => (
          <div key={b.id} data-barber-id={b.id} className="p-4 border border-slate-200 rounded-xl bg-white">
            <div className="font-bold text-slate-900 text-lg">{b.name}</div>
            {b.contact && <div className="text-slate-500 text-sm">{b.contact}</div>}
            <div className="text-xs text-slate-500 mt-1">Unidades: {b.units?.length ? b.units.join(", ") : "Não vinculado"}</div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onEditStart(b)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                Editar
              </button>
              {editingId === b.id && (
                <button
                  onClick={() => onSaveEdit(form)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  Salvar
                </button>
              )}
              <button onClick={() => onDelete(b.id)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                Remover
              </button>
            </div>
          </div>
        ))}
        {safeBarbers.length === 0 && <div className="text-slate-500 text-sm">Nenhum barbeiro cadastrado.</div>}
      </div>
    </div>
  );
}

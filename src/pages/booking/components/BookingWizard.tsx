import { useEffect, useMemo, useState } from "react";
import { Barber, Service, Slot, Unit } from "../types";
import { IconCheck, IconChevronRight, IconClock, IconMapPin } from "./Icons";
import { format } from "date-fns";

type Step = 1 | 2 | 3 | 4 | 5;

interface Props {
  units: Unit[];
  services: Service[];
  barbers: Barber[];
  slots: Slot[];
  loadingSlots: boolean;
  onAskSlots: (dateISO: string, unitId: string, serviceId: string) => void;
  onConfirm: (payload: { unit: Unit; service: Service; barber?: Barber; slot: Slot }) => void;
  onCancel: () => void;
}

export function BookingWizard({ units, services, barbers, slots, loadingSlots, onAskSlots, onConfirm, onCancel }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [unitId, setUnitId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [barberId, setBarberId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const selectedUnit = useMemo(() => units.find((u) => u.id === unitId), [unitId, units]);
  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [serviceId, services]);
  const selectedBarber = useMemo(() => barbers.find((b) => b.id === barberId), [barberId, barbers]);

  useEffect(() => {
    setSelectedSlot(null);
    if (selectedDate && selectedUnit && selectedService) {
      const date = selectedDate;
      onAskSlots(date, selectedUnit.id, selectedService.id);
    }
  }, [selectedDate, selectedUnit, selectedService, onAskSlots]);

  const stepDisabled =
    (step === 1 && !selectedUnit) ||
    (step === 2 && !selectedService) ||
    (step === 3 && !selectedBarber) ||
    (step === 4 && (!selectedDate || !selectedSlot));

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Novo Agendamento</h2>
        <p className="text-slate-500 mt-1">Siga os passos para reservar seu horário.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-8 flex-1 overflow-y-auto">
          <Progress step={step} />

          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Escolha a Unidade</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {units.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => setUnitId(unit.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all group hover:shadow-md ${
                      unitId === unit.id ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-200"
                    }`}
                  >
                    <div className="h-32 rounded-lg bg-slate-200 overflow-hidden mb-4">
                      <img src={unit.image || "https://picsum.photos/400/200"} alt={unit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="font-bold text-slate-900 text-lg">{unit.name}</div>
                    {unit.address && (
                      <div className="text-slate-500 text-sm flex items-center mt-1">
                        <IconMapPin className="w-4 h-4 mr-1" />
                        {unit.address}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Selecione o Serviço</h3>
              <div className="space-y-3">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => setServiceId(svc.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all flex justify-between items-center group hover:shadow-sm ${
                      serviceId === svc.id ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-200"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{svc.name}</div>
                      {svc.description && <div className="text-slate-500 text-sm mt-1">{svc.description}</div>}
                      <div className="text-xs font-semibold text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded-md">
                        {svc.durationMin} minutos
                      </div>
                    </div>
                    <div className="text-xl font-bold text-slate-900">R$ {svc.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Escolha o Profissional</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {barbers.map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => setBarberId(barber.id)}
                    className={`text-center p-6 rounded-xl border-2 transition-all hover:shadow-md flex flex-col items-center justify-center h-full ${
                      barberId === barber.id ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-200"
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-lg">{barber.name}</div>
                    {barber.specialty && <div className="text-xs text-slate-500 mt-1">{barber.specialty}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Data e Hora</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Selecione o Dia</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Horários Disponíveis</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {loadingSlots && <div className="col-span-3 text-center text-slate-400 py-4 bg-slate-50 rounded-lg text-sm">Carregando...</div>}
                    {!loadingSlots && selectedDate && slots.length === 0 && (
                      <div className="col-span-3 text-center text-slate-400 py-4 bg-slate-50 rounded-lg text-sm">Sem horários para esta data.</div>
                    )}
                    {!loadingSlots &&
                      slots.map((slot) => {
                        const label = format(new Date(slot.start), "HH:mm");
                        const isSelected = selectedSlot?.start === slot.start;
                        return (
                          <button
                            key={slot.start}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    {!selectedDate && <div className="col-span-3 text-center text-slate-400 py-4 bg-slate-50 rounded-lg text-sm">Selecione um dia primeiro</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && selectedUnit && selectedService && selectedSlot && (
            <div className="animate-fade-in max-w-lg mx-auto">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <IconCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-1">Quase lá!</h3>
                <p className="text-emerald-700 text-sm">Confira os detalhes antes de agendar.</p>
              </div>

              <div className="space-y-4 border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                <Row label="Unidade" value={selectedUnit.name} />
                <Row label="Serviço" value={selectedService.name} />
                <Row label="Profissional" value={selectedBarber?.name || "Qualquer"} />
                <Row label="Data e Hora" value={`${format(new Date(selectedSlot.start), "dd/MM/yyyy 'às' HH:mm")}`} />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-900 font-bold text-lg">Total</span>
                  <span className="font-bold text-emerald-600 text-xl">R$ {selectedService.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep((s) => ((s - 1) as Step))} className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
              Voltar
            </button>
          ) : (
            <button onClick={onCancel} className="px-6 py-2.5 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-colors">
              Cancelar
            </button>
          )}

          <button
            onClick={() => {
              if (step === 5 && selectedUnit && selectedService && selectedSlot) {
                onConfirm({ unit: selectedUnit, service: selectedService, barber: selectedBarber, slot: selectedSlot });
              } else {
                setStep((s) => ((s + 1) as Step));
              }
            }}
            disabled={stepDisabled}
            className={`px-8 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center transition-all ${
              stepDisabled ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/40 active:transform active:scale-95"
            }`}
          >
            {step === 5 ? "Confirmar Agendamento" : "Próximo"}
            {step !== 5 && <IconChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Progress({ step }: { step: Step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
              s <= step ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-300 text-slate-400"
            }`}
          >
            {s < step ? <IconCheck className="w-4 h-4" /> : s}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
        <span>Unidade</span>
        <span>Serviço</span>
        <span>Profissional</span>
        <span>Horário</span>
        <span>Confirmar</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-200">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900 text-right">{value || "-"}</span>
    </div>
  );
}

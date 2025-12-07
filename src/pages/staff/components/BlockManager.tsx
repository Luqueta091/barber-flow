import { useState } from "react";
import { Block } from "../types";

interface Props {
  blocks: Block[];
  onCreate: (block: Omit<Block, "id">) => void;
  onRemove: (id: string) => void;
}

export function BlockManager({ blocks, onCreate, onRemove }: Props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("Almoço");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-900">Bloqueios e Exceções</h3>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!start || !end) return;
          onCreate({ start, end, reason });
          setStart("");
          setEnd("");
        }}
      >
        <div>
          <label className="text-sm font-medium text-slate-700">Início</label>
          <input
            id="block-start"
            type="time"
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Fim</label>
          <input
            id="block-end"
            type="time"
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Motivo</label>
          <select
            id="block-reason"
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option>Almoço</option>
            <option>Férias</option>
            <option>Manutenção</option>
            <option>Outros</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            data-action="create-block"
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            Criar bloqueio
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {blocks.map((b) => (
          <div key={b.id} data-block-id={b.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">
                {b.start} - {b.end}
              </div>
              <div className="text-slate-500 text-sm">{b.reason}</div>
            </div>
            <button
              data-action="remove-block"
              onClick={() => onRemove(b.id)}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
            >
              Remover
            </button>
          </div>
        ))}
        {blocks.length === 0 && <div className="text-slate-500 text-sm">Nenhum bloqueio ativo hoje.</div>}
      </div>
    </div>
  );
}

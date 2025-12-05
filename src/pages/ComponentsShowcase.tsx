import CalendarUI from "@/components/barbershop/CalendarUI";
import TimeSlots from "@/components/barbershop/TimeSlots";
import { Scissors, X, Check, AlertTriangle, Info } from "lucide-react";

const ComponentsShowcase = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="content-container">
        <h1 className="text-3xl font-bold text-foreground mb-2">Design System</h1>
        <p className="text-muted-foreground mb-12">Componentes reutilizáveis do sistema</p>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Botões</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primário</button>
            <button className="btn-secondary">Secundário</button>
            <button className="btn-outline">Outline</button>
            <button className="btn-success">Sucesso</button>
            <button className="btn-destructive">Destrutivo</button>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Inputs</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Label padrão
              </label>
              <input type="text" className="input-base" placeholder="Digite algo..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Com ícone
              </label>
              <div className="relative">
                <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" className="input-base pl-12" placeholder="Serviço..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Textarea
              </label>
              <textarea className="input-base min-h-[100px]" placeholder="Observações..." />
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <span className="badge-success">Agendado</span>
            <span className="badge-warning">Pendente</span>
            <span className="badge-destructive">Cancelado</span>
            <span className="badge-default">Concluído</span>
          </div>
        </section>

        {/* Chips */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Chips de horário</h2>
          <div className="flex flex-wrap gap-2">
            <button className="chip-default">09:00</button>
            <button className="chip-selected">09:30</button>
            <button className="chip-default">10:00</button>
            <button className="chip-disabled">10:30</button>
            <button className="chip-default">11:00</button>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Card básico</h3>
              <p className="text-muted-foreground">Um card simples com conteúdo.</p>
            </div>
            <div className="card-interactive p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Card interativo</h3>
              <p className="text-muted-foreground">Card com efeito hover.</p>
            </div>
            <div className="card-base p-6 border-primary/50 bg-primary/5">
              <h3 className="text-lg font-semibold text-foreground mb-2">Card destacado</h3>
              <p className="text-muted-foreground">Card com destaque especial.</p>
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Calendário</h2>
          <div className="max-w-sm">
            <CalendarUI selectedDay={15} />
          </div>
        </section>

        {/* Time Slots */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Horários disponíveis</h2>
          <div className="max-w-lg card-base p-6">
            <TimeSlots selectedTime="14:00" />
          </div>
        </section>

        {/* Alerts / Toasts */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Alerts / Toasts</h2>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
              <Check className="w-5 h-5 text-success" />
              <p className="text-sm text-foreground">Agendamento confirmado com sucesso!</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <X className="w-5 h-5 text-destructive" />
              <p className="text-sm text-foreground">Erro ao processar sua solicitação.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <p className="text-sm text-foreground">Atenção: horário quase esgotado.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <Info className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">Dica: chegue 5 minutos antes.</p>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Tabela responsiva</h2>
          <div className="card-base overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell">Cliente</th>
                    <th className="table-cell">Serviço</th>
                    <th className="table-cell">Horário</th>
                    <th className="table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td className="table-cell font-medium">João Silva</td>
                    <td className="table-cell">Corte + Barba</td>
                    <td className="table-cell">14:00</td>
                    <td className="table-cell"><span className="badge-success">Agendado</span></td>
                  </tr>
                  <tr className="table-row">
                    <td className="table-cell font-medium">Pedro Santos</td>
                    <td className="table-cell">Corte Clássico</td>
                    <td className="table-cell">14:30</td>
                    <td className="table-cell"><span className="badge-warning">Pendente</span></td>
                  </tr>
                  <tr className="table-row">
                    <td className="table-cell font-medium">Lucas Mendes</td>
                    <td className="table-cell">Barba Completa</td>
                    <td className="table-cell">15:00</td>
                    <td className="table-cell"><span className="badge-destructive">Cancelado</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Modal */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Modal</h2>
          <div className="relative bg-muted/50 rounded-xl p-8 flex items-center justify-center min-h-[400px]">
            <div className="modal-content animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Confirmar cancelamento</h3>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-muted-foreground mb-6">
                Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-4">
                <button className="btn-secondary flex-1">Voltar</button>
                <button className="btn-destructive flex-1">Cancelar agendamento</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComponentsShowcase;

import Header from "@/components/barbershop/Header";
import Footer from "@/components/barbershop/Footer";
import { ChevronRight, MapPin, Scissors, Clock, User, MessageSquare } from "lucide-react";

const ConfirmationPage = () => {
  return (
    <div className="page-container">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="content-container py-4">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</a>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Confirmação</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="content-container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="section-title text-3xl">Confirme seu agendamento</h1>
            <p className="section-subtitle">Revise os detalhes antes de confirmar</p>
          </div>

          {/* Summary Card */}
          <div className="card-base p-8 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">Detalhes do agendamento</h3>

            <div className="space-y-4 mb-8">
              {/* Unit */}
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unidade</p>
                  <p className="font-medium text-foreground">BarberPro Centro</p>
                  <p className="text-sm text-muted-foreground">Av. Paulista, 1000 - Centro, São Paulo</p>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Serviço</p>
                  <p className="font-medium text-foreground">Corte + Barba</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Duração: 50 min</span>
                    <span className="font-bold text-primary">R$ 70,00</span>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data e horário</p>
                  <p className="font-medium text-foreground">Domingo, 15 de Dezembro de 2024</p>
                  <p className="text-sm text-muted-foreground">14:00 - 14:50</p>
                </div>
              </div>

              {/* Barber */}
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profissional</p>
                  <p className="font-medium text-foreground">Carlos Silva</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MessageSquare className="w-4 h-4" />
                Observações (opcional)
              </label>
              <textarea
                className="input-base min-h-[100px] resize-none"
                placeholder="Alguma preferência ou informação adicional?"
              />
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-4 border-t border-border mb-6">
              <span className="text-lg text-foreground">Total a pagar</span>
              <span className="text-3xl font-bold text-foreground">R$ 70,00</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/agendar" className="btn-secondary flex-1 justify-center">
                Voltar
              </a>
              <a href="/sucesso" className="btn-primary flex-1 justify-center">
                Confirmar agendamento
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          {/* Info */}
          <p className="text-sm text-muted-foreground text-center">
            Ao confirmar, você concorda com nossa{" "}
            <a href="#" className="text-primary hover:underline">política de cancelamento</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmationPage;

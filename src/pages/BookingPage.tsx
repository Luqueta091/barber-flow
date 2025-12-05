import Header from "@/components/barbershop/Header";
import Footer from "@/components/barbershop/Footer";
import CalendarUI from "@/components/barbershop/CalendarUI";
import TimeSlots from "@/components/barbershop/TimeSlots";
import { ChevronRight, MapPin, Scissors, Clock, User } from "lucide-react";

const BookingPage = () => {
  return (
    <div className="page-container">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="content-container py-4">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</a>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <a href="/unidades" className="text-muted-foreground hover:text-foreground transition-colors">Unidades</a>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <a href="/servicos" className="text-muted-foreground hover:text-foreground transition-colors">Serviços</a>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Agendar</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar & Time */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="section-title text-3xl">Escolha data e horário</h1>
              <p className="section-subtitle">Selecione o melhor momento para você</p>
            </div>

            {/* Calendar */}
            <CalendarUI selectedDay={15} />

            {/* Time Slots */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Horários disponíveis</h3>
              <TimeSlots selectedTime="14:00" />
            </div>

            {/* Barber Selection */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Escolha um profissional (opcional)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["Carlos", "Rafael", "André", "Qualquer"].map((name, index) => (
                  <button
                    key={name}
                    className={`p-4 rounded-lg border transition-all ${
                      index === 0
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className={`text-sm font-medium ${index === 0 ? "text-primary" : "text-foreground"}`}>
                      {name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="card-base p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-foreground mb-6">Resumo do agendamento</h3>

              <div className="space-y-4 mb-6">
                {/* Unit */}
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Unidade</p>
                    <p className="text-sm font-medium text-foreground">BarberPro Centro</p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <Scissors className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Serviço</p>
                    <p className="text-sm font-medium text-foreground">Corte + Barba</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data e horário</p>
                    <p className="text-sm font-medium text-foreground">15 de Dezembro, 14:00</p>
                  </div>
                </div>

                {/* Barber */}
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <User className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Profissional</p>
                    <p className="text-sm font-medium text-foreground">Carlos</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between py-4 border-t border-border mb-6">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">R$ 70,00</span>
              </div>

              {/* Action */}
              <a href="/confirmar" className="btn-primary w-full justify-center">
                Confirmar horário
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;

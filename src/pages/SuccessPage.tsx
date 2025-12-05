import Header from "@/components/barbershop/Header";
import Footer from "@/components/barbershop/Footer";
import { CheckCircle, MapPin, Calendar, Clock, User, Download, Share2 } from "lucide-react";

const SuccessPage = () => {
  return (
    <div className="page-container">
      <Header />

      {/* Main Content */}
      <main className="content-container py-12">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Agendamento confirmado!
            </h1>
            <p className="text-muted-foreground">
              Seu horário foi reservado com sucesso. Enviamos os detalhes para seu e-mail.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="card-base p-6 mb-8 text-left animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-success">Confirmado</span>
              <span className="text-sm text-muted-foreground">#AG12345</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Unidade</p>
                  <p className="font-medium text-foreground">BarberPro Centro</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium text-foreground">15 de Dezembro de 2024</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="font-medium text-foreground">14:00 - 14:50</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Profissional</p>
                  <p className="font-medium text-foreground">Carlos Silva</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-6 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Serviço</span>
                <span className="font-medium text-foreground">Corte + Barba</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">R$ 70,00</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button className="btn-secondary flex-1 justify-center">
              <Download className="w-4 h-4 mr-2" />
              Salvar comprovante
            </button>
            <button className="btn-secondary flex-1 justify-center">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </button>
          </div>

          {/* Main Action */}
          <a href="/minha-agenda" className="btn-primary w-full justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
            Ver minha agenda
          </a>

          {/* Back to Home */}
          <a href="/" className="block mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Voltar para o início
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessPage;

import Header from "@/components/barbershop/Header";
import Footer from "@/components/barbershop/Footer";
import { ChevronRight, Calendar, MapPin, Clock, User, X } from "lucide-react";

const MyAppointmentsPage = () => {
  const appointments = [
    {
      id: "AG12345",
      status: "agendado",
      date: "15 de Dezembro de 2024",
      time: "14:00 - 14:50",
      unit: "BarberPro Centro",
      service: "Corte + Barba",
      barber: "Carlos Silva",
      price: "R$ 70,00",
    },
    {
      id: "AG12344",
      status: "agendado",
      date: "22 de Dezembro de 2024",
      time: "10:00 - 10:30",
      unit: "BarberPro Centro",
      service: "Corte Clássico",
      barber: "Rafael Santos",
      price: "R$ 45,00",
    },
    {
      id: "AG12340",
      status: "concluido",
      date: "01 de Dezembro de 2024",
      time: "16:00 - 16:50",
      unit: "BarberPro Jardins",
      service: "Corte + Barba",
      barber: "André Oliveira",
      price: "R$ 70,00",
    },
    {
      id: "AG12335",
      status: "cancelado",
      date: "20 de Novembro de 2024",
      time: "09:00 - 09:30",
      unit: "BarberPro Centro",
      service: "Barba Completa",
      barber: "Carlos Silva",
      price: "R$ 35,00",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendado":
        return <span className="badge-success">Agendado</span>;
      case "concluido":
        return <span className="badge-default">Concluído</span>;
      case "cancelado":
        return <span className="badge-destructive">Cancelado</span>;
      case "falta":
        return <span className="badge-warning">Falta</span>;
      default:
        return <span className="badge-default">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="content-container py-4">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</a>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Minha Agenda</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="content-container py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="section-title text-3xl">Minha Agenda</h1>
            <p className="section-subtitle mb-0">Gerencie seus agendamentos</p>
          </div>
          <a href="/unidades" className="btn-primary">
            Novo agendamento
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary -mb-px">
            Todos
          </button>
          <button className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Próximos
          </button>
          <button className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Histórico
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="card-base p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Date Badge */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-secondary flex flex-col items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Dez</span>
                    <span className="text-xl font-bold text-foreground">15</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(appointment.status)}
                    <span className="text-sm text-muted-foreground">#{appointment.id}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{appointment.service}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{appointment.barber}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-foreground">{appointment.price}</span>
                  {appointment.status === "agendado" && (
                    <button className="btn-destructive py-2 px-4 text-sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAppointmentsPage;

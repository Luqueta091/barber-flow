import Sidebar from "@/components/barbershop/Sidebar";
import { Calendar, Clock, User, AlertTriangle, CheckCircle } from "lucide-react";

const StaffDashboardPage = () => {
  const todayAppointments = [
    { id: 1, time: "09:00", client: "João Silva", service: "Corte Clássico", status: "concluido" },
    { id: 2, time: "09:30", client: "Pedro Santos", service: "Barba Completa", status: "concluido" },
    { id: 3, time: "10:30", client: "Carlos Oliveira", service: "Corte + Barba", status: "atual" },
    { id: 4, time: "11:30", client: "André Ferreira", service: "Corte Degradê", status: "pendente" },
    { id: 5, time: "13:00", client: "Lucas Mendes", service: "Corte Clássico", status: "pendente" },
    { id: 6, time: "14:00", client: "Rafael Costa", service: "Pigmentação", status: "pendente" },
    { id: 7, time: "15:00", client: "Marcos Lima", service: "Corte + Barba", status: "pendente" },
  ];

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "concluido":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "atual":
        return <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar type="staff" activePage="home" />

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Olá, Carlos!</h1>
          <p className="text-muted-foreground">Terça-feira, 10 de Dezembro de 2024</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos hoje</p>
                <p className="text-2xl font-bold text-foreground">7</p>
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximo</p>
                <p className="text-2xl font-bold text-foreground">11:30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Appointment */}
        <div className="card-base p-6 mb-8 border-primary/50 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <span className="badge bg-primary/20 text-primary mb-1">Em atendimento</span>
                <h3 className="text-lg font-semibold text-foreground">Carlos Oliveira</h3>
                <p className="text-sm text-muted-foreground">Corte + Barba • 10:30 - 11:20</p>
              </div>
            </div>
            <button className="btn-destructive">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Marcar falta
            </button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card-base overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Agenda de hoje</h2>
          </div>

          <div className="divide-y divide-border">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-4 flex items-center gap-4 ${
                  appointment.status === "atual" ? "bg-primary/5" : ""
                } ${appointment.status === "concluido" ? "opacity-50" : ""}`}
              >
                {/* Status */}
                <div className="w-8 flex justify-center">
                  {getStatusIndicator(appointment.status)}
                </div>

                {/* Time */}
                <div className="w-16">
                  <span className={`text-sm font-medium ${
                    appointment.status === "atual" ? "text-primary" : "text-foreground"
                  }`}>
                    {appointment.time}
                  </span>
                </div>

                {/* Client */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>

                {/* Action */}
                {appointment.status === "pendente" && (
                  <button className="btn-outline py-2 px-3 text-sm">
                    Marcar falta
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;

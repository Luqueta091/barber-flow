import Sidebar from "@/components/barbershop/Sidebar";
import { Calendar, Users, XCircle, AlertTriangle, TrendingUp, Building2, Clock } from "lucide-react";

const AdminDashboardPage = () => {
  const appointments = [
    { id: "AG12345", client: "João Silva", service: "Corte + Barba", unit: "Centro", barber: "Carlos", status: "agendado", time: "14:00" },
    { id: "AG12346", client: "Pedro Santos", service: "Corte Clássico", unit: "Jardins", barber: "Rafael", status: "agendado", time: "14:30" },
    { id: "AG12347", client: "Lucas Mendes", service: "Barba Completa", unit: "Centro", barber: "André", status: "concluido", time: "13:00" },
    { id: "AG12348", client: "Marcos Lima", service: "Corte Degradê", unit: "Pinheiros", barber: "Carlos", status: "cancelado", time: "12:00" },
    { id: "AG12349", client: "André Ferreira", service: "Pigmentação", unit: "Centro", barber: "Rafael", status: "falta", time: "11:00" },
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
    <div className="min-h-screen bg-background">
      <Sidebar type="admin" activePage="home" />

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="badge-success">+12%</span>
            </div>
            <p className="text-sm text-muted-foreground">Agendamentos hoje</p>
            <p className="text-3xl font-bold text-foreground">48</p>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <span className="badge-destructive">-3%</span>
            </div>
            <p className="text-sm text-muted-foreground">Cancelamentos</p>
            <p className="text-3xl font-bold text-foreground">5</p>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <span className="badge-warning">+2</span>
            </div>
            <p className="text-sm text-muted-foreground">No-shows</p>
            <p className="text-3xl font-bold text-foreground">3</p>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <span className="badge-success">Ótimo</span>
            </div>
            <p className="text-sm text-muted-foreground">Disponibilidade</p>
            <p className="text-3xl font-bold text-foreground">72%</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unidades ativas</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Barbeiros ativos</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo médio</p>
                <p className="text-2xl font-bold text-foreground">35min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="card-base overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Agendamentos recentes</h2>
            <a href="#" className="text-sm text-primary hover:underline">Ver todos</a>
          </div>

          <div className="overflow-x-auto">
            <table className="table-base">
              <thead className="table-header">
                <tr>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Cliente</th>
                  <th className="table-cell">Serviço</th>
                  <th className="table-cell">Unidade</th>
                  <th className="table-cell">Barbeiro</th>
                  <th className="table-cell">Horário</th>
                  <th className="table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="table-row">
                    <td className="table-cell font-mono text-sm">{appointment.id}</td>
                    <td className="table-cell font-medium">{appointment.client}</td>
                    <td className="table-cell">{appointment.service}</td>
                    <td className="table-cell">{appointment.unit}</td>
                    <td className="table-cell">{appointment.barber}</td>
                    <td className="table-cell">{appointment.time}</td>
                    <td className="table-cell">{getStatusBadge(appointment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

import { Link } from "react-router-dom";
import { Scissors, ArrowRight, Layout, Users, Shield, Palette } from "lucide-react";

const Index = () => {
  const pages = [
    { 
      category: "Cliente",
      items: [
        { name: "Landing Page", path: "/landing", desc: "Página inicial com call to action" },
        { name: "Seleção de Unidade", path: "/unidades", desc: "Lista de unidades disponíveis" },
        { name: "Seleção de Serviço", path: "/servicos", desc: "Catálogo de serviços" },
        { name: "Agendamento", path: "/agendar", desc: "Calendário e horários" },
        { name: "Confirmação", path: "/confirmar", desc: "Resumo do agendamento" },
        { name: "Sucesso", path: "/sucesso", desc: "Confirmação de agendamento" },
        { name: "Minha Agenda", path: "/minha-agenda", desc: "Lista de agendamentos do cliente" },
      ]
    },
    {
      category: "Staff (Barbeiro)",
      items: [
        { name: "Login Staff", path: "/staff/login", desc: "Tela de login do barbeiro" },
        { name: "Dashboard Staff", path: "/staff/dashboard", desc: "Agenda do dia do barbeiro" },
      ]
    },
    {
      category: "Admin",
      items: [
        { name: "Login Admin", path: "/admin/login", desc: "Tela de login do administrador" },
        { name: "Dashboard Admin", path: "/admin/dashboard", desc: "Painel administrativo completo" },
      ]
    },
    {
      category: "Design System",
      items: [
        { name: "Componentes", path: "/componentes", desc: "Showcase de todos os componentes" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="content-container py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <Scissors className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">BarberPro</h1>
              <p className="text-sm text-muted-foreground">Sistema de Agendamento</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-secondary">
        <div className="content-container text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Protótipo de Interface
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Design completo de todas as telas do sistema de agendamento de barbearia.
            Layout responsivo, moderno e minimalista.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <Layout className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">11 Telas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <Palette className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Design System</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">3 Perfis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Responsivo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pages List */}
      <main className="content-container py-12">
        <div className="space-y-12">
          {pages.map((section) => (
            <div key={section.category}>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {section.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="card-interactive p-5 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {page.name}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground">{page.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="content-container text-center">
          <p className="text-sm text-muted-foreground">
            Protótipo de interface • Apenas HTML + CSS (via Tailwind)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Home, Calendar, Users, Settings, LogOut, Scissors, BarChart3, Building2 } from "lucide-react";

interface SidebarProps {
  type: "staff" | "admin";
  activePage?: string;
}

const Sidebar = ({ type, activePage = "home" }: SidebarProps) => {
  const staffLinks = [
    { id: "home", label: "Início", icon: Home },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const adminLinks = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "agenda", label: "Agendamentos", icon: Calendar },
    { id: "staff", label: "Equipe", icon: Users },
    { id: "units", label: "Unidades", icon: Building2 },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const links = type === "admin" ? adminLinks : staffLinks;

  return (
    <aside className="sidebar-base">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
            <Scissors className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-semibold text-sidebar-foreground">BarberPro</span>
            <span className="block text-xs text-muted-foreground">
              {type === "admin" ? "Admin" : "Staff"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <li key={link.id}>
                <a
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">JD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">João Barbeiro</p>
            <p className="text-xs text-muted-foreground">joao@email.com</p>
          </div>
        </div>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useState } from "react";
import { Input } from "./login/components/Input";
import { Button } from "./login/components/Button";
import { UserRole } from "./login/types";
import { env } from "@/config/env";

type ClientLoginForm = {
  name: string;
  phone: string;
};

type StaffLoginForm = {
  email: string;
  password: string;
};

type StaffMode = "barber" | "admin";

type BarberLoginForm = {
  pin: string;
};

type LoginState =
  | { status: "idle"; message?: string }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary-600 mb-4"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const SESSION_KEY = "barber-flow-session";

interface Props {
  onLogin?: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CLIENT);
  const [clientForm, setClientForm] = useState<ClientLoginForm>({ name: "", phone: "" });
  const [staffForm, setStaffForm] = useState<StaffLoginForm>({ email: "", password: "" });
  const [barberForm, setBarberForm] = useState<BarberLoginForm>({ pin: "" });
  const [staffMode, setStaffMode] = useState<StaffMode>("barber");
  const [state, setState] = useState<LoginState>({ status: "idle" });

  const saveSession = (payload: Record<string, unknown>) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  };

  const postUser = async (body: Record<string, unknown>) => {
    const res = await fetch(`${env.VITE_API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Falha ao comunicar com o servidor");
    }
    return res.json();
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.phone) {
      setState({ status: "error", message: "Preencha nome e telefone" });
      return;
    }
    try {
      setState({ status: "loading" });
      const user = await postUser({ fullName: clientForm.name, phone: clientForm.phone });
      saveSession({ role: "client", user });
      setState({ status: "success", message: "Cliente autenticado e salvo" });
      onLogin?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      setState({ status: "error", message });
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (staffMode === "barber") {
      if (!barberForm.pin) {
        setState({ status: "error", message: "Informe o PIN do barbeiro" });
        return;
      }
      try {
        setState({ status: "loading" });
        const res = await fetch(`${env.VITE_API_BASE}/auth/barber-pin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: barberForm.pin }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "PIN inválido");
        }
        const data = await res.json();
        saveSession({ role: "staff", barber: data.barber });
        setState({ status: "success", message: `Bem-vindo, ${data.barber.name}` });
        onLogin?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro inesperado";
        setState({ status: "error", message });
      }
      return;
    }

    if (!staffForm.email || !staffForm.password) {
      setState({ status: "error", message: "Informe email e senha" });
      return;
    }
    try {
      setState({ status: "loading" });
      const nameFromEmail = staffForm.email.split("@")[0] || "Admin";
      const user = await postUser({ fullName: nameFromEmail, email: staffForm.email });
      saveSession({ role: "admin", user });
      setState({ status: "success", message: "Admin autenticado (simulado) e salvo" });
      onLogin?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      setState({ status: "error", message });
    }
  };

  const isLoading = state.status === "loading";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans hero-gradient relative p-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200 rounded-full blur-3xl mix-blend-multiply filter" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl mix-blend-multiply filter" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header centered above card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/50 backdrop-blur-sm shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Sistema de Agendamento</span>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex p-1 mb-6 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl w-full shadow-sm">
          <button
            onClick={() => setActiveRole(UserRole.CLIENT)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeRole === UserRole.CLIENT
                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <UserIcon />
            Cliente
          </button>
          <button
            onClick={() => setActiveRole(UserRole.STAFF)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeRole === UserRole.STAFF
                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <LockIcon />
            Staff / Admin
          </button>
        </div>

        {/* Login Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600 mx-auto">
              <CalendarIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeRole === UserRole.CLIENT ? "Bem-vindo de volta" : "Acesso Restrito"}
            </h2>
            <p className="text-slate-500 mt-1">
              {activeRole === UserRole.CLIENT ? "Informe seus dados para acessar." : "Insira suas credenciais corporativas."}
            </p>
          </div>

          {/* Status messages */}
          {state.status === "error" && <p className="mb-4 text-sm text-red-600 text-center">{state.message}</p>}
          {state.status === "success" && <p className="mb-4 text-sm text-green-600 text-center">{state.message}</p>}

          {/* Login Cliente */}
          {activeRole === UserRole.CLIENT && (
            <form onSubmit={handleClientLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Input
                label="Nome completo"
                id="client-name"
                type="text"
                placeholder="Ex: João da Silva"
                value={clientForm.name}
                onChange={(e) => setClientForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />

              <Input
                label="Telefone"
                id="client-phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={clientForm.phone}
                onChange={(e) => setClientForm((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />

              <div className="pt-2">
                <Button type="submit" data-action="login-client" fullWidth variant="primary" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>

              <p className="text-xs text-center text-slate-400 mt-4">Ao entrar, você concorda com nossos Termos de Uso.</p>
            </form>
          )}

          {/* Login Staff/Admin */}
          {activeRole === UserRole.STAFF && (
            <form onSubmit={handleStaffLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex p-1 bg-slate-100 rounded-lg gap-1">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-md ${
                    staffMode === "barber" ? "bg-white shadow text-slate-900" : "text-slate-500"
                  }`}
                  onClick={() => setStaffMode("barber")}
                >
                  Barbeiro (PIN)
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-md ${
                    staffMode === "admin" ? "bg-white shadow text-slate-900" : "text-slate-500"
                  }`}
                  onClick={() => setStaffMode("admin")}
                >
                  Admin
                </button>
              </div>

              {staffMode === "barber" ? (
                <Input
                  label="PIN do Barbeiro"
                  id="barber-pin"
                  type="text"
                  placeholder="6 dígitos"
                  value={barberForm.pin}
                  onChange={(e) => setBarberForm({ pin: e.target.value })}
                  required
                />
              ) : (
                <>
                  <Input
                    label="Email corporativo"
                    id="staff-email"
                    type="email"
                    placeholder="nome@empresa.com"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />

                  <Input
                    label="Senha"
                    id="staff-password"
                    type="password"
                    placeholder="••••••••"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <Button type="submit" data-action={staffMode === "barber" ? "login-barber" : "login-admin"} fullWidth variant="primary" disabled={isLoading}>
                  {isLoading ? "Entrando..." : staffMode === "barber" ? "Entrar como Barbeiro" : "Entrar Admin"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Precisa de ajuda?{" "}
            <a href="#" className="text-primary-600 hover:underline font-medium">
              Fale com o suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

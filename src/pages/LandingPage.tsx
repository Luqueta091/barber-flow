import Header from "@/components/barbershop/Header";
import Footer from "@/components/barbershop/Footer";
import { Scissors, Clock, MapPin, Calendar, Star, Users, ChevronRight } from "lucide-react";

const LandingPage = () => {
  const services = [
    { name: "Corte Clássico", duration: "30 min", price: "R$ 45" },
    { name: "Barba Completa", duration: "25 min", price: "R$ 35" },
    { name: "Corte + Barba", duration: "50 min", price: "R$ 70" },
    { name: "Pigmentação", duration: "40 min", price: "R$ 60" },
  ];

  const features = [
    { icon: Calendar, title: "Agendamento Online", desc: "Reserve seu horário 24h por dia, de qualquer lugar." },
    { icon: Clock, title: "Sem Espera", desc: "Chegue na hora marcada e seja atendido imediatamente." },
    { icon: Star, title: "Profissionais Top", desc: "Barbeiros certificados e altamente qualificados." },
  ];

  return (
    <div className="page-container">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-primary/20" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="content-container relative">
          <div className="py-24 md:py-32 lg:py-40">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 animate-fade-in">
                <Scissors className="w-4 h-4" />
                Barbearia Premium
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 animate-slide-up">
                Estilo e precisão em cada corte
              </h1>
              
              <p className="text-lg md:text-xl text-background/70 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Agende online em segundos. Escolha sua unidade, serviço e horário preferido. Sem ligações, sem espera.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <a href="/unidades" className="btn-primary text-base py-4 px-8">
                  Agendar agora
                  <ChevronRight className="w-5 h-5 ml-2" />
                </a>
                <a href="#servicos" className="btn-secondary bg-background/10 text-background border-background/20 hover:bg-background/20">
                  Ver serviços
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-background/10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div>
                  <p className="text-3xl font-bold text-background">10K+</p>
                  <p className="text-sm text-background/60">Clientes atendidos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-background">4.9</p>
                  <p className="text-sm text-background/60">Avaliação média</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-background">5</p>
                  <p className="text-sm text-background/60">Unidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-8">
                  <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="py-20">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl">Nossos Serviços</h2>
            <p className="section-subtitle">Escolha o serviço ideal para você</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card-interactive p-6 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Scissors className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{service.price}</span>
                  <button className="text-sm font-medium text-primary hover:underline">
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-foreground">
        <div className="content-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-6">
              Pronto para um novo visual?
            </h2>
            <p className="text-lg text-background/70 mb-8">
              Agende agora e garanta seu horário na melhor barbearia da cidade.
            </p>
            <a href="/unidades" className="btn-primary text-base py-4 px-8 inline-flex">
              Agendar meu horário
              <ChevronRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

import Header from "@/components/barbershop/Header";
import Footer from "@/components/barbershop/Footer";
import { Clock, ChevronRight, Check, Scissors } from "lucide-react";

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      name: "Corte Clássico",
      description: "Corte tradicional com acabamento preciso, lavagem e finalização.",
      duration: "30 min",
      price: "R$ 45,00",
      popular: false,
    },
    {
      id: 2,
      name: "Corte Degradê",
      description: "Degradê moderno com transição suave, lavagem e finalização profissional.",
      duration: "40 min",
      price: "R$ 55,00",
      popular: true,
    },
    {
      id: 3,
      name: "Barba Completa",
      description: "Modelagem completa da barba com navalha, toalha quente e hidratação.",
      duration: "25 min",
      price: "R$ 35,00",
      popular: false,
    },
    {
      id: 4,
      name: "Corte + Barba",
      description: "Combo completo: corte de cabelo + barba com todos os acabamentos.",
      duration: "50 min",
      price: "R$ 70,00",
      popular: true,
    },
    {
      id: 5,
      name: "Pigmentação",
      description: "Aplicação de pigmento para cobertura de falhas ou cabelos brancos.",
      duration: "40 min",
      price: "R$ 60,00",
      popular: false,
    },
    {
      id: 6,
      name: "Hidratação Capilar",
      description: "Tratamento de hidratação profunda para cabelos e barba.",
      duration: "30 min",
      price: "R$ 40,00",
      popular: false,
    },
  ];

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
            <span className="text-foreground font-medium">Serviços</span>
          </nav>
        </div>
      </div>

      {/* Selected Unit Info */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="content-container py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unidade selecionada</p>
              <p className="font-medium text-foreground">BarberPro Centro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="content-container py-12">
        <div className="mb-10">
          <h1 className="section-title text-3xl">Escolha um serviço</h1>
          <p className="section-subtitle">Selecione o serviço desejado para continuar</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="card-interactive p-6 relative group">
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4">
                  <span className="badge bg-primary/10 text-primary">Popular</span>
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <Scissors className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
                <span className="text-xl font-bold text-primary">{service.price}</span>
              </div>

              {/* Button */}
              <a href="/agendar" className="btn-outline w-full justify-center text-sm group-hover:border-primary group-hover:text-primary">
                Selecionar serviço
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;

import Header from "@/components/barbershop/Header";
import Footer from "@/components/barbershop/Footer";
import { MapPin, Clock, ChevronRight, Star } from "lucide-react";

const UnitsPage = () => {
  const units = [
    {
      id: 1,
      name: "BarberPro Centro",
      address: "Av. Paulista, 1000 - Centro, São Paulo",
      hours: "Seg a Sáb: 09:00 - 20:00",
      rating: 4.9,
      reviews: 245,
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "BarberPro Jardins",
      address: "Rua Oscar Freire, 500 - Jardins, São Paulo",
      hours: "Seg a Sáb: 10:00 - 21:00",
      rating: 4.8,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "BarberPro Pinheiros",
      address: "Rua dos Pinheiros, 800 - Pinheiros, São Paulo",
      hours: "Seg a Sáb: 09:00 - 19:00",
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "BarberPro Moema",
      address: "Av. Ibirapuera, 2000 - Moema, São Paulo",
      hours: "Seg a Dom: 08:00 - 20:00",
      rating: 4.9,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop"
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
            <span className="text-foreground font-medium">Unidades</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="content-container py-12">
        <div className="mb-10">
          <h1 className="section-title text-3xl">Escolha uma unidade</h1>
          <p className="section-subtitle">Selecione a barbearia mais próxima de você</p>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => (
            <div key={unit.id} className="card-interactive overflow-hidden group">
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={unit.image}
                  alt={unit.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground">{unit.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-sm font-medium text-foreground">{unit.rating}</span>
                    <span className="text-sm text-muted-foreground">({unit.reviews})</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{unit.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{unit.hours}</span>
                  </div>
                </div>

                <a
                  href="/servicos"
                  className="btn-primary w-full justify-center text-sm"
                >
                  Selecionar unidade
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnitsPage;

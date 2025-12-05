import { Scissors, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">BarberPro</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Sistema profissional de agendamento para barbearias modernas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Início</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Serviços</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Unidades</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Agendar</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Contato</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8">
          <p className="text-sm text-background/40 text-center">
            © 2024 BarberPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

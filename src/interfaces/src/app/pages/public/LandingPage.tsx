import { Link } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  FileText,
  TrendingUp,
  Shield,
  Bell,
  CreditCard,
  BarChart3,
  CheckCircle,
  FileCheck,
  IdCard,
  GraduationCap,
  Award,
  BookOpen,
  Users,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const benefits = [
    {
      icon: FileText,
      title: "Consulta de requisitos",
      description: "Accede a toda la información actualizada de procedimientos y servicios del TUPA",
    },
    {
      icon: TrendingUp,
      title: "Seguimiento en línea",
      description: "Rastrea el estado de tus solicitudes en tiempo real desde cualquier dispositivo",
    },
    {
      icon: Shield,
      title: "Validación de documentos",
      description: "Sistema seguro de validación digital con firma electrónica y trazabilidad",
    },
    {
      icon: Bell,
      title: "Notificaciones",
      description: "Recibe alertas automáticas sobre cambios en el estado de tus trámites",
    },
    {
      icon: CreditCard,
      title: "Pagos y recibos",
      description: "Gestiona tus pagos de forma electrónica con comprobantes digitales",
    },
    {
      icon: BarChart3,
      title: "Reportes administrativos",
      description: "Estadísticas y análisis para oficinas administrativas y gestión institucional",
    },
  ];

  const frequentProcedures = [
    "Certificado de Estudios",
    "Constancia de Estudios",
    "Carné Universitario",
    "Bachiller",
    "Título Profesional",
    "Traslado Interno",
    "Convalidación de Asignaturas",
    "Acceso a Información Pública",
  ];

  const steps = [
    {
      number: "1",
      title: "Consulta el catálogo TUPA",
      description: "Revisa los procedimientos disponibles, requisitos y costos actualizados",
    },
    {
      number: "2",
      title: "Inicia sesión con tu correo UNSAAC",
      description: "Accede con tus credenciales institucionales o crea tu cuenta",
    },
    {
      number: "3",
      title: "Adjunta tus documentos",
      description: "Sube los requisitos en formato digital de forma segura",
    },
    {
      number: "4",
      title: "Haz seguimiento en línea",
      description: "Recibe notificaciones y consulta el progreso de tu trámite",
    },
  ];

  const searchResults = [
    { code: "PA-001", name: "Certificado de estudios", office: "Secretaría General" },
    { code: "PA-002", name: "Constancia de estudios", office: "Registros Académicos" },
    { code: "PA-003", name: "Carné universitario", office: "Bienestar Universitario" },
    { code: "PA-004", name: "Grado de Bachiller", office: "Grados y Títulos" },
    { code: "PA-005", name: "Título profesional", office: "Grados y Títulos" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR FIJO */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--unsaac-red)] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">UNSAAC</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[var(--unsaac-red)] text-lg">Sistema TUPA</span>
              <span className="text-gray-600 text-sm">UNSAAC</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/catalogue" className="text-gray-700 hover:text-[var(--unsaac-red)] transition-colors">
              Catálogo TUPA
            </Link>
            <Link to="/catalogue" className="text-gray-700 hover:text-[var(--unsaac-red)] transition-colors">
              Consultar Estado
            </Link>
            <Link to="/catalogue" className="text-gray-700 hover:text-[var(--unsaac-red)] transition-colors">
              Requisitos
            </Link>
            <a href="#contacto" className="text-gray-700 hover:text-[var(--unsaac-red)] transition-colors">
              Contacto
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-[var(--unsaac-red)] text-[var(--unsaac-red)] hover:bg-[var(--unsaac-red)] hover:text-white">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)] text-white">
              <Link to="/catalogue">Consultar Trámites</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[var(--unsaac-red)] text-white pt-32 pb-16 mt-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Gestiona tus trámites TUPA de manera rápida, segura y transparente
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Plataforma digital oficial de la UNSAAC para trámites administrativos del TUPA
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-[var(--unsaac-gold)] text-[var(--unsaac-gray-dark)] hover:bg-[var(--unsaac-gold-dark)] h-12 px-8">
                <Link to="/catalogue">Consultar Catálogo TUPA</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-[var(--unsaac-red)] hover:bg-gray-50 border-white h-12 px-8">
                <Link to="/register">Registrar Solicitud</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
                <Link to="/catalogue">Ver Estado de Trámite</Link>
              </Button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">1,240+</div>
                <div className="text-white/80 text-sm">trámites gestionados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-white/80 text-sm">satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">72h</div>
                <div className="text-white/80 text-sm">plazo promedio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BARRA DE BÚSQUEDA PÚBLICA */}
      <section className="bg-white py-10 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3 mb-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Busca tu trámite por nombre, código o palabra clave..."
                  className="pl-12 h-14 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)] h-14 px-8">
                Buscar
              </Button>
            </form>
            <p className="text-sm text-gray-500 text-center">
              Búsqueda pública — no requiere iniciar sesión
            </p>

            {/* Resultados de búsqueda */}
            {showResults && searchQuery && (
              <Card className="mt-4 shadow-lg">
                <CardContent className="p-4">
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result) => (
                        <Link
                          key={result.code}
                          to={`/procedure/${result.code}`}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{result.code}</Badge>
                            <span className="font-medium">{result.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{result.office}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No se encontraron resultados</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {frequentProcedures.slice(0, 4).map((proc) => (
                          <Badge key={proc} variant="outline" className="cursor-pointer hover:bg-gray-100">
                            {proc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* 6 TARJETAS BENEFICIOS */}
      <section className="bg-[var(--unsaac-gray-light)] py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-[var(--unsaac-red)]">
            Beneficios de la plataforma
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Accede a un sistema moderno y eficiente para gestionar tus trámites administrativos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[var(--unsaac-red)]/10 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-[var(--unsaac-red)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[var(--unsaac-gray-dark)]">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRÁMITES FRECUENTES */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-[var(--unsaac-red)]">
            Trámites más frecuentes
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Accede rápidamente a los procedimientos más solicitados
          </p>

          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {frequentProcedures.map((procedure) => (
              <Link
                key={procedure}
                to="/catalogue"
                className="px-6 py-3 rounded-full border-2 border-[var(--unsaac-red)] text-[var(--unsaac-red)] hover:bg-[var(--unsaac-red)] hover:text-white transition-all font-medium"
              >
                {procedure}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ¿CÓMO FUNCIONA? */}
      <section className="bg-[var(--unsaac-gray-light)] py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-[var(--unsaac-red)]">
            ¿Cómo funciona?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Sigue estos sencillos pasos para gestionar tus trámites de forma digital
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step) => (
              <div key={step.number} className="text-center relative">
                <div className="w-20 h-20 bg-[var(--unsaac-red)] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-4xl font-bold text-white">{step.number}</span>
                </div>
                {step.number !== "4" && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gray-300 -z-0"></div>
                )}
                <h3 className="text-lg font-semibold mb-3 text-[var(--unsaac-gray-dark)]">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
              <Link to="/register">
                Comenzar ahora
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="bg-[var(--unsaac-gray-dark)] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">UNSAAC</span>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Sistema de Trámite Documentario UNSAAC
              </p>
            </div>

            {/* Plataforma */}
            <div>
              <h4 className="font-semibold mb-4 text-[var(--unsaac-gold)]">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/catalogue" className="text-white/80 hover:text-white transition-colors">
                    Catálogo TUPA
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-white/80 hover:text-white transition-colors">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white/80 hover:text-white transition-colors">
                    Crear cuenta
                  </Link>
                </li>
                <li>
                  <Link to="/catalogue" className="text-white/80 hover:text-white transition-colors">
                    Mesa de partes virtual
                  </Link>
                </li>
              </ul>
            </div>

            {/* Institución */}
            <div>
              <h4 className="font-semibold mb-4 text-[var(--unsaac-gold)]">Institución</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.unsaac.edu.pe" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
                    Portal UNSAAC
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Transparencia
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Normativa
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Directorio
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-semibold mb-4 text-[var(--unsaac-gold)]">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">Av. de la Cultura 733, Cusco, Perú</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-white/80">+51 84 222271</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-white/80">mesadepartes@unsaac.edu.pe</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2026 Universidad Nacional de San Antonio Abad del Cusco. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

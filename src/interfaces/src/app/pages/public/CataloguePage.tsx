import { Link } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, Filter, FileText, Clock, DollarSign, MapPin } from "lucide-react";

const procedures = [
  {
    id: 1,
    code: "PA-001",
    name: "Certificado de estudios",
    description: "Documento que acredita los estudios realizados en la universidad",
    cost: "S/. 50.00",
    duration: "5 días hábiles",
    type: "Procedimiento",
    modality: "Presencial / Virtual",
    office: "Secretaría General",
    free: false,
  },
  {
    id: 2,
    code: "PA-002",
    name: "Constancia de estudios",
    description: "Documento que certifica la condición de estudiante activo",
    cost: "Gratuito",
    duration: "3 días hábiles",
    type: "Servicio",
    modality: "Virtual",
    office: "Oficina de Registros Académicos",
    free: true,
  },
  {
    id: 3,
    code: "PA-003",
    name: "Carné universitario",
    description: "Documento de identificación para estudiantes",
    cost: "S/. 25.00",
    duration: "7 días hábiles",
    type: "Servicio",
    modality: "Presencial",
    office: "Bienestar Universitario",
    free: false,
  },
  {
    id: 4,
    code: "PA-004",
    name: "Grado de Bachiller",
    description: "Trámite para obtención del grado académico de bachiller",
    cost: "S/. 350.00",
    duration: "30 días hábiles",
    type: "Procedimiento",
    modality: "Presencial / Virtual",
    office: "Grados y Títulos",
    free: false,
  },
  {
    id: 5,
    code: "PA-005",
    name: "Título profesional",
    description: "Trámite para obtención del título profesional",
    cost: "S/. 450.00",
    duration: "45 días hábiles",
    type: "Procedimiento",
    modality: "Presencial",
    office: "Grados y Títulos",
    free: false,
  },
  {
    id: 6,
    code: "PA-006",
    name: "Traslado interno",
    description: "Cambio de programa de estudios dentro de la UNSAAC",
    cost: "S/. 120.00",
    duration: "20 días hábiles",
    type: "Procedimiento",
    modality: "Presencial",
    office: "Secretaría General",
    free: false,
  },
  {
    id: 7,
    code: "PA-007",
    name: "Convalidación de asignaturas",
    description: "Reconocimiento de asignaturas cursadas en otra institución",
    cost: "S/. 80.00",
    duration: "15 días hábiles",
    type: "Procedimiento",
    modality: "Presencial",
    office: "Facultad correspondiente",
    free: false,
  },
  {
    id: 8,
    code: "PA-008",
    name: "Constancia de no adeudar",
    description: "Certificación de no tener deudas pendientes con la universidad",
    cost: "Gratuito",
    duration: "2 días hábiles",
    type: "Servicio",
    modality: "Virtual",
    office: "Tesorería",
    free: true,
  },
];

export function CataloguePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCost, setFilterCost] = useState("all");

  const filteredProcedures = procedures.filter((proc) => {
    const matchesSearch = proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || proc.type === filterType;
    const matchesCost = filterCost === "all" || (filterCost === "free" ? proc.free : !proc.free);
    return matchesSearch && matchesType && matchesCost;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[var(--unsaac-red)] text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">UNSAAC</span>
              </div>
              <div>
                <h1 className="font-semibold">Catálogo TUPA</h1>
                <p className="text-xs text-white/80">Universidad Nacional de San Antonio Abad del Cusco</p>
              </div>
            </Link>
            <Button asChild className="bg-[var(--unsaac-gold)] text-[var(--unsaac-gray-dark)] hover:bg-[var(--unsaac-gold-dark)]">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-[var(--unsaac-red)]">Catálogo de Procedimientos TUPA</h1>
          <p className="text-muted-foreground">
            Consulte todos los procedimientos administrativos y servicios disponibles
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, código, oficina o palabra clave"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Procedimiento">Procedimientos</SelectItem>
                  <SelectItem value="Servicio">Servicios</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCost} onValueChange={setFilterCost}>
                <SelectTrigger>
                  <SelectValue placeholder="Costo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los costos</SelectItem>
                  <SelectItem value="free">Gratuitos</SelectItem>
                  <SelectItem value="paid">Con pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Mostrando {filteredProcedures.length} de {procedures.length} trámites
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcedures.map((proc) => (
            <Card key={proc.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-[var(--unsaac-red)]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-xs">{proc.code}</Badge>
                  {proc.free ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Gratuito</Badge>
                  ) : (
                    <Badge className="bg-[var(--unsaac-gold)] text-[var(--unsaac-gray-dark)] hover:bg-[var(--unsaac-gold)]">
                      {proc.cost}
                    </Badge>
                  )}
                </div>
                <h3 className="mb-2 text-[var(--unsaac-gray-dark)]">{proc.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{proc.description}</p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{proc.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{proc.office}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{proc.modality}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1 bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                    <Link to={`/procedure/${proc.id}`}>Ver detalle</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to="/login">Solicitar</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProcedures.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2 text-muted-foreground">No se encontraron resultados</h3>
            <p className="text-sm text-muted-foreground">Intente ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  FileText,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Bookmark,
  Building2,
  Calendar,
  FileCheck,
} from "lucide-react";

export function ProcedureDetailPage() {
  const { id } = useParams();

  const procedure = {
    code: "PA-004",
    name: "Grado de Bachiller",
    status: "Disponible",
    description: "Trámite para la obtención del grado académico de bachiller. Este grado se obtiene al haber aprobado los estudios de pregrado, así como la aprobación de un trabajo de investigación y el conocimiento de un idioma extranjero o lengua nativa.",
    cost: "S/. 350.00",
    paymentMethod: "Pago en ventanilla del Banco de la Nación o pago virtual",
    duration: "30 días hábiles",
    qualification: "Aprobación automática",
    modality: "Presencial / Virtual",
    presentationUnit: "Facultad correspondiente - Unidad de Grados y Títulos",
    responsibleOffice: "Secretaría General - Unidad de Grados y Títulos",
    requirements: [
      "Solicitud dirigida al Decano de la Facultad",
      "Constancia de no adeudar a la universidad",
      "Certificado de estudios completo",
      "Constancia de aprobación de trabajo de bachiller",
      "Constancia de suficiencia en idioma extranjero o lengua nativa",
      "Copia del DNI vigente",
      "Recibo de pago por derecho de trámite",
      "Cuatro fotografías tamaño pasaporte a color con fondo blanco",
    ],
    notes: [
      "El certificado de estudios debe ser emitido por la Dirección de Admisión, Registro y Certificaciones (DARC)",
      "La constancia de suficiencia en idioma puede ser emitida por el Centro de Idiomas de la UNSAAC u otra institución reconocida",
      "Las fotografías deben ser recientes (no mayor a 3 meses)",
    ],
    channels: ["Mesa de Partes presencial", "Mesa de Partes virtual"],
    locations: [
      {
        name: "Ciudad Universitaria",
        address: "Av. de la Cultura 733, Cusco",
        hours: "Lunes a Viernes: 8:00 AM - 4:00 PM",
      },
    ],
    legalBasis: [
      "Ley Universitaria N° 30220",
      "Estatuto de la UNSAAC",
      "Reglamento de Grados y Títulos de la UNSAAC",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[var(--unsaac-red)] text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/catalogue" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">UNSAAC</span>
              </div>
              <div>
                <h1 className="font-semibold">Catálogo TUPA</h1>
                <p className="text-xs text-white/80 hidden sm:block">Universidad Nacional de San Antonio Abad del Cusco</p>
              </div>
            </Link>
            <Button asChild className="bg-[var(--unsaac-gold)] text-[var(--unsaac-gray-dark)] hover:bg-[var(--unsaac-gold-dark)]">
              <Link to="/login">Iniciar solicitud</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{procedure.code}</Badge>
                  <Badge className="bg-green-100 text-green-800">{procedure.status}</Badge>
                </div>
                <CardTitle className="text-[var(--unsaac-red)]">{procedure.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{procedure.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--unsaac-red)]">
                  <CheckCircle2 className="h-5 w-5" />
                  Requisitos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {procedure.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--unsaac-red)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-[var(--unsaac-red)] font-medium">{index + 1}</span>
                      </div>
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--unsaac-gold-dark)]">
                  <AlertCircle className="h-5 w-5" />
                  Notas importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {procedure.notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-[var(--unsaac-gold)] mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--unsaac-red)]">
                  <MapPin className="h-5 w-5" />
                  Sedes y horarios de atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                {procedure.locations.map((loc, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="font-medium">{loc.name}</h4>
                    <p className="text-sm text-muted-foreground">{loc.address}</p>
                    <p className="text-sm text-muted-foreground">{loc.hours}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Legal Basis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--unsaac-red)]">
                  <FileCheck className="h-5 w-5" />
                  Base legal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {procedure.legalBasis.map((basis, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {basis}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-[var(--unsaac-red)]">Información rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-[var(--unsaac-red)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Costo</p>
                      <p className="text-sm text-muted-foreground">{procedure.cost}</p>
                      <p className="text-xs text-muted-foreground mt-1">{procedure.paymentMethod}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[var(--unsaac-red)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Plazo de atención</p>
                      <p className="text-sm text-muted-foreground">{procedure.duration}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-[var(--unsaac-red)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Modalidad</p>
                      <p className="text-sm text-muted-foreground">{procedure.modality}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-[var(--unsaac-red)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Oficina responsable</p>
                      <p className="text-sm text-muted-foreground">{procedure.responsibleOffice}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button asChild className="w-full bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                    <Link to="/login">Iniciar solicitud</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar requisitos PDF
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

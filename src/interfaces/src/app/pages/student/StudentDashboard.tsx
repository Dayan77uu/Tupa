import { Link } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  FileX,
} from "lucide-react";

export function StudentDashboard() {
  // Métricas resumen
  const metrics = [
    { label: "Total", value: "5", color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
    { label: "En Revisión", value: "2", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { label: "Observados", value: "1", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { label: "Aprobados", value: "2", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  ];

  // Estados de trámites
  const procedures = [
    {
      id: 1,
      status: "Pendiente",
      name: "Certificado de Estudios",
      code: "EXP-2024-001",
      dateSubmitted: "15/05/2024",
      progress: 30,
      type: "pending"
    },
    {
      id: 2,
      status: "En Revisión",
      name: "Constancia de Estudios",
      code: "EXP-2024-002",
      dateSubmitted: "20/05/2024",
      daysRemaining: "2 días hábiles restantes",
      progress: 60,
      type: "review"
    },
    {
      id: 3,
      status: "Observado",
      name: "Carné Universitario",
      code: "EXP-2024-003",
      dateSubmitted: "10/05/2024",
      observation: "El DNI adjunto está vencido. Por favor, sube un documento de identidad vigente.",
      type: "observed"
    },
    {
      id: 4,
      status: "Aprobado",
      name: "Constancia de No Adeudar",
      code: "EXP-2024-004",
      dateApproved: "22/05/2024",
      type: "approved"
    },
    {
      id: 5,
      status: "Rechazado",
      name: "Traslado Interno",
      code: "EXP-2024-005",
      dateRejected: "18/05/2024",
      reason: "No cumple con los requisitos mínimos de promedio ponderado",
      type: "rejected"
    },
  ];

  const hasProcedures = procedures.length > 0;

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div>
        <h1 className="text-[28px] font-semibold text-[var(--unsaac-text-primary)] mb-1">
          Bienvenido, Carlos Quispe Mamani
        </h1>
        <p className="text-[var(--unsaac-text-secondary)]">
          Gestiona tus trámites administrativos de forma rápida y segura
        </p>
      </div>

      {hasProcedures ? (
        <>
          {/* 4 MÉTRICAS RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className={`border ${metric.borderColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-1">
                        {metric.label}
                      </p>
                      <p className={`text-3xl font-bold ${metric.color}`}>
                        {metric.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                      <FileText className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* GRID 3 COLUMNAS - 5 TARJETAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {procedures.map((proc) => {
              // ESTADO PENDIENTE
              if (proc.type === "pending") {
                return (
                  <Card key={proc.id} className="border-t-[3px] border-t-[var(--status-pending-border)]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="badge-pending rounded-full px-3 py-1 text-xs font-medium">
                          {proc.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-2">
                        {proc.name}
                      </h3>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-1">
                        Código: {proc.code}
                      </p>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-4">
                        Ingresado: {proc.dateSubmitted}
                      </p>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--unsaac-text-secondary)]">Progreso</span>
                          <span className="text-xs font-medium text-gray-600">{proc.progress}%</span>
                        </div>
                        <Progress value={proc.progress} className="h-2 bg-gray-200" />
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/dashboard/student/tracking/${proc.code}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              }

              // ESTADO EN REVISIÓN
              if (proc.type === "review") {
                return (
                  <Card key={proc.id} className="border-t-[3px] border-t-[var(--status-review-border)]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="badge-review rounded-full px-3 py-1 text-xs font-medium">
                          {proc.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-2">
                        {proc.name}
                      </h3>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-1">
                        Código: {proc.code}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          {proc.daysRemaining}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--unsaac-text-secondary)]">Progreso</span>
                          <span className="text-xs font-medium text-blue-600">{proc.progress}%</span>
                        </div>
                        <Progress value={proc.progress} className="h-2 bg-blue-100" />
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/dashboard/student/tracking/${proc.code}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              }

              // ESTADO OBSERVADO (MÁS DESTACADO)
              if (proc.type === "observed") {
                return (
                  <Card
                    key={proc.id}
                    className="border-2 border-[#F59E0B] bg-[#FFFBEB]"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                          <Badge className="badge-observed rounded-full px-3 py-1 text-xs font-medium">
                            {proc.status}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-2">
                        {proc.name}
                      </h3>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-4">
                        Código: {proc.code}
                      </p>

                      {/* Caja de observación */}
                      <div className="mb-4 p-4 bg-orange-50 border-l-[3px] border-l-[#F59E0B] rounded">
                        <p className="text-sm text-[#92400E] font-medium mb-1">
                          Observación:
                        </p>
                        <p className="text-sm text-[#92400E]">
                          {proc.observation}
                        </p>
                      </div>

                      {/* Botón naranja ancho completo */}
                      <Button
                        className="w-full mb-2 bg-[#F59E0B] hover:bg-[#D97706] text-white"
                        asChild
                      >
                        <Link to={`/dashboard/student/procedures?action=fix&id=${proc.code}`}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Subsanar ahora
                        </Link>
                      </Button>

                      {/* Botón outline pequeño */}
                      <Button variant="outline" className="w-full" size="sm" asChild>
                        <Link to={`/dashboard/student/tracking/${proc.code}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              }

              // ESTADO APROBADO
              if (proc.type === "approved") {
                return (
                  <Card key={proc.id} className="border-t-[3px] border-t-[var(--status-approved-border)]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="badge-approved rounded-full px-3 py-1 text-xs font-medium">
                          {proc.status}
                        </Badge>
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-2">
                        {proc.name}
                      </h3>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-1">
                        Código: {proc.code}
                      </p>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-4">
                        Aprobado: {proc.dateApproved}
                      </p>
                      <Button
                        className="w-full mb-2 bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar resultado
                      </Button>
                      <Button variant="outline" className="w-full" size="sm" asChild>
                        <Link to={`/dashboard/student/tracking/${proc.code}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              }

              // ESTADO RECHAZADO
              if (proc.type === "rejected") {
                return (
                  <Card key={proc.id} className="border-t-[3px] border-t-[var(--status-rejected-border)]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="badge-rejected rounded-full px-3 py-1 text-xs font-medium">
                          {proc.status}
                        </Badge>
                        <XCircle className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-2">
                        {proc.name}
                      </h3>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-1">
                        Código: {proc.code}
                      </p>
                      <p className="text-sm text-[var(--unsaac-text-secondary)] mb-4">
                        Rechazado: {proc.dateRejected}
                      </p>
                      <div className="mb-4 p-3 bg-red-50 border-l-[3px] border-l-red-500 rounded">
                        <p className="text-sm text-red-900 font-medium mb-1">
                          Motivo:
                        </p>
                        <p className="text-sm text-red-800">
                          {proc.reason}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        asChild
                      >
                        <Link to={`/dashboard/student/tracking/${proc.code}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              }

              return null;
            })}
          </div>
        </>
      ) : (
        /* ESTADO VACÍO */
        <Card className="border-none shadow-sm">
          <CardContent className="p-16 text-center">
            <div className="max-w-md mx-auto">
              {/* SVG Ilustración simple */}
              <div className="mb-8">
                <FileX className="h-24 w-24 text-gray-300 mx-auto" strokeWidth={1} />
              </div>

              <h3 className="text-xl font-semibold text-[var(--unsaac-text-primary)] mb-3">
                Aún no tienes trámites registrados
              </h3>
              <p className="text-[var(--unsaac-text-secondary)] mb-8">
                Comienza a gestionar tus procedimientos administrativos de forma digital
              </p>

              <Button
                className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-hover)] text-white"
                size="lg"
                asChild
              >
                <Link to="/dashboard/student/new-request">
                  <FilePlus className="h-5 w-5 mr-2" />
                  Iniciar mi primer trámite
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      {hasProcedures && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--unsaac-text-primary)] mb-1">
                    Tienes observaciones pendientes
                  </h4>
                  <p className="text-sm text-[var(--unsaac-text-secondary)]">
                    Subsana las observaciones lo antes posible para continuar con tus trámites
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--unsaac-text-primary)] mb-1">
                    Documentos listos para descargar
                  </h4>
                  <p className="text-sm text-[var(--unsaac-text-secondary)]">
                    Tienes 2 trámites aprobados listos para descarga
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

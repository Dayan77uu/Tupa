import { useParams } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  ArrowRight,
  Lock,
  Eye,
  XCircle,
  Send,
  Info,
} from "lucide-react";

export function ExpedientDetail() {
  const { id } = useParams();

  // This is the administrative view
  const isAdminView = true;

  // Simulate different status for demo: "observed", "approved", "review"
  const currentStatus = "review";

  const expedient = {
    id: "2026-CERT-00118",
    procedureName: "Certificado de Estudios",
    status: currentStatus === "observed" ? "Observado" : currentStatus === "approved" ? "Aprobado" : "En Revisión",
    startDate: "28/05/2026",
    dueDate: "06/06/2026",
    progressPercent: 75,
    daysRemaining: 2,
    currentOffice: "Oficina de Registro Académico",
    observationText: "El DNI adjunto está vencido. Por favor, sube un documento de identidad vigente con fecha de vigencia posterior al 01/01/2026.",
  };

  const applicantData = {
    fullName: "Carlos Quispe Mamani",
    code: "180421",
    faculty: "FIEIM",
    career: "Ingeniería Informática y de Sistemas",
    email: "carlos.quispe@unsaac.edu.pe",
    phone: "987654321",
  };

  const procedureData = {
    cost: "S/ 25.00",
    deadline: "5 días hábiles",
    office: "Oficina de Registro Académico",
  };

  const documents = [
    { id: 1, name: "Solicitud dirigida al Decano", fileName: "solicitud-decano.pdf", status: "valid" },
    { id: 2, name: "Copia del DNI", fileName: "dni-carlos-quispe.pdf", status: "valid" },
    { id: 3, name: "Constancia de matrícula", fileName: "constancia-matricula.pdf", status: "valid" },
    { id: 4, name: "Comprobante de pago", fileName: "comprobante-pago.pdf", status: "valid" },
  ];

  const paymentInfo = {
    operationNumber: "0012345678",
    bank: "Banco de la Nación",
    voucherStatus: "Validado",
    validatedBy: "Ana Huanca Torres",
    validationDate: "29/05/2026 - 10:30",
  };

  const historyEvents = [
    {
      type: "forwarded",
      icon: <ArrowRight className="h-4 w-4 text-[#3B82F6]" />,
      date: "30/05/2026",
      time: "09:15",
      status: "Derivado",
      from: "Mesa de Partes",
      to: "Oficina de Registro Académico",
      responsible: "María García Quispe",
      comment: "Expediente derivado para evaluación y emisión del certificado.",
    },
    {
      type: "payment",
      icon: <CheckCircle2 className="h-4 w-4 text-[#10B981]" />,
      date: "29/05/2026",
      time: "10:30",
      status: "Pago validado",
      from: "Tesorería",
      to: "Mesa de Partes",
      responsible: "Ana Huanca Torres",
      comment: "Comprobante de pago validado correctamente.",
    },
    {
      type: "registered",
      icon: <FileText className="h-4 w-4 text-[#6B7280]" />,
      date: "28/05/2026",
      time: "16:45",
      status: "Registrado",
      from: "Sistema",
      to: "Mesa de Partes",
      responsible: "Carlos Quispe Mamani",
      comment: "Solicitud ingresada al sistema TUPA.",
    },
  ];

  const getProgressColor = () => {
    if (expedient.progressPercent > 80) return "bg-[#EF4444]";
    if (expedient.progressPercent >= 60) return "bg-[#F59E0B]";
    return "bg-[#10B981]";
  };

  const hasObservedDocuments = documents.some((d) => d.status === "observed");

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Conditional Status Banner */}
      {currentStatus === "observed" && (
        <Alert className="bg-[#FEF3C7] border-[#FCD34D]">
          <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
          <AlertDescription>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-[#92400E] mb-1">Este expediente tiene observaciones</p>
                <p className="text-sm text-[#92400E]">{expedient.observationText}</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {currentStatus === "approved" && (
        <Alert className="bg-[#D1FAE5] border-[#6EE7B7]">
          <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
          <AlertDescription>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-[#065F46] mb-1">Expediente aprobado</p>
                <p className="text-sm text-[#065F46]">
                  Este trámite ha sido completado satisfactoriamente.
                </p>
              </div>
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white flex-shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Descargar resultado
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {currentStatus === "review" && (
        <Alert className="bg-[#DBEAFE] border-[#93C5FD]">
          <Info className="h-5 w-5 text-[#3B82F6]" />
          <AlertDescription>
            <p className="text-sm text-[#1E40AF]">
              <strong>Actualmente en:</strong> {expedient.currentOffice} — {expedient.daysRemaining} días hábiles restantes
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Expedient Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-[22px] font-semibold text-[var(--unsaac-text-primary)]">
                {expedient.id}
              </h1>
              <Badge
                className={
                  currentStatus === "observed"
                    ? "badge-observed text-base px-4 py-1"
                    : currentStatus === "approved"
                    ? "badge-approved text-base px-4 py-1"
                    : "badge-review text-base px-4 py-1"
                }
              >
                {expedient.status}
              </Badge>
              <span className="text-[var(--unsaac-text-secondary)]">
                {expedient.procedureName}
              </span>
            </div>

            {/* Administrative Actions */}
            {isAdminView && (
              <div className="flex gap-2 flex-shrink-0">
                <Button className="bg-[#10B981] hover:bg-[#059669] text-white">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Aprobar
                </Button>
                <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Observar
                </Button>
                <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white">
                  <XCircle className="h-4 w-4 mr-1" />
                  Rechazar
                </Button>
                <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                  <Send className="h-4 w-4 mr-1" />
                  Derivar
                </Button>
              </div>
            )}
          </div>

          {/* Deadline Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Fecha inicio: {expedient.startDate}</span>
              <span className={`font-medium ${getProgressColor().replace("bg-", "text-")}`}>
                {expedient.progressPercent}% del plazo transcurrido
              </span>
              <span className="text-[#6B7280]">Vencimiento: {expedient.dueDate}</span>
            </div>
            <div className="relative">
              <Progress value={expedient.progressPercent} className={`h-3 ${getProgressColor()}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3 Columns Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Applicant & Procedure Data (40%) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Applicant Data */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-4">
                Datos del solicitante
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Nombre completo</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {applicantData.fullName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Código</p>
                    <p className="font-medium text-[var(--unsaac-text-primary)]">
                      {applicantData.code}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Facultad</p>
                    <p className="font-medium text-[var(--unsaac-text-primary)]">
                      {applicantData.faculty}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Carrera profesional</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {applicantData.career}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Correo electrónico</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {applicantData.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Teléfono</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {applicantData.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Procedure Data */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-4">
                Datos del procedimiento
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Costo</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {procedureData.cost}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Plazo de atención</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {procedureData.deadline}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Oficina responsable</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {procedureData.office}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Documents (35%) */}
        <div className="lg:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-4">
                Documentos adjuntos
              </h3>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 border rounded-lg ${
                      doc.status === "observed" ? "bg-[#FEF2F2] border-[#FCA5A5]" : "border-[#E5E7EB]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-[#6B7280] flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[var(--unsaac-text-primary)] truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-[#6B7280]">{doc.fileName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          className={
                            doc.status === "valid"
                              ? "badge-approved text-xs"
                              : doc.status === "observed"
                              ? "badge-rejected text-xs"
                              : "badge-pending text-xs"
                          }
                        >
                          {doc.status === "valid"
                            ? "Válido"
                            : doc.status === "observed"
                            ? "Observado"
                            : "Pendiente"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Replace Observed Document Button (Student Only) */}
              {!isAdminView && hasObservedDocuments && (
                <Button className="w-full mt-4 bg-[#F59E0B] hover:bg-[#D97706] text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Reemplazar documento observado
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Payment Info (25%) */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-4">
                Información de pago
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">N° Operación</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {paymentInfo.operationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Banco</p>
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {paymentInfo.bank}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Estado del voucher</p>
                  <Badge className="badge-approved">{paymentInfo.voucherStatus}</Badge>
                </div>
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Validado por</p>
                  <p className="text-sm font-medium text-[var(--unsaac-text-primary)]">
                    {paymentInfo.validatedBy}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">{paymentInfo.validationDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline History (Immutable) */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4 text-[#6B7280]" />
            <h3 className="font-semibold text-[var(--unsaac-text-primary)]">
              Historial del expediente
            </h3>
            <span className="text-xs text-[#6B7280]">
              — Registro inmutable, no puede ser modificado (RN-14)
            </span>
          </div>

          <div className="space-y-4">
            {historyEvents.map((event, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB]"
              >
                {/* Icon */}
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                  {event.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--unsaac-text-primary)]">
                        {event.date}
                      </span>
                      <span className="text-sm text-[#6B7280]">{event.time}</span>
                      <Badge
                        className={
                          event.type === "observed"
                            ? "badge-observed text-xs"
                            : event.type === "forwarded"
                            ? "badge-review text-xs"
                            : event.type === "payment"
                            ? "badge-approved text-xs"
                            : "badge-pending text-xs"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
                    <span className="font-medium">{event.from}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium">{event.to}</span>
                  </div>

                  <p className="text-sm text-[#6B7280] mb-1">
                    <strong>Responsable:</strong> {event.responsible}
                  </p>

                  <p className="text-sm text-[var(--unsaac-text-primary)]">{event.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

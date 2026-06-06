import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Search,
  Eye,
  AlertTriangle,
  Clock,
  X,
  FileText,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
} from "lucide-react";

interface Expedient {
  id: string;
  applicant: string;
  code: string;
  email: string;
  procedure: string;
  dateReceived: string;
  daysRemaining: number;
  status: string;
  deadline: "overdue" | "urgent" | "comfortable" | "normal";
}

export function OfficeDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProcedure, setFilterProcedure] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedExpedient, setSelectedExpedient] = useState<Expedient | null>(null);
  const [showObserveModal, setShowObserveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [observationText, setObservationText] = useState("");
  const [rejectionText, setRejectionText] = useState("");
  const [forwardOffice, setForwardOffice] = useState("");
  const [forwardComment, setForwardComment] = useState("");

  const expedients: Expedient[] = [
    {
      id: "2026-CERT-00087",
      applicant: "Carlos Quispe Mamani",
      code: "180421",
      email: "carlos.quispe@unsaac.edu.pe",
      procedure: "Certificado de Estudios",
      dateReceived: "28/05/2026",
      daysRemaining: -1,
      status: "En evaluación",
      deadline: "overdue",
    },
    {
      id: "2026-CONST-00142",
      applicant: "María García Huamán",
      code: "190315",
      email: "maria.garcia@unsaac.edu.pe",
      procedure: "Constancia de Estudios",
      dateReceived: "03/06/2026",
      daysRemaining: 1,
      status: "En evaluación",
      deadline: "urgent",
    },
    {
      id: "2026-CERT-00095",
      applicant: "Juan Pérez López",
      code: "170528",
      email: "juan.perez@unsaac.edu.pe",
      procedure: "Certificado de Estudios",
      dateReceived: "29/05/2026",
      daysRemaining: 4,
      status: "Pendiente",
      deadline: "comfortable",
    },
    {
      id: "2026-GRAD-00023",
      applicant: "Ana Torres Cárdenas",
      code: "160412",
      email: "ana.torres@unsaac.edu.pe",
      procedure: "Grado de Bachiller",
      dateReceived: "01/06/2026",
      daysRemaining: 3,
      status: "En evaluación",
      deadline: "normal",
    },
    {
      id: "2026-CONST-00138",
      applicant: "Pedro Ramos Silva",
      code: "180219",
      email: "pedro.ramos@unsaac.edu.pe",
      procedure: "Constancia de Estudios",
      dateReceived: "02/06/2026",
      daysRemaining: 2,
      status: "Pendiente",
      deadline: "normal",
    },
    {
      id: "2026-CARNE-00056",
      applicant: "Lucía Mendoza Arias",
      code: "190508",
      email: "lucia.mendoza@unsaac.edu.pe",
      procedure: "Carné Universitario",
      dateReceived: "30/05/2026",
      daysRemaining: 5,
      status: "En evaluación",
      deadline: "comfortable",
    },
    {
      id: "2026-CERT-00091",
      applicant: "Roberto Chávez Puma",
      code: "170634",
      email: "roberto.chavez@unsaac.edu.pe",
      procedure: "Certificado de Estudios",
      dateReceived: "31/05/2026",
      daysRemaining: 3,
      status: "Pendiente",
      deadline: "normal",
    },
  ];

  const documents = [
    { id: 1, name: "Solicitud dirigida al Decano", fileName: "solicitud-decano.pdf" },
    { id: 2, name: "Copia del DNI", fileName: "dni-carlos-quispe.pdf" },
    { id: 3, name: "Constancia de matrícula", fileName: "constancia-matricula.pdf" },
    { id: 4, name: "Fotografía tamaño carné", fileName: "foto-carne.jpg" },
  ];

  const validOffices = [
    { id: "registro", name: "Oficina de Registro Académico" },
    { id: "secretaria", name: "Secretaría General" },
    { id: "grados", name: "Oficina de Grados y Títulos" },
  ];

  const getDeadlineDisplay = (expedient: Expedient) => {
    if (expedient.deadline === "overdue") {
      return {
        bgColor: "bg-[#FEE2E2]",
        textColor: "text-[#EF4444]",
        icon: <AlertTriangle className="h-4 w-4 text-[#EF4444]" />,
        text: "VENCIDO",
        fontWeight: "font-semibold",
      };
    }
    if (expedient.deadline === "urgent") {
      return {
        bgColor: "bg-[#FEF3C7]",
        textColor: "text-[#F59E0B]",
        icon: <Clock className="h-4 w-4 text-[#F59E0B]" />,
        text: "1 día hábil",
        fontWeight: "font-medium",
      };
    }
    if (expedient.deadline === "comfortable") {
      return {
        bgColor: "",
        textColor: "text-[#10B981]",
        icon: <Clock className="h-4 w-4 text-[#10B981]" />,
        text: `${expedient.daysRemaining} días hábiles`,
        fontWeight: "font-normal",
      };
    }
    return {
      bgColor: "",
      textColor: "text-[#10B981]",
      icon: null,
      text: `${expedient.daysRemaining} días hábiles`,
      fontWeight: "font-normal",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold text-[var(--unsaac-text-primary)] mb-1">
          Bandeja de expedientes
        </h1>
        <p className="text-[var(--unsaac-text-secondary)]">
          Oficina de Registro Académico
        </p>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  placeholder="Buscar por expediente, solicitante o procedimiento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Status */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="evaluation">En evaluación</SelectItem>
                <SelectItem value="observed">Observado</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Procedure */}
            <Select value={filterProcedure} onValueChange={setFilterProcedure}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Procedimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los procedimientos</SelectItem>
                <SelectItem value="cert">Certificado de Estudios</SelectItem>
                <SelectItem value="const">Constancia de Estudios</SelectItem>
                <SelectItem value="grad">Grado de Bachiller</SelectItem>
                <SelectItem value="carne">Carné Universitario</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Más recientes</SelectItem>
                <SelectItem value="date-asc">Más antiguos</SelectItem>
                <SelectItem value="deadline-asc">Plazo (urgente primero)</SelectItem>
                <SelectItem value="deadline-desc">Plazo (mayor primero)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">N° Expediente</TableHead>
                  <TableHead className="font-semibold">Solicitante</TableHead>
                  <TableHead className="font-semibold">Procedimiento</TableHead>
                  <TableHead className="font-semibold">Fecha Ingreso</TableHead>
                  <TableHead className="font-semibold">Plazo Restante</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expedients.map((exp) => {
                  const deadline = getDeadlineDisplay(exp);
                  const rowBg = exp.deadline === "overdue" ? "bg-[#FFF5F5]" : "";

                  return (
                    <TableRow key={exp.id} className={rowBg}>
                      <TableCell className="font-medium">{exp.id}</TableCell>
                      <TableCell>{exp.applicant}</TableCell>
                      <TableCell>{exp.procedure}</TableCell>
                      <TableCell>{exp.dateReceived}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded ${deadline.bgColor}`}
                        >
                          {deadline.icon}
                          <span className={`${deadline.textColor} ${deadline.fontWeight}`}>
                            {deadline.text}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="badge-review">{exp.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                            onClick={() => setSelectedExpedient(exp)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="h-4 w-4 mr-1" />
                            Derivar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Right Drawer */}
      {selectedExpedient && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-white border-l border-[#E5E7EB] shadow-lg z-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-1">
                  {selectedExpedient.id}
                </h3>
                <Badge className="badge-review">{selectedExpedient.status}</Badge>
              </div>
              <button
                onClick={() => setSelectedExpedient(null)}
                className="text-[#6B7280] hover:text-[var(--unsaac-text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Applicant Data */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--unsaac-text-primary)] mb-3">
                Datos del solicitante
              </h4>
              <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-lg">
                <div className="w-12 h-12 bg-[var(--unsaac-red)] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {selectedExpedient.applicant.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--unsaac-text-primary)]">
                    {selectedExpedient.applicant}
                  </p>
                  <p className="text-sm text-[#6B7280]">Código: {selectedExpedient.code}</p>
                  <p className="text-sm text-[#6B7280] truncate">{selectedExpedient.email}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--unsaac-text-primary)] mb-3">
                Documentos adjuntos
              </h4>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-[#6B7280] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--unsaac-text-primary)] truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-[#6B7280]">{doc.fileName}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="flex-shrink-0">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Voucher */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--unsaac-text-primary)] mb-3">
                Comprobante de pago
              </h4>
              <div className="p-4 border border-[#E5E7EB] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">N° Operación:</span>
                  <span className="font-medium text-[var(--unsaac-text-primary)]">0012345678</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Estado:</span>
                  <Badge className="badge-pending">Pendiente validación</Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white">
                    Validar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-[#EF4444] border-[#EF4444] hover:bg-[#FEF2F2]">
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
              <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aprobar expediente
              </Button>
              <Button
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white"
                onClick={() => {
                  setShowObserveModal(true);
                  setObservationText("");
                }}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Observar expediente
              </Button>
              <Button
                className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white"
                onClick={() => {
                  setShowRejectModal(true);
                  setRejectionText("");
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar expediente
              </Button>
              <Button
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                onClick={() => {
                  setShowForwardModal(true);
                  setForwardOffice("");
                  setForwardComment("");
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Derivar a otra oficina
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Observar */}
      {showObserveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-lg mx-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--unsaac-text-primary)]">
                  Observar expediente
                </h3>
                <button
                  onClick={() => setShowObserveModal(false)}
                  className="text-[#6B7280] hover:text-[var(--unsaac-text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="observation" className="text-[13px] font-medium">
                    Descripción de la observación <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Textarea
                    id="observation"
                    placeholder="Detalla las observaciones encontradas en el expediente..."
                    value={observationText}
                    onChange={(e) => setObservationText(e.target.value)}
                    maxLength={500}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        observationText.length < 10 ? "text-[#EF4444]" : "text-[#6B7280]"
                      }
                    >
                      {observationText.length}/500 (mín. 10 caracteres)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowObserveModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={observationText.length < 10}
                    className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar observación
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Rechazar */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-lg mx-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--unsaac-text-primary)]">
                  Rechazar expediente
                </h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-[#6B7280] hover:text-[var(--unsaac-text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Alert className="bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Esta acción es permanente. El expediente será rechazado definitivamente y el
                    solicitante deberá iniciar un nuevo trámite.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="rejection" className="text-[13px] font-medium">
                    Motivo del rechazo <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Textarea
                    id="rejection"
                    placeholder="Detalla el motivo por el cual se rechaza este expediente..."
                    value={rejectionText}
                    onChange={(e) => setRejectionText(e.target.value)}
                    maxLength={500}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        rejectionText.length < 20 ? "text-[#EF4444]" : "text-[#6B7280]"
                      }
                    >
                      {rejectionText.length}/500 (mín. 20 caracteres)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={rejectionText.length < 20}
                    className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Rechazar expediente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Derivar */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-lg mx-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--unsaac-text-primary)]">
                  Derivar a otra oficina
                </h3>
                <button
                  onClick={() => setShowForwardModal(false)}
                  className="text-[#6B7280] hover:text-[var(--unsaac-text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Alert className="bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF]">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Solo puedes derivar a oficinas del flujo TUPA de este procedimiento.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="office" className="text-[13px] font-medium">
                    Oficina destino <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Select value={forwardOffice} onValueChange={setForwardOffice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la oficina..." />
                    </SelectTrigger>
                    <SelectContent>
                      {validOffices.map((office) => (
                        <SelectItem key={office.id} value={office.id}>
                          {office.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-[13px] font-medium">
                    Comentario <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Describe el motivo de la derivación..."
                    value={forwardComment}
                    onChange={(e) => setForwardComment(e.target.value)}
                    maxLength={500}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        forwardComment.length < 15 ? "text-[#EF4444]" : "text-[#6B7280]"
                      }
                    >
                      {forwardComment.length}/500 (mín. 15 caracteres)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowForwardModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={!forwardOffice || forwardComment.length < 15}
                    className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Derivar expediente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

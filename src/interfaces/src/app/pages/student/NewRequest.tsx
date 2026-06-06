import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
  X,
  XCircle,
  FileText,
  Download,
  Info,
  ChevronRight,
} from "lucide-react";

type DocumentState = "completed" | "error" | "pending";

interface Document {
  id: number;
  name: string;
  description: string;
  state: DocumentState;
  fileName?: string;
  errorMessage?: string;
  hasTemplate?: boolean;
}

export function NewRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showError, setShowError] = useState(false);

  const procedures = [
    {
      id: 1,
      code: "001-2026",
      name: "Certificado de Estudios",
      cost: "S/ 25.00",
      duration: "5 días",
      office: "Registro Académico",
    },
    {
      id: 2,
      code: "002-2026",
      name: "Constancia de Estudios",
      cost: "Gratuito",
      duration: "3 días",
      office: "Registro Académico",
    },
    {
      id: 3,
      code: "003-2026",
      name: "Carné Universitario",
      cost: "S/ 15.00",
      duration: "7 días",
      office: "Bienestar Universitario",
    },
  ];

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: "Solicitud dirigida al Decano",
      description: "Formato oficial de solicitud",
      state: "completed",
      fileName: "solicitud-decano.pdf",
    },
    {
      id: 2,
      name: "Copia del DNI",
      description: "Documento de identidad vigente",
      state: "completed",
      fileName: "dni-carlos-quispe.pdf",
    },
    {
      id: 3,
      name: "Constancia de matrícula",
      description: "Documento vigente del semestre actual",
      state: "error",
      errorMessage: "Solo PDF, JPG, PNG. Rechazado: constancia.docx",
    },
    {
      id: 4,
      name: "Fotografía tamaño carné",
      description: "Formato JPG o PNG, fondo blanco",
      state: "pending",
    },
    {
      id: 5,
      name: "Comprobante de pago",
      description: "Recibo de pago del trámite",
      state: "pending",
      hasTemplate: true,
    },
  ]);

  const [paymentData, setPaymentData] = useState({
    operationNumber: "",
    receipt: null as File | null,
  });

  const filteredProcedures = procedures.filter((proc) =>
    proc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedDocs = documents.filter((d) => d.state === "completed").length;
  const totalDocs = documents.length;
  const hasErrors = documents.some((d) => d.state === "error");
  const allDocsCompleted = completedDocs === totalDocs;

  const steps = [
    { number: 1, label: "Procedimiento" },
    { number: 2, label: "Documentos" },
    { number: 3, label: "Pago" },
    { number: 4, label: "Revisión" },
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "active";
    return "pending";
  };

  const handleSubmit = () => {
    if (hasErrors || !allDocsCompleted) {
      setShowError(true);
      return;
    }
    setShowSuccessModal(true);
  };

  const expedientNumber = "2026-CERT-00125";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold text-[var(--unsaac-text-primary)] mb-1">
          Nueva solicitud de trámite
        </h1>
        <p className="text-[var(--unsaac-text-secondary)]">
          Completa los pasos para registrar tu solicitud
        </p>
      </div>

      {/* Main Card with Stepper */}
      <Card>
        <CardContent className="p-8">
          {/* Horizontal Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => {
                const status = getStepStatus(step.number);
                const isLast = index === steps.length - 1;

                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center relative z-10">
                      {/* Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                          status === "active"
                            ? "bg-[var(--unsaac-red)] text-white"
                            : status === "completed"
                            ? "bg-[#10B981] text-white"
                            : "bg-[#E5E7EB] text-[#6B7280]"
                        }`}
                      >
                        {status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5" strokeWidth={3} />
                        ) : (
                          <span>{step.number}</span>
                        )}
                      </div>
                      {/* Label */}
                      <span
                        className={`mt-2 text-sm whitespace-nowrap ${
                          status === "active"
                            ? "text-[var(--unsaac-red)] font-medium"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector Line */}
                    {!isLast && (
                      <div
                        className={`flex-1 h-[2px] mx-4 mb-6 transition-all ${
                          status === "completed" ? "bg-[#10B981]" : "bg-[#E5E7EB]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: PROCEDIMIENTO */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Info Banner */}
              <Alert className="bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF]">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Tus datos se cargaron automáticamente desde el sistema académico UNSAAC.
                </AlertDescription>
              </Alert>

              {/* Locked Student Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium">Nombre completo</Label>
                  <div className="relative">
                    <Input
                      value="Carlos Quispe Mamani"
                      disabled
                      className="bg-[#F9FAFB] cursor-not-allowed border-[#E5E7EB]"
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium">Código universitario</Label>
                  <div className="relative">
                    <Input
                      value="180421"
                      disabled
                      className="bg-[#F9FAFB] cursor-not-allowed border-[#E5E7EB]"
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium">Facultad</Label>
                  <div className="relative">
                    <Input
                      value="FIEIM"
                      disabled
                      className="bg-[#F9FAFB] cursor-not-allowed border-[#E5E7EB]"
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium">Carrera profesional</Label>
                  <div className="relative">
                    <Input
                      value="Ingeniería Informática y de Sistemas"
                      disabled
                      className="bg-[#F9FAFB] cursor-not-allowed border-[#E5E7EB]"
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  </div>
                </div>
              </div>

              {/* Procedure Selector */}
              <div className="space-y-3">
                <Label className="text-[13px] font-medium">Selecciona el procedimiento</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                  <Input
                    placeholder="Buscar por nombre o código..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Selected Procedure Card */}
              {selectedProcedure && (
                <Card className="border-[#10B981] bg-[#D1FAE5]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[#065F46] text-white border-none">
                            {selectedProcedure.code}
                          </Badge>
                          <h4 className="font-semibold text-[var(--unsaac-text-primary)]">
                            {selectedProcedure.name}
                          </h4>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-[#6B7280]">Costo:</span>
                            <p className="font-medium text-[#065F46]">{selectedProcedure.cost}</p>
                          </div>
                          <div>
                            <span className="text-[#6B7280]">Plazo:</span>
                            <p className="font-medium text-[#065F46]">{selectedProcedure.duration}</p>
                          </div>
                          <div>
                            <span className="text-[#6B7280]">Oficina:</span>
                            <p className="font-medium text-[#065F46]">{selectedProcedure.office}</p>
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-[#10B981] flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Procedure List */}
              {!selectedProcedure && (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredProcedures.map((proc) => (
                    <div
                      key={proc.id}
                      onClick={() => setSelectedProcedure(proc)}
                      className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[var(--unsaac-red)] hover:bg-[#FEF2F2] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {proc.code}
                        </Badge>
                        <h4 className="font-medium">{proc.name}</h4>
                      </div>
                      <div className="flex gap-4 text-sm text-[#6B7280]">
                        <span>{proc.cost}</span>
                        <span>• {proc.duration}</span>
                        <span>• {proc.office}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" asChild>
                  <Link to="/dashboard/student">Cancelar</Link>
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedProcedure}
                  className="flex-1 bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-hover)] text-white"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                  Documentos
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DOCUMENTOS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Progress Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[var(--unsaac-text-primary)]">
                    Adjunta los documentos requeridos
                  </h3>
                  <span className="text-sm text-[#6B7280]">
                    {completedDocs} de {totalDocs} documentos completados
                  </span>
                </div>
                <Progress
                  value={(completedDocs / totalDocs) * 100}
                  className="h-2 bg-[#E5E7EB]"
                />
              </div>

              {/* Documents List */}
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg ${
                      doc.state === "error"
                        ? "border-[#EF4444] bg-[#FEF2F2]"
                        : "border-[#E5E7EB]"
                    }`}
                  >
                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            doc.state === "completed"
                              ? "bg-[#10B981]"
                              : doc.state === "error"
                              ? "bg-[#EF4444]"
                              : "bg-[#E5E7EB]"
                          }`}
                        >
                          {doc.state === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />
                          ) : doc.state === "error" ? (
                            <X className="h-4 w-4 text-white" strokeWidth={3} />
                          ) : (
                            <span className="text-xs text-[#6B7280] font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--unsaac-text-primary)] mb-1">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-[#6B7280]">{doc.description}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          doc.state === "completed"
                            ? "badge-approved"
                            : doc.state === "error"
                            ? "badge-rejected"
                            : "badge-pending"
                        }
                      >
                        {doc.state === "completed"
                          ? "Completado"
                          : doc.state === "error"
                          ? "Error de formato"
                          : "Pendiente"}
                      </Badge>
                    </div>

                    {/* Completed State */}
                    {doc.state === "completed" && (
                      <div className="flex items-center justify-between p-3 bg-[#D1FAE5] border border-[#6EE7B7] rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#065F46]" />
                          <span className="text-sm font-medium text-[#065F46]">{doc.fileName}</span>
                        </div>
                        <button className="text-[#EF4444] hover:text-[#DC2626]">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Error State */}
                    {doc.state === "error" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-[#FEE2E2] border-l-[3px] border-l-[#EF4444] rounded">
                          <p className="text-sm text-[#991B1B]">{doc.errorMessage}</p>
                        </div>
                        <div className="p-6 border-2 border-dashed border-[#EF4444] rounded-lg text-center hover:bg-[#FEF2F2] transition-colors cursor-pointer">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-[#EF4444]" />
                          <p className="text-sm font-medium text-[#991B1B]">
                            Arrastra archivos o haz clic para seleccionar
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">Solo PDF, JPG, PNG — Máx. 5MB</p>
                        </div>
                      </div>
                    )}

                    {/* Pending State */}
                    {doc.state === "pending" && (
                      <div className="space-y-3">
                        {doc.hasTemplate && (
                          <a
                            href="#"
                            className="inline-flex items-center gap-1 text-sm text-[var(--unsaac-gold)] hover:text-[var(--unsaac-gold-hover)] font-medium"
                          >
                            <Download className="h-4 w-4" />
                            Descargar formato
                          </a>
                        )}
                        <div className="p-6 border-2 border-dashed border-[#D1D5DB] rounded-lg text-center hover:border-[var(--unsaac-red)] hover:bg-[#FEF2F2] transition-colors cursor-pointer">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-[#6B7280]" />
                          <p className="text-sm font-medium text-[var(--unsaac-text-primary)]">
                            Arrastra archivos o haz clic para seleccionar
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">Solo PDF, JPG, PNG — Máx. 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Anterior
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={hasErrors}
                  className="flex-1 bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-hover)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                  Pago
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PAGO */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Payment Instructions Card */}
              <Card className="border-[var(--unsaac-gold)] bg-[#FEF3C7]">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[var(--unsaac-text-primary)] mb-4">
                    Instrucciones de pago
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-[#92400E]">Monto a pagar:</span>
                      <span className="text-2xl font-bold text-[#92400E]">S/ 25.00</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#92400E]">Concepto:</span>
                      <p className="font-medium text-[#92400E]">{selectedProcedure?.name}</p>
                    </div>
                    <div className="pt-3 border-t border-[#FCD34D]">
                      <p className="text-sm text-[#92400E] mb-2">
                        <strong>Instrucciones:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-[#92400E]">
                        <li>Acércate al Banco de la Nación con tu código universitario</li>
                        <li>Solicita realizar el pago del trámite indicando el código del procedimiento</li>
                        <li>Guarda el comprobante de pago</li>
                        <li>Sube el comprobante escaneado o fotografiado en el siguiente campo</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="operationNumber" className="text-[13px] font-medium">
                    Número de operación
                  </Label>
                  <Input
                    id="operationNumber"
                    placeholder="Ej: 0012345678"
                    value={paymentData.operationNumber}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, operationNumber: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-medium">Comprobante de pago</Label>
                  <div className="p-6 border-2 border-dashed border-[#D1D5DB] rounded-lg text-center hover:border-[var(--unsaac-red)] hover:bg-[#FEF2F2] transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-[#6B7280]" />
                    <p className="text-sm font-medium text-[var(--unsaac-text-primary)]">
                      Arrastra tu comprobante o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">Solo PDF, JPG, PNG — Máx. 5MB</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Anterior
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-hover)] text-white"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                  Revisión
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: REVISIÓN Y ENVÍO */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--unsaac-text-primary)]">
                Revisa tu solicitud antes de enviar
              </h3>

              {/* Summary Table */}
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#E5E7EB]">
                    <tr className="bg-[#F9FAFB]">
                      <td className="p-3 font-medium text-[#6B7280] w-1/3">Nombre completo</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">Carlos Quispe Mamani</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#6B7280]">Código universitario</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">180421</td>
                    </tr>
                    <tr className="bg-[#F9FAFB]">
                      <td className="p-3 font-medium text-[#6B7280]">Facultad</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">FIEIM</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#6B7280]">Carrera profesional</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">
                        Ingeniería Informática y de Sistemas
                      </td>
                    </tr>
                    <tr className="bg-[#F9FAFB]">
                      <td className="p-3 font-medium text-[#6B7280]">Procedimiento</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">
                        {selectedProcedure?.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#6B7280]">Código del procedimiento</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">
                        {selectedProcedure?.code}
                      </td>
                    </tr>
                    <tr className="bg-[#F9FAFB]">
                      <td className="p-3 font-medium text-[#6B7280]">Costo</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">
                        {selectedProcedure?.cost}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#6B7280]">Plazo de atención</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">
                        {selectedProcedure?.duration}
                      </td>
                    </tr>
                    <tr className="bg-[#F9FAFB]">
                      <td className="p-3 font-medium text-[#6B7280]">Documentos adjuntados</td>
                      <td className="p-3 text-[var(--unsaac-text-primary)]">
                        {completedDocs} de {totalDocs}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Legal Declaration */}
              <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Al enviar esta solicitud, declaro bajo juramento que la información y documentos
                  proporcionados son veraces y auténticos. Comprendo que cualquier falsedad puede
                  resultar en la anulación del trámite y sanciones según la normativa universitaria
                  vigente de la UNSAAC.
                </p>
              </div>

              {/* Error Banner */}
              {showError && (
                <Alert className="bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Faltan documentos requeridos: Fotografía tamaño carné, Comprobante de pago
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={showError}
                  className="w-[260px] h-12 bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-hover)] text-white text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar y Enviar
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Anterior
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-[22px] font-semibold text-[#10B981] mb-2">
                ¡Solicitud registrada!
              </h2>
              <p className="text-[var(--unsaac-text-secondary)] mb-1">
                Tu trámite ha sido ingresado exitosamente
              </p>
              <div className="my-6 p-4 bg-[#D1FAE5] border border-[#6EE7B7] rounded-lg">
                <p className="text-sm text-[#065F46] mb-1">Número de expediente:</p>
                <p className="text-2xl font-bold text-[#10B981]">{expedientNumber}</p>
              </div>
              <p className="text-sm text-[#6B7280] mb-6">
                Recibirás un correo de confirmación en tu cuenta institucional
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="w-full bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-hover)] text-white"
                >
                  <Link to="/dashboard/student/procedures">Ver mis trámites</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setCurrentStep(1);
                    setSelectedProcedure(null);
                    setSearchQuery("");
                  }}
                  className="w-full"
                >
                  Iniciar otro trámite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

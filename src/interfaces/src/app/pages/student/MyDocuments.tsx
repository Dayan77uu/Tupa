import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { FileText, Download, Eye, Trash2 } from "lucide-react";

export function MyDocuments() {
  const documents = [
    {
      id: 1,
      name: "DNI - Juan Pérez López",
      type: "Documento de identidad",
      date: "2026-05-25",
      procedure: "Certificado de estudios",
      status: "Validado",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      name: "Solicitud certificado",
      type: "Formulario",
      date: "2026-05-25",
      procedure: "Certificado de estudios",
      status: "Validado",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      name: "Comprobante de pago",
      type: "Recibo",
      date: "2026-05-25",
      procedure: "Carné universitario",
      status: "Pendiente",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Mis documentos</h1>
        <p className="text-muted-foreground">Repositorio de documentos digitales</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--unsaac-red)]">Documentos adjuntados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-[var(--unsaac-red)]/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-[var(--unsaac-red)]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{doc.name}</h4>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.procedure}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={doc.statusColor}>{doc.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DollarSign, Upload, Download } from "lucide-react";

export function PaymentsReceipts() {
  const payments = [
    {
      id: 1,
      procedure: "Certificado de estudios",
      code: "20260525-001",
      amount: "S/. 50.00",
      date: "2026-05-25",
      status: "Verificado",
      statusColor: "bg-green-600",
    },
    {
      id: 2,
      procedure: "Carné universitario",
      code: "20260520-002",
      amount: "S/. 25.00",
      date: "2026-05-20",
      status: "Pendiente",
      statusColor: "bg-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Pagos y recibos</h1>
        <p className="text-muted-foreground">Gestiona los pagos de tus trámites</p>
      </div>

      {/* Register Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--unsaac-red)]">Registrar comprobante de pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiptNumber">Número de recibo</Label>
              <Input id="receiptNumber" placeholder="Ej: 0012345678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Fecha de pago</Label>
              <Input id="paymentDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input id="amount" placeholder="Ej: 50.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Archivo del comprobante</Label>
              <div className="flex gap-2">
                <Input id="file" type="file" />
                <Button>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
            Enviar comprobante
          </Button>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--unsaac-red)]">Historial de pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trámite</TableHead>
                  <TableHead>Código de pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.procedure}</TableCell>
                    <TableCell>{payment.code}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <Badge className={`${payment.statusColor} text-white hover:${payment.statusColor}`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Recibo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

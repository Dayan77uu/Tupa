import { Link } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, Eye, Check, X, Send, FileText, Clock, AlertCircle } from "lucide-react";

export function MesaPartesDashboard() {
  const [filterStatus, setFilterStatus] = useState("all");

  const stats = [
    { title: "Solicitudes nuevas", value: "12", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Por revisar", value: "8", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Observadas", value: "3", icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50" },
    { title: "Derivadas hoy", value: "15", icon: Send, color: "text-green-600", bgColor: "bg-green-50" },
  ];

  const requests = [
    {
      id: "SOL-2026-0245",
      applicant: "María García Quispe",
      userType: "Estudiante",
      procedure: "Certificado de estudios",
      date: "2026-05-30 08:30",
      status: "Nueva",
      statusColor: "bg-blue-600",
    },
    {
      id: "SOL-2026-0244",
      applicant: "Carlos Mendoza López",
      userType: "Egresado",
      procedure: "Grado de Bachiller",
      date: "2026-05-30 07:45",
      status: "En revisión",
      statusColor: "bg-orange-600",
    },
    {
      id: "SOL-2026-0243",
      applicant: "Ana Torres Pérez",
      userType: "Estudiante",
      procedure: "Constancia de estudios",
      date: "2026-05-29 16:20",
      status: "Por derivar",
      statusColor: "bg-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Mesa de Partes</h1>
        <p className="text-muted-foreground">Gestión de solicitudes entrantes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-l-4 border-l-[var(--unsaac-red)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[var(--unsaac-red)]">Solicitudes entrantes</CardTitle>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Nueva">Nuevas</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Por derivar">Por derivar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por expediente, solicitante o trámite" className="pl-10" />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nro. expediente</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Tipo usuario</TableHead>
                  <TableHead>Trámite</TableHead>
                  <TableHead>Fecha ingreso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.id}</TableCell>
                    <TableCell>{req.applicant}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.userType}</Badge>
                    </TableCell>
                    <TableCell>{req.procedure}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>
                      <Badge className={`${req.statusColor} text-white hover:${req.statusColor}`}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Ver detalle">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Aprobar" className="text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Observar" className="text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Derivar" className="text-blue-600">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
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

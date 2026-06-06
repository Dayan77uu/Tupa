import { Link } from "react-router";
import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, Eye, Filter } from "lucide-react";

export function MyProcedures() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const procedures = [
    {
      id: "EXP-2026-0123",
      name: "Certificado de estudios",
      date: "2026-05-25",
      updated: "2026-05-28",
      status: "En evaluación",
      statusColor: "bg-[var(--status-evaluation)]",
      office: "Secretaría General",
    },
    {
      id: "EXP-2026-0098",
      name: "Constancia de estudios",
      date: "2026-05-20",
      updated: "2026-05-22",
      status: "Aprobado",
      statusColor: "bg-[var(--status-approved)]",
      office: "Registros Académicos",
    },
    {
      id: "EXP-2026-0076",
      name: "Carné universitario",
      date: "2026-05-15",
      updated: "2026-05-27",
      status: "Observado",
      statusColor: "bg-[var(--status-observed)]",
      office: "Bienestar Universitario",
    },
    {
      id: "EXP-2026-0045",
      name: "Constancia de no adeudar",
      date: "2026-05-10",
      updated: "2026-05-12",
      status: "Finalizado",
      statusColor: "bg-[var(--status-finalized)]",
      office: "Tesorería",
    },
    {
      id: "EXP-2026-0012",
      name: "Duplicado de carné",
      date: "2026-04-28",
      updated: "2026-05-05",
      status: "Aprobado",
      statusColor: "bg-[var(--status-approved)]",
      office: "Bienestar Universitario",
    },
  ];

  const filteredProcedures = procedures.filter((proc) => {
    const matchesSearch = proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || proc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Mis trámites</h1>
        <p className="text-muted-foreground">Consulta y da seguimiento a todos tus trámites</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por expediente o nombre de trámite"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Registrado">Registrado</SelectItem>
                <SelectItem value="En revisión">En revisión</SelectItem>
                <SelectItem value="Observado">Observado</SelectItem>
                <SelectItem value="En evaluación">En evaluación</SelectItem>
                <SelectItem value="Aprobado">Aprobado</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expediente</TableHead>
                  <TableHead>Trámite</TableHead>
                  <TableHead>Fecha registro</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Oficina</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcedures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron trámites
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcedures.map((proc) => (
                    <TableRow key={proc.id}>
                      <TableCell className="font-medium">{proc.id}</TableCell>
                      <TableCell>{proc.name}</TableCell>
                      <TableCell>{proc.date}</TableCell>
                      <TableCell>{proc.updated}</TableCell>
                      <TableCell>
                        <Badge className={`${proc.statusColor} text-white hover:${proc.statusColor}`}>
                          {proc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{proc.office}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/dashboard/student/tracking/${proc.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalle
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredProcedures.length} de {procedures.length} trámites
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

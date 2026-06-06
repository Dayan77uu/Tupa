import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, FilePlus, Clock, CheckCircle2 } from "lucide-react";

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Bienvenido, Dr. Juan Pérez López</h1>
        <p className="text-muted-foreground">Docente - Facultad de Ingeniería</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[var(--unsaac-red)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mis trámites</p>
                <p className="font-bold">2</p>
              </div>
              <FileText className="h-8 w-8 text-[var(--unsaac-red)]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En proceso</p>
                <p className="font-bold">1</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Aprobados</p>
                <p className="font-bold">3</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--unsaac-red)]">Acciones rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="h-24 bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
              <Link to="/dashboard/teacher/new-request" className="flex flex-col gap-2">
                <FilePlus className="h-6 w-6" />
                <span>Nueva solicitud</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24">
              <Link to="/dashboard/teacher/procedures" className="flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Mis trámites</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

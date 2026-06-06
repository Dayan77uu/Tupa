import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { GraduationCap, Award, FileCheck, AlertCircle, FilePlus } from "lucide-react";

export function GraduateDashboard() {
  const recommendedProcedures = [
    { icon: GraduationCap, title: "Grado de Bachiller", description: "Obtén tu grado académico", link: "/catalogue" },
    { icon: Award, title: "Título profesional", description: "Solicita tu título profesional", link: "/catalogue" },
    { icon: FileCheck, title: "Certificado de estudios", description: "Solicita tu certificado", link: "/catalogue" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Bienvenido, Juan Pérez López</h1>
        <p className="text-muted-foreground">Egresado - Código: 123456</p>
      </div>

      <Alert className="bg-[var(--unsaac-gold)]/10 border-[var(--unsaac-gold)]">
        <AlertCircle className="h-4 w-4 text-[var(--unsaac-gold-dark)]" />
        <AlertDescription className="text-[var(--unsaac-gray-dark)]">
          Recuerda completar los trámites pendientes para obtener tu grado de bachiller y título profesional
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[var(--unsaac-red)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trámites activos</p>
                <p className="font-bold">2</p>
              </div>
              <GraduationCap className="h-8 w-8 text-[var(--unsaac-red)]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trámites completados</p>
                <p className="font-bold">3</p>
              </div>
              <FileCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Documentos pendientes</p>
                <p className="font-bold">1</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--unsaac-red)]">Trámites recomendados para egresados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedProcedures.map((proc) => {
              const Icon = proc.icon;
              return (
                <Link
                  key={proc.title}
                  to={proc.link}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border hover:border-[var(--unsaac-red)] hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 bg-[var(--unsaac-red)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--unsaac-red)] transition-colors">
                    <Icon className="h-7 w-7 text-[var(--unsaac-red)] group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium mb-1">{proc.title}</p>
                    <p className="text-sm text-muted-foreground">{proc.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild size="lg" className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
          <Link to="/dashboard/graduate/new-request">
            <FilePlus className="h-5 w-5 mr-2" />
            Nueva solicitud
          </Link>
        </Button>
      </div>
    </div>
  );
}

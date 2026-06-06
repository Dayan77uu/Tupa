import { Card, CardContent } from "../../components/ui/card";

export function SystemConfig() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Configuración del sistema</h1>
        <p className="text-muted-foreground">Parámetros generales</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Módulo en desarrollo</p>
        </CardContent>
      </Card>
    </div>
  );
}

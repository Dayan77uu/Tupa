import { Card, CardContent } from "../../components/ui/card";

export function AuditLog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Auditoría del sistema</h1>
        <p className="text-muted-foreground">Registro de acciones del sistema</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Módulo en desarrollo</p>
        </CardContent>
      </Card>
    </div>
  );
}

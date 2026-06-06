import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export function RequirementsMaintenance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--unsaac-red)]">Mantenimiento de requisitos</h1>
        <p className="text-muted-foreground">Gestionar requisitos por trámite</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Módulo en desarrollo</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { FileQuestion } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--unsaac-red)] to-[var(--unsaac-red-dark)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardContent className="p-12">
          <div className="w-20 h-20 bg-[var(--unsaac-red)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="h-12 w-12 text-[var(--unsaac-red)]" />
          </div>
          <h1 className="mb-2 text-[var(--unsaac-red)]">Página no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            La página que buscas no existe o ha sido movida
          </p>
          <Button asChild className="bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

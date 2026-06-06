import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--unsaac-red)] to-[var(--unsaac-red-dark)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl text-center">
          <CardContent className="p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="mb-2 text-[var(--unsaac-red)]">¡Cuenta creada exitosamente!</h2>
            <p className="text-muted-foreground">Redirigiendo al inicio de sesión...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--unsaac-red)] to-[var(--unsaac-red-dark)] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[var(--unsaac-red)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">UNSAAC</span>
          </div>
          <CardTitle className="text-[var(--unsaac-red)]">Registro de Usuario</CardTitle>
          <CardDescription>Complete el formulario para crear su cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de usuario</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger id="userType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="graduate">Egresado</SelectItem>
                    <SelectItem value="teacher">Docente</SelectItem>
                    <SelectItem value="administrative">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" placeholder="12345678" required />
              </div>

              {(userType === "student" || userType === "teacher") && (
                <div className="space-y-2">
                  <Label htmlFor="code">Código universitario</Label>
                  <Input id="code" placeholder="123456" required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="firstName">Nombres</Label>
                <Input id="firstName" placeholder="Juan Carlos" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" placeholder="Pérez López" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="juan.perez@unsaac.edu.pe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="987654321" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="Mínimo 8 caracteres" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input id="confirmPassword" type="password" placeholder="Repita su contraseña" required />
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Acepto los términos y condiciones del uso de la plataforma y el tratamiento de mis datos personales
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]"
              disabled={!termsAccepted}
            >
              Crear cuenta
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
              <Link to="/login" className="text-[var(--unsaac-red)] hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

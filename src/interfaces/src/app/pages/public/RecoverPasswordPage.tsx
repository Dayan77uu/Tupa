import { Link } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function RecoverPasswordPage() {
  const [step, setStep] = useState(1);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--unsaac-red)] to-[var(--unsaac-red-dark)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[var(--unsaac-red)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">UNSAAC</span>
          </div>
          <CardTitle className="text-[var(--unsaac-red)]">
            {step === 4 ? "Contraseña actualizada" : "Recuperar contraseña"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Ingrese su correo o DNI para recibir el código de recuperación"}
            {step === 2 && "Ingrese el código enviado a su correo"}
            {step === 3 && "Cree una nueva contraseña"}
            {step === 4 && "Su contraseña ha sido actualizada exitosamente"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico o DNI</Label>
                <Input id="email" placeholder="correo@unsaac.edu.pe o DNI" required />
              </div>
              <Button type="submit" className="w-full bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                Enviar código de recuperación
              </Button>
              <div className="text-center text-sm">
                <Link to="/login" className="text-[var(--unsaac-red)] hover:underline">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Se ha enviado un código de verificación a su correo
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="code">Código de verificación</Label>
                <Input id="code" placeholder="123456" required maxLength={6} />
              </div>
              <Button type="submit" className="w-full bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                Verificar código
              </Button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-[var(--unsaac-red)] hover:underline"
              >
                Volver
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input id="newPassword" type="password" placeholder="Mínimo 8 caracteres" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirmar nueva contraseña</Label>
                <Input id="confirmNewPassword" type="password" placeholder="Repita su contraseña" required />
              </div>
              <Button type="submit" className="w-full bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                Restablecer contraseña
              </Button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-muted-foreground">Su contraseña ha sido restablecida correctamente</p>
              <Button asChild className="w-full bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-dark)]">
                <Link to="/login">Ir al inicio de sesión</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

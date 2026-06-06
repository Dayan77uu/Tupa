import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  Shield,
  FileText,
  Clock
} from "lucide-react";

type LoginState = "normal" | "error-credentials" | "blocked" | "error-connection";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>("normal");
  const [attemptCount, setAttemptCount] = useState(0);

  const isValidEmail = (email: string): boolean => {
    return email.endsWith("@unsaac.edu.pe");
  };

  const isEmailTouched = email.length > 0;
  const emailHasValidDomain = isValidEmail(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailHasValidDomain) {
      return;
    }

    setIsLoading(true);

    // Simular llamada API
    setTimeout(() => {
      setIsLoading(false);

      // Para demo: simular diferentes estados
      const demo = Math.random();

      if (demo > 0.7) {
        // Estado: Error de credenciales
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= 5) {
          setLoginState("blocked");
        } else {
          setLoginState("error-credentials");
        }
      } else if (demo > 0.5 && demo <= 0.7) {
        // Estado: Error de conexión
        setLoginState("error-connection");
      } else {
        // Login exitoso - redirigir
        navigate("/dashboard/student");
      }
    }, 1500);
  };

  const benefits = [
    { icon: Shield, text: "Acceso seguro con autenticación institucional" },
    { icon: FileText, text: "Gestión completa de trámites administrativos" },
    { icon: Clock, text: "Seguimiento en tiempo real de tus solicitudes" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* COLUMNA IZQUIERDA - 58% */}
      <div className="w-[58%] bg-[var(--unsaac-red)] text-white p-16 flex flex-col justify-between">
        <div>
          {/* Logo UNSAAC 120px */}
          <div className="mb-12">
            <div className="w-[120px] h-[120px] bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-6xl font-bold text-white">UNSAAC</span>
            </div>
          </div>

          {/* H1 */}
          <h1 className="text-4xl font-bold mb-12 text-center leading-tight">
            Sistema Web de Gestión del TUPA
          </h1>

          {/* 3 ítems con check dorado */}
          <div className="space-y-6 max-w-lg mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--unsaac-gold)] flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-lg text-white/90">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            EPIIS-UNSAAC 2026
          </p>
        </div>
      </div>

      {/* COLUMNA DERECHA - 42% */}
      <div className="w-[42%] bg-white flex items-center justify-center p-16">
        <div className="w-full max-w-md px-20">
          {/* Logo UNSAAC 48px */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-[var(--unsaac-red)] rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-white">UNSAAC</span>
            </div>
          </div>

          {/* H2 */}
          <h2 className="text-2xl font-semibold text-[var(--unsaac-red)] text-center mb-2">
            Acceso al Sistema TUPA
          </h2>

          {/* Subtítulo */}
          <p className="text-sm text-[var(--unsaac-text-secondary)] text-center mb-8">
            Solo correos institucionales @unsaac.edu.pe
          </p>

          {/* BANNERS DE ESTADO */}
          {loginState === "error-credentials" && (
            <Alert className="mb-6 bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Correo o contraseña incorrectos
              </AlertDescription>
            </Alert>
          )}

          {loginState === "blocked" && (
            <Alert className="mb-6 bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Cuenta bloqueada 15 minutos.</strong> Revisa tu correo @unsaac.edu.pe
              </AlertDescription>
            </Alert>
          )}

          {loginState === "error-connection" && (
            <Alert className="mb-6 bg-[#F3F4F6] border-[#D1D5DB] text-[#6B7280]">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error de conexión. Intenta nuevamente.
              </AlertDescription>
            </Alert>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Correo */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--font-size-label)] font-medium">
                Correo institucional
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@unsaac.edu.pe"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginState !== "normal") setLoginState("normal");
                  }}
                  className={`pl-10 pr-10 h-12 ${
                    loginState === "error-credentials" || loginState === "blocked"
                      ? "border-red-500"
                      : isEmailTouched && emailHasValidDomain
                      ? "border-green-500"
                      : isEmailTouched && !emailHasValidDomain
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={loginState === "blocked"}
                  required
                />
                {isEmailTouched && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {emailHasValidDomain ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {isEmailTouched && !emailHasValidDomain && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  Solo se aceptan correos @unsaac.edu.pe
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--font-size-label)] font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginState !== "normal") setLoginState("normal");
                  }}
                  className={`pl-10 pr-10 h-12 ${
                    loginState === "error-credentials" || loginState === "blocked"
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={loginState === "blocked"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loginState === "blocked"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Indicador de intentos */}
            {attemptCount > 0 && attemptCount < 5 && (
              <p className="text-sm text-[var(--unsaac-text-secondary)]">
                Intento {attemptCount} de 5
              </p>
            )}

            {/* Botón Ingresar */}
            <Button
              type="submit"
              className="w-full h-12 bg-[var(--unsaac-red)] hover:bg-[var(--unsaac-red-hover)] text-white font-medium"
              disabled={isLoading || loginState === "blocked" || !emailHasValidDomain}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>

            {/* Enlace Olvidaste contraseña */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/recover-password")}
                className="text-sm text-[var(--unsaac-gold)] hover:text-[var(--unsaac-gold-hover)] font-medium"
                disabled={loginState === "blocked"}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>

          {/* Nota de seguridad */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <strong>Acceso institucional:</strong> Solo personal y estudiantes activos de la UNSAAC pueden ingresar al sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe";

export default function Registro() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [errorConfirmar, setErrorConfirmar] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);

  const correoValido = email.trim().toLowerCase().endsWith(DOMINIO_INSTITUCIONAL);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError(null);
    setExito(null);
    setErrorConfirmar(null);

    if (!correoValido) {
      setError("Solo se aceptan correos institucionales @unsaac.edu.pe");
      return;
    }

    if (password !== confirmarPassword) {
      setErrorConfirmar("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await api.post("/api/auth/registro", {
        email: email.trim(),
        nombre: nombre.trim(),
        password,
        confirmar_password: confirmarPassword,
      });
      setExito(respuesta.data.mensaje);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo completar el registro.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="d-flex flex-wrap" style={{ minHeight: "100vh" }}>
      <div className="d-flex align-items-center justify-content-center p-4 p-lg-5 mx-auto" style={{ maxWidth: 480 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 className="text-center fw-semibold mb-2" style={{ fontSize: "1.5rem" }}>
            Crear cuenta
          </h2>
          <p className="text-center mb-4 text-secondary" style={{ fontSize: "0.875rem" }}>
            Regístrate con tu correo institucional @unsaac.edu.pe. Te enviaremos
            un enlace de verificación antes de activar tu cuenta.
          </p>

          {error && (
            <div className="alert alert-danger d-flex align-items-start gap-2 mb-4">
              <i className="bi bi-exclamation-circle mt-1"></i>
              <span>{error}</span>
            </div>
          )}
          {exito && (
            <div className="alert alert-success d-flex align-items-start gap-2 mb-4">
              <i className="bi bi-check-circle mt-1"></i>
              <span>{exito}</span>
            </div>
          )}

          {!exito && (
            <form onSubmit={manejarSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Correo institucional</label>
                <input
                  type="email"
                  className={`form-control ${email && !correoValido ? "is-invalid" : ""}`}
                  placeholder="usuario@unsaac.edu.pe"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {email && !correoValido && (
                  <div className="text-danger small mt-1">Solo se aceptan correos @unsaac.edu.pe</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                />
                {errorConfirmar && <div className="text-danger small mt-1">{errorConfirmar}</div>}
              </div>

              <button type="submit" className="btn btn-institucional w-100 py-2 mb-3" disabled={cargando}>
                {cargando ? "Enviando..." : "Registrarme"}
              </button>
            </form>
          )}

          <div className="text-center mb-3">
            <Link to="/login" className="small text-decoration-none">Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

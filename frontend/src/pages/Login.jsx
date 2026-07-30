import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe";

function redirigirSegunRol(navigate, rol) {
  if (rol === "ESTUDIANTE") {
    navigate("/catalogo");
  } else if (rol === "ADMINISTRADOR") {
    navigate("/admin/catalogo");
  } else {
    navigate("/admin/bandeja");
  }
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tipoError, setTipoError] = useState("error");
  const [cuentaPendienteActivacion, setCuentaPendienteActivacion] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const correoValido = correo.trim().toLowerCase().endsWith(DOMINIO_INSTITUCIONAL);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError(null);
    setCuentaPendienteActivacion(false);

    if (!correoValido) return;

    setCargando(true);
    try {
      const datos = await login(correo.trim(), contrasena);
      redirigirSegunRol(navigate, datos.rol);
    } catch (err) {
      const respuesta = err.response;
      const cuerpo = respuesta?.data || {};

      if (cuerpo.cuenta_pendiente_activacion) {
        setCuentaPendienteActivacion(true);
        return;
      }

      const esBloqueo = (cuerpo.error || "").toLowerCase().includes("bloqueada");
      setTipoError(esBloqueo ? "bloqueo" : "error");
      setError(cuerpo.error || "No se pudo iniciar sesión.");

      if (esBloqueo) {
        setBloqueado(true);
      } else if (respuesta?.status === 401) {
        setIntentosFallidos((n) => n + 1);
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="d-flex flex-wrap" style={{ minHeight: "100vh" }}>
      <div className="d-flex align-items-center justify-content-center p-4 p-lg-5 col-lg-5 bg-white mx-auto" style={{ maxWidth: 480 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 className="text-center fw-semibold mb-2" style={{ fontSize: "1.5rem" }}>
            Acceso al Sistema TUPA
          </h2>
          <p className="text-center mb-4 text-secondary" style={{ fontSize: "0.875rem" }}>
            Solo correos institucionales @unsaac.edu.pe
          </p>

          {error && (
            <div className={`alert alert-${tipoError === "bloqueo" ? "warning" : "danger"} d-flex align-items-start gap-2 mb-4`}>
              <i className="bi bi-exclamation-circle mt-1"></i>
              <span>{error}</span>
            </div>
          )}

          {cuentaPendienteActivacion && (
            <div className="alert alert-info d-flex align-items-start gap-2 mb-4">
              <i className="bi bi-info-circle mt-1"></i>
              <span>
                Esta cuenta aún no ha sido activada. <Link to="/activar-cuenta" className="alert-link">Actívala aquí</Link>
              </span>
            </div>
          )}

          <form onSubmit={manejarSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Correo institucional</label>
              <input
                type="email"
                className={`form-control ${correo && !correoValido ? "is-invalid" : ""}`}
                placeholder="usuario@unsaac.edu.pe"
                autoComplete="username"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={bloqueado}
                required
              />
              {correo && !correoValido && (
                <div className="text-danger small mt-1">Solo se aceptan correos @unsaac.edu.pe</div>
              )}
            </div>

            <div className="mb-2">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <input
                  type={verContrasena ? "text" : "password"}
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  disabled={bloqueado}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  tabIndex={-1}
                  onClick={() => setVerContrasena((v) => !v)}
                >
                  <i className={`bi bi-eye${verContrasena ? "-slash" : ""}`}></i>
                </button>
              </div>
            </div>

            {intentosFallidos > 0 && intentosFallidos < 5 && !bloqueado && (
              <p className="mb-3 small text-secondary">Intento {intentosFallidos} de 5</p>
            )}

            <button type="submit" className="btn btn-institucional w-100 py-2 mb-3" disabled={cargando || bloqueado}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>

            <div className="text-center mb-3">
              <Link to="/catalogo" className="small text-decoration-none">
                Consultar el catálogo TUPA sin iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

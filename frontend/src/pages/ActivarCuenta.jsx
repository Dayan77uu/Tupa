import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function ActivarCuenta() {
  const navigate = useNavigate();

  const [codigoalumno, setCodigoalumno] = useState("");
  const [dni, setDni] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [errorConfirmar, setErrorConfirmar] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError(null);
    setExito(null);
    setErrorConfirmar(null);

    if (nuevaContrasena !== confirmarContrasena) {
      setErrorConfirmar("Las contraseñas ingresadas no coinciden");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await api.post("/api/auth/activar-cuenta", {
        codigoalumno: codigoalumno.trim(),
        dni: dni.trim(),
        nueva_contrasena: nuevaContrasena,
      });

      setExito(`${respuesta.data.mensaje} Redirigiendo al login...`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo activar la cuenta.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="d-flex flex-wrap" style={{ minHeight: "100vh" }}>
      <div className="d-flex align-items-center justify-content-center p-4 p-lg-5 mx-auto" style={{ maxWidth: 480 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 className="text-center fw-semibold mb-2" style={{ fontSize: "1.5rem" }}>
            Activar mi cuenta
          </h2>
          <p className="text-center mb-4 text-secondary" style={{ fontSize: "0.875rem" }}>
            Crea una contraseña para acceder a la Plataforma TUPA. <strong>No es la
            contraseña de tu correo institucional real</strong> — es una contraseña
            nueva y propia de este sistema.
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

          <form onSubmit={manejarSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Código de alumno</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. 123456"
                value={codigoalumno}
                onChange={(e) => setCodigoalumno(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">DNI</label>
              <input
                type="text"
                className="form-control"
                placeholder="8 dígitos"
                maxLength={8}
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                autoComplete="new-password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
              {errorConfirmar && <div className="text-danger small mt-1">{errorConfirmar}</div>}
            </div>

            <button type="submit" className="btn btn-institucional w-100 py-2 mb-3" disabled={cargando}>
              {cargando ? "Activando..." : "Activar cuenta"}
            </button>

            <div className="text-center mb-3">
              <Link to="/login" className="small text-decoration-none">Volver a iniciar sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

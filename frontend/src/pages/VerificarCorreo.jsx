import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function VerificarCorreo() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [cargando, setCargando] = useState(true);
  const [exito, setExito] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!token) {
      setCargando(false);
      setExito(false);
      setMensaje("No se especificó un token de verificación.");
      return;
    }

    api
      .post("/api/auth/verificar-correo", { token })
      .then((r) => {
        setExito(true);
        setMensaje(r.data.mensaje);
      })
      .catch((err) => {
        setExito(false);
        setMensaje(err.response?.data?.error || "No se pudo verificar el correo.");
      })
      .finally(() => setCargando(false));
  }, [token]);

  return (
    <div className="d-flex flex-wrap" style={{ minHeight: "100vh" }}>
      <div className="d-flex align-items-center justify-content-center p-4 p-lg-5 mx-auto" style={{ maxWidth: 480 }}>
        <div style={{ width: "100%", maxWidth: 380 }} className="text-center">
          <h2 className="fw-semibold mb-4" style={{ fontSize: "1.5rem" }}>
            Verificación de correo
          </h2>

          {cargando && <p className="text-muted">Verificando tu correo...</p>}

          {!cargando && exito && (
            <div>
              <div className="alert alert-success d-flex align-items-start gap-2 mb-4">
                <i className="bi bi-check-circle mt-1"></i>
                <span>{mensaje}</span>
              </div>
              <Link to="/login" className="btn btn-institucional w-100">Ir a iniciar sesión</Link>
            </div>
          )}

          {!cargando && !exito && (
            <div>
              <div className="alert alert-danger d-flex align-items-start gap-2 mb-4">
                <i className="bi bi-exclamation-circle mt-1"></i>
                <span>{mensaje}</span>
              </div>
              <Link to="/registro" className="btn btn-outline-secondary w-100">Volver a registrarme</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

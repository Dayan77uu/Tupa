import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function FichaTramite() {
  const { codigo } = useParams();
  const [ficha, setFicha] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);

    api
      .get(`/api/catalogo/${encodeURIComponent(codigo)}`)
      .then((r) => {
        if (activo) setFicha(r.data);
      })
      .catch((err) => {
        if (activo) setError(err.response?.data?.error || "No se pudo cargar la ficha.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [codigo]);

  if (cargando) return <div className="container py-4 text-muted">Cargando ficha...</div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!ficha) return null;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-start justify-content-between mb-2">
                <span className="badge border text-dark bg-white">{ficha.codigo}</span>
                <span className="badge badge-gratuito">Disponible</span>
              </div>
              <h2 className="titulo-institucional mb-3">{ficha.nombre}</h2>
              <p className="text-muted mb-0">{ficha.descripcion || ""}</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h3 className="h6 d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-check-circle"></i> Requisitos
              </h3>
              <ul className="list-unstyled mb-0">
                {ficha.requisitos.length === 0 ? (
                  <li className="text-muted">Sin requisitos registrados.</li>
                ) : (
                  ficha.requisitos.map((r, i) => (
                    <li key={i} className="d-flex align-items-start gap-3 mb-3">
                      <div className="icono-requisito">{i + 1}</div>
                      <span className="small">{r}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body p-4">
              <h3 className="h6 mb-3">Información rápida</h3>

              <div className="d-flex align-items-start gap-3 mb-3">
                <i className="bi bi-cash-stack mt-1"></i>
                <div>
                  <p className="mb-0 fw-medium small">Costo</p>
                  <p className="mb-0 text-muted small">{ficha.costo_resumen}</p>
                </div>
              </div>
              <hr />
              <div className="d-flex align-items-start gap-3 mb-3">
                <i className="bi bi-clock mt-1"></i>
                <div>
                  <p className="mb-0 fw-medium small">Plazo de atención</p>
                  <p className="mb-0 text-muted small">
                    {ficha.plazo_dias_habiles ? `${ficha.plazo_dias_habiles} días hábiles` : "No especificado"}
                  </p>
                </div>
              </div>
              <hr />
              <div className="d-flex align-items-start gap-3 mb-3">
                <i className="bi bi-building mt-1"></i>
                <div>
                  <p className="mb-0 fw-medium small">Oficina responsable</p>
                  <p className="mb-0 text-muted small">
                    {ficha.oficinas_responsables.length > 0 ? ficha.oficinas_responsables.join(", ") : "No especificado"}
                  </p>
                </div>
              </div>
              <hr />

              <Link to={`/solicitud/${encodeURIComponent(codigo)}`} className="btn btn-institucional w-100 mb-2">
                Iniciar trámite
              </Link>
              <Link to="/catalogo" className="btn btn-outline-secondary w-100">
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

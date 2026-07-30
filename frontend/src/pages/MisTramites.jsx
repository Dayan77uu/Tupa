import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";
import api from "../services/api";

const ESTADO_LABEL = {
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  OBSERVADO: "Observado",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

export default function MisTramites() {
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [expedientes, setExpedientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState(null);
  const [nroSeleccionado, setNroSeleccionado] = useState(null);
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    modalInstance.current = new Modal(modalRef.current);
  }, []);

  useEffect(() => {
    api
      .get("/api/mis-expedientes")
      .then((r) => setExpedientes(r.data.expedientes))
      .catch((err) => setErrorGeneral(err.response?.data?.error || "No se pudieron cargar tus trámites."))
      .finally(() => setCargando(false));
  }, []);

  async function mostrarHistorial(nro) {
    setNroSeleccionado(nro);
    setCargandoHistorial(true);
    setErrorHistorial(null);
    setHistorial([]);
    modalInstance.current.show();

    try {
      const respuesta = await api.get(`/api/expedientes/${nro}/historial`);
      setHistorial(respuesta.data.historial);
    } catch (err) {
      setErrorHistorial(err.response?.data?.error || "No se pudo cargar el historial.");
    } finally {
      setCargandoHistorial(false);
    }
  }

  if (cargando) return <div className="container py-4 text-muted">Cargando...</div>;

  return (
    <div className="container py-4">
      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

      {!errorGeneral && expedientes.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-folder2-open" style={{ fontSize: "2.5rem", color: "#6c757d" }}></i>
          <h2 className="h6 text-muted mt-3 mb-1">Aún no tienes trámites registrados</h2>
          <Link to="/catalogo" className="btn btn-institucional btn-sm mt-2">Registrar un trámite</Link>
        </div>
      )}

      <div className="row g-3">
        {expedientes.map((e) => (
          <div key={e.nro_expediente} className="col-md-6 col-lg-4">
            <div className={`card h-100 tarjeta-expediente estado-${e.color}`}>
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <span className="badge border text-dark bg-white">{e.nro_expediente}</span>
                  <span className={`badge badge-estado-${e.color}`}>{e.estado_label}</span>
                </div>
                <h3 className="h6 mb-2">{e.nombre_tramite || "Trámite"}</h3>
                <p className="text-muted small mb-1">
                  <i className="bi bi-calendar3"></i> {e.fecha_registro ? e.fecha_registro.split("T")[0] : ""}
                </p>
                <p className="text-muted small mb-3">
                  <i className="bi bi-clock-history"></i> {e.dias_transcurridos} día(s) transcurridos
                </p>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={() => mostrarHistorial(e.nro_expediente)}
                >
                  Ver historial
                </button>
                {e.estado === "OBSERVADO" && (
                  <Link to={`/subsanar/${encodeURIComponent(e.nro_expediente)}`} className="btn btn-institucional btn-sm w-100 mt-2">
                    <i className="bi bi-upload"></i> Subsanar documentos
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="h6 mb-0">Historial — {nroSeleccionado}</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {cargandoHistorial && <p className="text-muted small">Cargando...</p>}
              {errorHistorial && <div className="alert alert-danger mb-0">{errorHistorial}</div>}
              {!cargandoHistorial && !errorHistorial && historial.length === 0 && (
                <p className="text-muted small mb-0">Sin movimientos registrados todavía.</p>
              )}
              {historial.map((m, i) => (
                <div key={i} className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                  <div className="icono-requisito"><i className="bi bi-arrow-right"></i></div>
                  <div>
                    <p className="mb-1 small fw-medium">
                      {m.estado_anterior ? `${ESTADO_LABEL[m.estado_anterior] || m.estado_anterior} → ` : ""}
                      {ESTADO_LABEL[m.estado_nuevo] || m.estado_nuevo}
                    </p>
                    {m.comentario && <p className="mb-1 small text-muted">{m.comentario}</p>}
                    <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                      {(m.fecha_hora || "").replace("T", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

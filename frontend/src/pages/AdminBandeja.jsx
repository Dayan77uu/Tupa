import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";
import api from "../services/api";

const PLAZO_COLOR = { verde: "#10B981", amarillo: "#F59E0B", rojo: "#EF4444" };

export default function AdminBandeja() {
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [expedientes, setExpedientes] = useState([]);

  const [nroEnAccion, setNroEnAccion] = useState(null);
  const [requisitosObservar, setRequisitosObservar] = useState([]);
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState("");
  const [comentarioObservar, setComentarioObservar] = useState("");
  const [errorObservar, setErrorObservar] = useState(null);

  const [motivoRechazar, setMotivoRechazar] = useState("");
  const [errorRechazar, setErrorRechazar] = useState(null);

  const modalObservarRef = useRef(null);
  const modalRechazarRef = useRef(null);
  const instanciaObservar = useRef(null);
  const instanciaRechazar = useRef(null);

  useEffect(() => {
    instanciaObservar.current = new Modal(modalObservarRef.current);
    instanciaRechazar.current = new Modal(modalRechazarRef.current);
  }, []);

  async function cargarBandeja() {
    setCargando(true);
    setErrorGeneral(null);
    try {
      const respuesta = await api.get("/api/admin/bandeja");
      setExpedientes(respuesta.data.expedientes);
    } catch (err) {
      setErrorGeneral(err.response?.data?.error || "No se pudo cargar la bandeja.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarBandeja();
  }, []);

  async function aprobar(nro) {
    if (!window.confirm(`¿Aprobar el expediente ${nro}?`)) return;
    try {
      await api.post(`/api/admin/expedientes/${nro}/decision`, { accion: "aprobar" });
      cargarBandeja();
    } catch (err) {
      window.alert(err.response?.data?.error || "No se pudo aprobar.");
    }
  }

  async function abrirObservar(exp) {
    setNroEnAccion(exp.nro_expediente);
    setErrorObservar(null);
    setComentarioObservar("");
    setRequisitosObservar([]);
    instanciaObservar.current.show();

    const respuesta = await api.get(`/api/tramites/${encodeURIComponent(exp.ccodigo)}/checklist`);
    setRequisitosObservar(respuesta.data.requisitos);
    setRequisitoSeleccionado(respuesta.data.requisitos[0]?.id_requisito ?? "");
  }

  async function confirmarObservar() {
    try {
      await api.post(`/api/admin/expedientes/${nroEnAccion}/decision`, {
        accion: "observar",
        comentario: comentarioObservar.trim(),
        id_requisito: Number(requisitoSeleccionado),
      });
      instanciaObservar.current.hide();
      cargarBandeja();
    } catch (err) {
      setErrorObservar(err.response?.data?.error);
    }
  }

  function abrirRechazar(nro) {
    setNroEnAccion(nro);
    setErrorRechazar(null);
    setMotivoRechazar("");
    instanciaRechazar.current.show();
  }

  async function confirmarRechazar() {
    try {
      await api.post(`/api/admin/expedientes/${nroEnAccion}/decision`, {
        accion: "rechazar",
        motivo: motivoRechazar.trim(),
      });
      instanciaRechazar.current.hide();
      cargarBandeja();
    } catch (err) {
      setErrorRechazar(err.response?.data?.error);
    }
  }

  if (cargando) return <div className="container py-4 text-muted">Cargando...</div>;

  return (
    <div className="container py-4">
      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

      {!errorGeneral && expedientes.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox" style={{ fontSize: "2.5rem", color: "#6c757d" }}></i>
          <h2 className="h6 text-muted mt-3 mb-0">No hay expedientes pendientes en su oficina</h2>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {expedientes.map((e) => {
          const colorEstado = e.color_plazo === "rojo" ? "rojo" : e.color_plazo === "amarillo" ? "naranja" : "verde";
          return (
          <div key={e.nro_expediente} className={`card tarjeta-expediente estado-${colorEstado}`}>
            <div className="card-body p-4">
              <div className="row align-items-center g-3">
                <div className="col-md-3">
                  <span className="badge border text-dark bg-white d-block mb-1" style={{ width: "fit-content" }}>
                    {e.nro_expediente}
                  </span>
                  <p className="mb-0 small fw-medium">{e.nombre_tramite || ""}</p>
                </div>
                <div className="col-md-2">
                  <span className={`badge badge-estado-${colorEstado}`}>{e.estado_label}</span>
                </div>
                <div className="col-md-2">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: 10, height: 10, background: PLAZO_COLOR[e.color_plazo] }}
                  ></span>{" "}
                  <span className="small text-muted">{e.fecha_vencimiento || "sin plazo"}</span>
                </div>
                <div className="col-md-5 d-flex gap-2 justify-content-end flex-wrap">
                  <Link to={`/admin/expedientes/${encodeURIComponent(e.nro_expediente)}`} className="btn btn-outline-secondary btn-sm">
                    Ver detalle
                  </Link>
                  <button type="button" className="btn btn-outline-success btn-sm" onClick={() => aprobar(e.nro_expediente)}>
                    Aprobar
                  </button>
                  <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => abrirObservar(e)}>
                    Observar
                  </button>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => abrirRechazar(e.nro_expediente)}>
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <div className="modal fade" ref={modalObservarRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="h6 mb-0">Observar expediente</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label small">Documento observado</label>
                <select className="form-select" value={requisitoSeleccionado} onChange={(e) => setRequisitoSeleccionado(e.target.value)}>
                  {requisitosObservar.map((r) => (
                    <option key={r.id_requisito} value={r.id_requisito}>{r.descripcion}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label small">Comentario (mínimo 10 caracteres)</label>
                <textarea className="form-control" rows="3" value={comentarioObservar} onChange={(e) => setComentarioObservar(e.target.value)} />
              </div>
              {errorObservar && <div className="alert alert-danger py-2 small">{errorObservar}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-institucional" onClick={confirmarObservar}>Registrar observación</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" ref={modalRechazarRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="h6 mb-0">Rechazar expediente</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <label className="form-label small">Motivo (mínimo 20 caracteres)</label>
              <textarea className="form-control" rows="3" value={motivoRechazar} onChange={(e) => setMotivoRechazar(e.target.value)} />
              {errorRechazar && <div className="alert alert-danger py-2 small mt-2">{errorRechazar}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-institucional" onClick={confirmarRechazar}>Confirmar rechazo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

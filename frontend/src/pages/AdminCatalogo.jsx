import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import api from "../services/api";

export default function AdminCatalogo() {
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [tramites, setTramites] = useState([]);
  const [oficinas, setOficinas] = useState([]);

  const [ccodigoEnEdicion, setCcodigoEnEdicion] = useState(null);
  const [plazo, setPlazo] = useState("");
  const [costo, setCosto] = useState("");
  const [oficina, setOficina] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [resolucion, setResolucion] = useState("");
  const [errorEditar, setErrorEditar] = useState(null);

  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    modalInstance.current = new Modal(modalRef.current);
  }, []);

  async function cargarCatalogo() {
    setCargando(true);
    setErrorGeneral(null);
    try {
      const respuesta = await api.get("/api/admin/catalogo");
      setTramites(respuesta.data.tramites);
    } catch (err) {
      setErrorGeneral(err.response?.data?.error || "No se pudo cargar el catálogo.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    api.get("/api/catalogo/filtros").then((r) => setOficinas(r.data.unidades || []));
    cargarCatalogo();
  }, []);

  function abrirEditar(ccodigo) {
    setCcodigoEnEdicion(ccodigo);
    setPlazo("");
    setCosto("");
    setOficina("");
    setDescripcion("");
    setResolucion("");
    setErrorEditar(null);
    modalInstance.current.show();
  }

  async function guardarCambios() {
    const body = { numero_resolucion_rectoral: resolucion };
    if (plazo) body.plazo_dias = Number(plazo);
    if (costo) body.costo = Number(costo);
    if (oficina) body.oficina_responsable = Number(oficina);
    if (descripcion) body.descripcion = descripcion;

    try {
      await api.put(`/api/admin/catalogo/${ccodigoEnEdicion}`, body);
      modalInstance.current.hide();
      cargarCatalogo();
    } catch (err) {
      setErrorEditar(err.response?.data?.error);
    }
  }

  async function toggleEstado(tramite) {
    const nuevoEstado = tramite.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    const resolucionPrompt = window.prompt(
      `N° de resolución rectoral para ${nuevoEstado === "ACTIVO" ? "activar" : "desactivar"} este trámite:`
    );
    if (!resolucionPrompt) return;

    try {
      await api.patch(`/api/admin/catalogo/${tramite.ccodigo}/estado`, {
        estado: nuevoEstado,
        numero_resolucion_rectoral: resolucionPrompt,
      });
      cargarCatalogo();
    } catch (err) {
      window.alert(err.response?.data?.error);
    }
  }

  if (cargando) return <div className="container py-4 text-muted">Cargando...</div>;
  if (errorGeneral) return <div className="container py-4"><div className="alert alert-danger">{errorGeneral}</div></div>;

  return (
    <div className="container py-4">
      <div className="table-responsive">
        <table className="table table-hover bg-white">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Plazo (días)</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {tramites.map((t) => (
              <tr key={t.ccodigo}>
                <td><span className="badge border text-dark bg-white">{t.ccodigo}</span></td>
                <td className="small">{t.nombre}</td>
                <td>{t.plazo_dias ?? "—"}</td>
                <td>
                  {t.estado === "ACTIVO" ? (
                    <span className="badge bg-success">Activo</span>
                  ) : (
                    <span className="badge bg-danger">Inactivo</span>
                  )}
                </td>
                <td className="text-end">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => abrirEditar(t.ccodigo)}>
                    Editar
                  </button>{" "}
                  <button
                    type="button"
                    className={`btn btn-outline-${t.estado === "ACTIVO" ? "danger" : "success"} btn-sm`}
                    onClick={() => toggleEstado(t)}
                  >
                    {t.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="h6 mb-0">Editar {ccodigoEnEdicion}</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small">Plazo (días hábiles)</label>
                  <input type="number" className="form-control" min="1" value={plazo} onChange={(e) => setPlazo(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Costo (S/)</label>
                  <input type="number" step="0.01" className="form-control" min="0" value={costo} onChange={(e) => setCosto(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Oficina responsable</label>
                  <select className="form-select" value={oficina} onChange={(e) => setOficina(e.target.value)}>
                    <option value="">Sin cambio</option>
                    {oficinas.map((o) => (
                      <option key={o.id} value={o.id}>{o.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small">Descripción</label>
                  <textarea className="form-control" rows="2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">N° de resolución rectoral (obligatorio)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="R-XXXX-2026-UNSAAC"
                    value={resolucion}
                    onChange={(e) => setResolucion(e.target.value)}
                  />
                </div>
              </div>
              {errorEditar && <div className="alert alert-danger py-2 small mt-3">{errorEditar}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-institucional" onClick={guardarCambios}>Guardar cambios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

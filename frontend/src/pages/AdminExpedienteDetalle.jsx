import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ESTADO_LABEL_COLOR = {
  PENDIENTE: "gris",
  EN_REVISION: "azul",
  OBSERVADO: "naranja",
  APROBADO: "verde",
  RECHAZADO: "rojo",
};

export default function AdminExpedienteDetalle() {
  const { nro } = useParams();
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [oficinas, setOficinas] = useState([]);
  const [oficinaDestino, setOficinaDestino] = useState("");
  const [comentarioDerivar, setComentarioDerivar] = useState("");
  const [errorDerivar, setErrorDerivar] = useState(null);
  const [exitoDerivar, setExitoDerivar] = useState(null);
  const [errorVoucher, setErrorVoucher] = useState(null);
  const [estadoVoucher, setEstadoVoucher] = useState(null);

  async function cargarDetalle() {
    setCargando(true);
    setErrorGeneral(null);
    try {
      const respuesta = await api.get(`/api/admin/expedientes/${nro}`);
      setDetalle(respuesta.data);
      setEstadoVoucher(respuesta.data.voucher.estado);

      const oficinasResp = await api.get(`/api/admin/expedientes/${nro}/oficinas-validas`);
      setOficinas(oficinasResp.data.oficinas || []);
      if (oficinasResp.data.oficinas?.length > 0) {
        setOficinaDestino(String(oficinasResp.data.oficinas[0].id));
      }
    } catch (err) {
      setErrorGeneral(err.response?.data?.error || "No se pudo cargar el expediente.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nro]);

  async function verDocumento(idDocumento) {
    try {
      const respuesta = await api.get(`/api/admin/documentos/${idDocumento}`, { responseType: "blob" });
      const url = URL.createObjectURL(respuesta.data);
      window.open(url, "_blank");
    } catch {
      window.alert("No se pudo cargar el documento.");
    }
  }

  async function validarVoucher(resultado, motivo) {
    setErrorVoucher(null);
    try {
      const respuesta = await api.post(`/api/admin/expedientes/${nro}/voucher/validar`, { resultado, motivo });
      setEstadoVoucher(respuesta.data.estado_voucher);
    } catch (err) {
      setErrorVoucher(err.response?.data?.error);
    }
  }

  async function derivar() {
    setErrorDerivar(null);
    setExitoDerivar(null);
    try {
      await api.post(`/api/admin/expedientes/${nro}/derivar`, {
        oficina_destino: Number(oficinaDestino),
        comentario: comentarioDerivar.trim(),
      });
      setExitoDerivar("Expediente derivado correctamente.");
      setTimeout(() => {
        window.location.href = "/admin/bandeja";
      }, 1200);
    } catch (err) {
      setErrorDerivar(err.response?.data?.error);
    }
  }

  if (cargando) return <div className="container py-4 text-muted">Cargando...</div>;
  if (errorGeneral) return <div className="container py-4"><div className="alert alert-danger">{errorGeneral}</div></div>;
  if (!detalle) return null;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-start justify-content-between mb-2">
                <span className="badge border text-dark bg-white">{detalle.nro_expediente}</span>
                <span className={`badge badge-estado-${ESTADO_LABEL_COLOR[detalle.estado] || "gris"}`}>{detalle.estado_label}</span>
              </div>
              <h2 className="mb-1">{detalle.nombre_tramite || ""}</h2>
              <p className="text-muted small mb-0">
                Solicitante: {detalle.solicitante.nombre || ""} ({detalle.solicitante.correo || ""})
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h3 className="h6 mb-3">Documentos adjuntos</h3>
              {detalle.documentos.map((d) => (
                <div key={d.id_documento} className="d-flex align-items-center justify-content-between border-bottom py-2">
                  <div>
                    <p className="mb-0 small fw-medium">{d.descripcion_requisito || "Documento"}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{d.nombre_archivo}</p>
                  </div>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => verDocumento(d.id_documento)}>
                    <i className="bi bi-eye"></i> Ver
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h3 className="h6 mb-3">Historial</h3>
              {detalle.historial.length === 0 ? (
                <p className="text-muted small mb-0">Sin movimientos.</p>
              ) : (
                detalle.historial.map((m, i) => (
                  <div key={i} className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                    <div className="icono-requisito"><i className="bi bi-arrow-right"></i></div>
                    <div>
                      <p className="mb-1 small fw-medium">
                        {m.oficina_nueva
                          ? `Derivado de oficina ${m.oficina_anterior} a oficina ${m.oficina_nueva}`
                          : `${m.estado_anterior || ""} → ${m.estado_nuevo}`}
                      </p>
                      {m.comentario && <p className="mb-1 small text-muted">{m.comentario}</p>}
                      <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{(m.fecha_hora || "").replace("T", " ")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body p-4">
              <h3 className="h6 mb-3">Voucher de pago</h3>
              <p className="mb-1 small">N°: {detalle.voucher.numero || "—"}</p>
              <p className="mb-1 small">Monto: {detalle.voucher.monto != null ? `S/ ${detalle.voucher.monto.toFixed(2)}` : "—"}</p>
              <p className="mb-3 small">Estado: {estadoVoucher || "Sin registrar"}</p>
              {detalle.voucher.estado && (
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-success btn-sm flex-fill" onClick={() => validarVoucher("validado")}>
                    Validar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm flex-fill"
                    onClick={() => {
                      const motivo = window.prompt("Motivo del rechazo del voucher:");
                      if (motivo) validarVoucher("rechazado", motivo);
                    }}
                  >
                    Rechazar
                  </button>
                </div>
              )}
              {errorVoucher && <div className="alert alert-danger py-2 small mt-2">{errorVoucher}</div>}
            </div>
          </div>

          <div className="card">
            <div className="card-body p-4">
              <h3 className="h6 mb-3">Derivar a otra oficina</h3>
              {oficinas.length === 0 ? (
                <p className="text-muted small">No hay oficinas de destino configuradas</p>
              ) : (
                <>
                  <select className="form-select mb-2" value={oficinaDestino} onChange={(e) => setOficinaDestino(e.target.value)}>
                    {oficinas.map((o) => (
                      <option key={o.id} value={o.id}>{o.nombre}</option>
                    ))}
                  </select>
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    placeholder="Comentario de derivación (mínimo 15 caracteres)"
                    value={comentarioDerivar}
                    onChange={(e) => setComentarioDerivar(e.target.value)}
                  />
                  <button type="button" className="btn btn-institucional w-100" onClick={derivar}>Derivar</button>
                </>
              )}
              {errorDerivar && <div className="alert alert-danger py-2 small mt-2">{errorDerivar}</div>}
              {exitoDerivar && <div className="alert alert-success py-2 small mt-2">{exitoDerivar}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

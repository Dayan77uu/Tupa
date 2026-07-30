import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function RequisitoItem({ req, estadoArchivo, onArchivoElegido }) {
  return (
    <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
      <div className="icono-requisito">
        {estadoArchivo?.subido ? <i className="bi bi-check-lg"></i> : <i className="bi bi-hourglass-split"></i>}
      </div>
      <div className="flex-grow-1">
        <p className="mb-1 small">
          {req.descripcion}
          {!req.obligatorio && <span className="text-muted"> (opcional)</span>}
        </p>
        <input
          type="file"
          className="form-control form-control-sm"
          accept={req.formatos_permitidos.map((f) => "." + f).join(",")}
          onChange={(e) => {
            const archivo = e.target.files[0];
            if (archivo) onArchivoElegido(req.id_requisito, archivo);
          }}
        />
        <p className="small text-muted mb-0 mt-1">
          Formatos: {req.formatos_permitidos.join(", ")} — máx. {req.tamano_max_mb} MB
        </p>
        {estadoArchivo?.mensaje && (
          <p className={`small mb-0 mt-1 text-${estadoArchivo.tipo}`}>{estadoArchivo.mensaje}</p>
        )}
      </div>
    </div>
  );
}

export default function Solicitud() {
  const { codigo } = useParams();

  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [nombreTramite, setNombreTramite] = useState("");
  const [nroExpediente, setNroExpediente] = useState(null);
  const [requisitos, setRequisitos] = useState([]);
  const [estadoArchivos, setEstadoArchivos] = useState({});
  const [completo, setCompleto] = useState(false);
  const [faltantes, setFaltantes] = useState([]);

  const [voucherNumero, setVoucherNumero] = useState("");
  const [voucherMonto, setVoucherMonto] = useState("");
  const [voucherFecha, setVoucherFecha] = useState("");
  const [estadoVoucher, setEstadoVoucher] = useState(null);
  const [enviandoVoucher, setEnviandoVoucher] = useState(false);

  const [errorConfirmar, setErrorConfirmar] = useState(null);
  const [exitoConfirmar, setExitoConfirmar] = useState(null);
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  useEffect(() => {
    async function iniciar() {
      try {
        const [perfilResp] = await Promise.allSettled([api.get("/api/mi-perfil")]);
        if (perfilResp.status === "fulfilled") setPerfil(perfilResp.value.data);

        try {
          const fichaResp = await api.get(`/api/catalogo/${encodeURIComponent(codigo)}`);
          setNombreTramite(fichaResp.data.nombre);
        } catch {
          // El nombre del tramite es solo informativo.
        }

        const solicitudResp = await api.post("/api/solicitudes", { id_tramite: codigo });
        const nro = solicitudResp.data.nro_expediente;
        setNroExpediente(nro);

        const checklistResp = await api.get(`/api/tramites/${encodeURIComponent(codigo)}/checklist`);
        setRequisitos(checklistResp.data.requisitos);

        if (checklistResp.data.requisitos.length === 0) {
          setCompleto(true);
        } else {
          const estadoResp = await api.get(`/api/solicitudes/${nro}/estado-checklist`);
          setCompleto(estadoResp.data.completo);
          setFaltantes(estadoResp.data.faltantes);
        }
      } catch (err) {
        setErrorGeneral(err.response?.data?.error || "No se pudo registrar la solicitud.");
      } finally {
        setCargando(false);
      }
    }
    iniciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  async function subirArchivo(idRequisito, archivo) {
    setEstadoArchivos((prev) => ({
      ...prev,
      [idRequisito]: { ...prev[idRequisito], mensaje: "Subiendo...", tipo: "muted" },
    }));

    const formData = new FormData();
    formData.append("id_requisito", idRequisito);
    formData.append("archivo", archivo);

    try {
      const respuesta = await api.post(`/api/solicitudes/${nroExpediente}/documentos`, formData);
      const nuevoEstado = {};
      respuesta.data.requisitos.forEach((r) => {
        nuevoEstado[r.id_requisito] = { subido: r.subido };
      });
      setEstadoArchivos((prev) => ({
        ...prev,
        ...nuevoEstado,
        [idRequisito]: { ...nuevoEstado[idRequisito], mensaje: "Documento cargado correctamente.", tipo: "success" },
      }));
      setCompleto(respuesta.data.completo);
      setFaltantes(respuesta.data.faltantes);
    } catch (err) {
      setEstadoArchivos((prev) => ({
        ...prev,
        [idRequisito]: { subido: false, mensaje: err.response?.data?.error || "No se pudo subir el archivo.", tipo: "danger" },
      }));
    }
  }

  async function registrarVoucher(evento) {
    evento.preventDefault();
    setEnviandoVoucher(true);
    setEstadoVoucher(null);

    try {
      await api.post(`/api/solicitudes/${nroExpediente}/voucher`, {
        numero_voucher: voucherNumero,
        monto: parseFloat(voucherMonto),
        fecha_pago: voucherFecha,
      });
      setEstadoVoucher({ texto: "Voucher pendiente de validación por Tesorería.", tipo: "success" });
    } catch (err) {
      setEstadoVoucher({ texto: err.response?.data?.error || "No se pudo registrar el voucher.", tipo: "danger" });
    } finally {
      setEnviandoVoucher(false);
    }
  }

  async function enviarSolicitud() {
    setErrorConfirmar(null);
    setExitoConfirmar(null);
    setEnviandoSolicitud(true);

    try {
      const respuesta = await api.post(`/api/solicitudes/${nroExpediente}/confirmar`);
      setExitoConfirmar(`Solicitud recibida. Número de expediente: ${respuesta.data.nro_expediente}`);
      setSolicitudEnviada(true);
    } catch (err) {
      const cuerpo = err.response?.data || {};
      setErrorConfirmar(`${cuerpo.error || ""} ${(cuerpo.faltantes || []).join(", ")}`.trim());
    } finally {
      setEnviandoSolicitud(false);
    }
  }

  if (cargando) return <div className="container py-4 text-muted">Cargando...</div>;
  if (errorGeneral) return <div className="container py-4"><div className="alert alert-danger">{errorGeneral}</div></div>;

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-file-earmark-check"></i>
        <span>Expediente <strong>{nroExpediente}</strong> — trámite: <strong>{nombreTramite}</strong></span>
      </div>

      <div className="card mb-4">
        <div className="card-body p-4">
          <h2 className="h6 mb-3">Datos del solicitante</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <p className="mb-0 small fw-medium">Nombre</p>
              <p className="mb-0 small text-muted">{perfil?.nombre || "—"}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-0 small fw-medium">Correo</p>
              <p className="mb-0 small text-muted">{perfil?.correo || "—"}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-0 small fw-medium">Carrera</p>
              <p className="mb-0 small text-muted">{perfil?.carrera || "No especificado"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body p-4">
          <h2 className="h6 d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-check-circle"></i> Checklist de documentos
          </h2>
          {requisitos.length === 0 ? (
            <p className="text-muted small mb-0">Este trámite no tiene requisitos registrados.</p>
          ) : (
            requisitos.map((req) => (
              <RequisitoItem
                key={req.id_requisito}
                req={req}
                estadoArchivo={estadoArchivos[req.id_requisito]}
                onArchivoElegido={subirArchivo}
              />
            ))
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body p-4">
          <h2 className="h6 d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-cash-coin"></i> Voucher de pago
          </h2>
          <form onSubmit={registrarVoucher} className="row g-3">
            <div className="col-md-4">
              <label className="form-label small">N° de voucher</label>
              <input type="text" className="form-control" value={voucherNumero} onChange={(e) => setVoucherNumero(e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Monto (S/)</label>
              <input type="number" step="0.01" min="0" className="form-control" value={voucherMonto} onChange={(e) => setVoucherMonto(e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Fecha de pago</label>
              <input type="date" className="form-control" value={voucherFecha} onChange={(e) => setVoucherFecha(e.target.value)} required />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-outline-secondary btn-sm" disabled={enviandoVoucher}>
                {enviandoVoucher ? "Registrando..." : "Registrar voucher"}
              </button>
              {estadoVoucher && (
                <span className={`ms-2 small text-${estadoVoucher.tipo}`}>{estadoVoucher.texto}</span>
              )}
            </div>
          </form>
        </div>
      </div>

      {errorConfirmar && <div className="alert alert-danger">{errorConfirmar}</div>}
      {exitoConfirmar && <div className="alert alert-success">{exitoConfirmar}</div>}

      <button
        type="button"
        className="btn btn-institucional w-100"
        disabled={!completo || enviandoSolicitud || solicitudEnviada}
        onClick={enviarSolicitud}
      >
        {solicitudEnviada ? "Solicitud enviada" : enviandoSolicitud ? "Enviando..." : "Enviar solicitud"}
      </button>
      <p className="text-muted small text-center mt-2">
        {completo ? "Todos los documentos obligatorios están completos." : `Faltan: ${faltantes.join(", ")}`}
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ESTADO_LABEL = {
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  OBSERVADO: "Observado",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

export default function Subsanar() {
  const { nro } = useParams();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [idRequisitoObservado, setIdRequisitoObservado] = useState(null);
  const [comentario, setComentario] = useState("");
  const [descripcionRequisito, setDescripcionRequisito] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [errorSubsanar, setErrorSubsanar] = useState(null);
  const [exitoSubsanar, setExitoSubsanar] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api
      .get(`/api/expedientes/${nro}/observacion`)
      .then((r) => {
        setIdRequisitoObservado(r.data.id_requisito_observado);
        setComentario(r.data.comentario || "Sin descripción registrada.");
        setDescripcionRequisito(r.data.descripcion_requisito || "Documento observado");
      })
      .catch((err) => setErrorGeneral(err.response?.data?.error || "No se pudo cargar la observación."))
      .finally(() => setCargando(false));
  }, [nro]);

  async function reenviar() {
    if (!archivo) return;
    setErrorSubsanar(null);
    setExitoSubsanar(null);
    setEnviando(true);

    const formData = new FormData();
    formData.append("id_requisito", idRequisitoObservado);
    formData.append("archivo", archivo);

    try {
      const respuesta = await api.post(`/api/expedientes/${nro}/subsanar`, formData);
      setExitoSubsanar(`Expediente reenviado. Nuevo estado: ${ESTADO_LABEL[respuesta.data.estado] || respuesta.data.estado}.`);
      setTimeout(() => navigate("/mis-tramites"), 1500);
    } catch (err) {
      setErrorSubsanar(err.response?.data?.error || "No se pudo subsanar el documento.");
      setEnviando(false);
    }
  }

  if (cargando) return <div className="container py-4 text-muted">Cargando...</div>;
  if (errorGeneral) return <div className="container py-4"><div className="alert alert-danger">{errorGeneral}</div></div>;

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <div className="alert mb-4" style={{ backgroundColor: "#FEF3C7", border: "1px solid #FCD34D", color: "#92400E" }}>
        <div className="d-flex align-items-start gap-2">
          <i className="bi bi-exclamation-triangle mt-1"></i>
          <div>
            <p className="mb-1 fw-medium">Observación registrada</p>
            <p className="mb-0 small">{comentario}</p>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body p-4">
          <p className="mb-1 fw-medium small">Documento a reemplazar</p>
          <p className="mb-3 text-muted small">{descripcionRequisito}</p>

          <input
            type="file"
            className="form-control mb-2"
            onChange={(e) => setArchivo(e.target.files[0] || null)}
          />
        </div>
      </div>

      {errorSubsanar && <div className="alert alert-danger">{errorSubsanar}</div>}
      {exitoSubsanar && <div className="alert alert-success">{exitoSubsanar}</div>}

      <button type="button" className="btn btn-institucional w-100" disabled={!archivo || enviando} onClick={reenviar}>
        {enviando ? "Enviando..." : "Reenviar expediente"}
      </button>
    </div>
  );
}

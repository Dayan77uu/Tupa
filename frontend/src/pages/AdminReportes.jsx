import { useEffect, useState } from "react";
import api from "../services/api";
import { obtenerRolDelToken } from "../utils/storage";
import { ROL_ADMINISTRADOR } from "../utils/roles";

export default function AdminReportes() {
  const esAdministrador = obtenerRolDelToken() === ROL_ADMINISTRADOR;

  const [periodo, setPeriodo] = useState("mes");
  const [estado, setEstado] = useState("");
  const [oficina, setOficina] = useState("");
  const [oficinas, setOficinas] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [sinDatosMsg, setSinDatosMsg] = useState(null);
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    if (esAdministrador) {
      api.get("/api/catalogo/filtros").then((r) => setOficinas(r.data.unidades || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function construirQuery() {
    const params = new URLSearchParams();
    params.set("periodo", periodo);
    if (estado) params.set("estado", estado);
    if (oficina) params.set("oficina", oficina);
    return params.toString();
  }

  async function generarReporte() {
    setCargando(true);
    setErrorGeneral(null);
    setSinDatosMsg(null);
    setReporte(null);

    try {
      const respuesta = await api.get(`/api/reportes?${construirQuery()}`);
      if (respuesta.data.sin_datos) {
        setSinDatosMsg(respuesta.data.mensaje);
      } else {
        setReporte(respuesta.data);
      }
    } catch (err) {
      setErrorGeneral(err.response?.data?.error || "No se pudo generar el reporte.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    generarReporte();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function exportar(formato) {
    try {
      const respuesta = await api.get(`/api/reportes/exportar?formato=${formato}&${construirQuery()}`, {
        responseType: "blob",
      });
      const contentType = respuesta.headers["content-type"] || "";
      if (contentType.includes("application/json")) {
        const texto = await respuesta.data.text();
        const datos = JSON.parse(texto);
        window.alert(datos.mensaje || "No hay datos para exportar en este período.");
        return;
      }
      const url = URL.createObjectURL(respuesta.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = formato === "excel" ? "reporte_tupa.xlsx" : "reporte_tupa.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.alert("No se pudo exportar el reporte.");
    }
  }

  const maximo = reporte ? Math.max(...reporte.top_5_procedimientos.map((i) => i.cantidad), 1) : 1;

  return (
    <div className="container py-4">
      <div className="card mb-4">
        <div className="card-body p-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label small">Período</label>
              <select className="form-select" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option value="semana">Última semana</option>
                <option value="mes">Último mes</option>
                <option value="trimestre">Último trimestre</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Estado</label>
              <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_REVISION">En revisión</option>
                <option value="OBSERVADO">Observado</option>
                <option value="APROBADO">Aprobado</option>
                <option value="RECHAZADO">Rechazado</option>
              </select>
            </div>
            {esAdministrador && (
              <div className="col-md-3">
                <label className="form-label small">Oficina (solo Administrador)</label>
                <select className="form-select" value={oficina} onChange={(e) => setOficina(e.target.value)}>
                  <option value="">Todas</option>
                  {oficinas.map((o) => (
                    <option key={o.id} value={o.id}>{o.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-md-3">
              <button type="button" className="btn btn-institucional w-100" onClick={generarReporte}>
                Generar reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {cargando && <div className="text-muted">Cargando...</div>}
      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}
      {sinDatosMsg && <div className="alert alert-secondary">{sinDatosMsg}</div>}

      {reporte && (
        <div>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card text-center"><div className="card-body"><p className="mb-1 small text-muted">Trámites atendidos</p><h3>{reporte.tramites_atendidos}</h3></div></div>
            </div>
            <div className="col-md-3">
              <div className="card text-center"><div className="card-body"><p className="mb-1 small text-muted">Tiempo promedio (días)</p><h3>{reporte.tiempo_promedio_dias ?? "—"}</h3></div></div>
            </div>
            <div className="col-md-3">
              <div className="card text-center"><div className="card-body"><p className="mb-1 small text-muted">Trámites vencidos</p><h3>{reporte.tramites_vencidos}</h3></div></div>
            </div>
            <div className="col-md-3">
              <div className="card text-center"><div className="card-body"><p className="mb-1 small text-muted">% cumplimiento</p><h3>{reporte.porcentaje_cumplimiento != null ? `${reporte.porcentaje_cumplimiento}%` : "—"}</h3></div></div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
              <h2 className="h6 mb-3">Top 5 procedimientos más solicitados</h2>
              {reporte.top_5_procedimientos.map((item, i) => {
                const porcentaje = maximo > 0 ? Math.round((item.cantidad / maximo) * 100) : 0;
                return (
                  <div key={i} className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>{item.nombre}</span>
                      <span className="fw-medium">{item.cantidad}</span>
                    </div>
                    <div className="progress" style={{ height: 10 }}>
                      <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${porcentaje}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => exportar("pdf")}>
              <i className="bi bi-file-earmark-pdf"></i> Exportar PDF
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => exportar("excel")}>
              <i className="bi bi-file-earmark-excel"></i> Exportar Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

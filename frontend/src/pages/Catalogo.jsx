import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const DEBOUNCE_MS = 300;

function esGratuito(costoResumen) {
  return /^S\/\s*0(\.00)?$/.test((costoResumen || "").trim());
}

function TarjetaTramite({ tramite }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 tarjeta-tramite">
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex align-items-start justify-content-between mb-2">
            <span className="badge border text-dark bg-white">{tramite.codigo}</span>
            {esGratuito(tramite.costo_resumen) ? (
              <span className="badge badge-gratuito">Gratuito</span>
            ) : (
              <span className="badge badge-costo">{tramite.costo_resumen}</span>
            )}
          </div>
          <h3 className="h6 mb-3">{tramite.nombre}</h3>
          <div className="mt-auto d-flex gap-2">
            <Link to={`/ficha/${encodeURIComponent(tramite.codigo)}`} className="btn btn-institucional btn-sm flex-fill">
              Ver detalle
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-sm flex-fill">
              Solicitar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const [buscador, setBuscador] = useState("");
  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [sinResultados, setSinResultados] = useState(false);
  const [errorConexion, setErrorConexion] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    api.get("/api/catalogo/filtros").then((r) => setUnidades(r.data.unidades || []));
  }, []);

  async function buscarCatalogo() {
    setCargando(true);
    setErrorConexion(false);
    setSinResultados(false);

    const parametros = new URLSearchParams();
    if (buscador.trim()) parametros.set("q", buscador.trim());
    if (filtroUnidad) parametros.set("unidad", filtroUnidad);

    try {
      const respuesta = await api.get(`/api/catalogo?${parametros.toString()}`);
      if (respuesta.data.resultados.length === 0) {
        setSinResultados(true);
        setSugerencias(respuesta.data.sugerencias || []);
        setResultados([]);
      } else {
        setResultados(respuesta.data.resultados);
      }
    } catch (error) {
      setErrorConexion(true);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(buscarCatalogo, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscador, filtroUnidad]);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="mb-1" style={{ fontSize: "1.75rem" }}>Catálogo de Procedimientos TUPA</h1>
        <p className="text-muted mb-0">Consulte todos los procedimientos administrativos y servicios disponibles</p>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar por nombre, código o palabra clave"
                value={buscador}
                onChange={(e) => setBuscador(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filtroUnidad} onChange={(e) => setFiltroUnidad(e.target.value)}>
                <option value="">Todas las unidades</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {cargando && <div className="text-muted mb-3">Buscando...</div>}
      {!cargando && resultados.length > 0 && (
        <div className="text-muted mb-3" style={{ fontSize: "0.875rem" }}>
          Mostrando {resultados.length} trámite{resultados.length === 1 ? "" : "s"}
        </div>
      )}

      {errorConexion && (
        <div className="alert alert-danger">Error de conexión. Intente nuevamente.</div>
      )}

      {sinResultados && (
        <div className="text-center py-5">
          <i className="bi bi-file-earmark-text" style={{ fontSize: "2.5rem", color: "#6c757d" }}></i>
          <h3 className="h6 text-muted mt-3 mb-1">No se encontraron resultados</h3>
          <p className="text-muted small mb-0">Intente ajustar los filtros de búsqueda</p>
          {sugerencias.length > 0 && (
            <div className="row g-3 mt-3 text-start">
              <p className="mb-2 fw-medium">Quizás quisiste decir:</p>
              {sugerencias.map((s) => (
                <TarjetaTramite key={s.codigo} tramite={s} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="row g-3">
        {resultados.map((t) => (
          <TarjetaTramite key={t.codigo} tramite={t} />
        ))}
      </div>
    </div>
  );
}

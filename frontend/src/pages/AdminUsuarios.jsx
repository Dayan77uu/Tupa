import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminUsuarios() {
  const [oficinas, setOficinas] = useState([]);
  const [cidtusuario, setCidtusuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [rol, setRol] = useState("ESTUDIANTE");
  const [oficina, setOficina] = useState("");

  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    api.get("/api/catalogo/filtros").then((r) => setOficinas(r.data.unidades || []));
  }, []);

  function limpiarFormulario() {
    setCidtusuario("");
    setCorreo("");
    setNombres("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setRol("ESTUDIANTE");
    setOficina("");
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError(null);
    setExito(null);

    const body = {
      cidtusuario: cidtusuario.trim(),
      dni: cidtusuario.trim(),
      correo: correo.trim(),
      nombres: nombres.trim(),
      apellido_paterno: apellidoPaterno.trim(),
      apellido_materno: apellidoMaterno.trim(),
      rol,
      oficina: oficina ? Number(oficina) : null,
    };

    try {
      const respuesta = await api.post("/api/admin/usuarios", body);
      setExito(`Usuario creado: ${respuesta.data.correo} (${respuesta.data.rol}). Contraseña por defecto: Prueba123!`);
      limpiarFormulario();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo crear el usuario.");
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <div className="alert" style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1e40af" }}>
        <i className="bi bi-info-circle"></i>{" "}
        Dataset sintético para desarrollo/demo. Usa DNI y correos claramente ficticios — nunca datos reales de <code>talumno</code>.
      </div>

      <div className="card">
        <div className="card-body p-4">
          <h2 className="h6 mb-3">Crear usuario</h2>
          <form onSubmit={manejarSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label small">DNI / ID de usuario</label>
              <input type="text" className="form-control" value={cidtusuario} onChange={(e) => setCidtusuario(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Correo institucional</label>
              <input
                type="email"
                className="form-control"
                placeholder="usuario@unsaac.edu.pe"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Nombres</label>
              <input type="text" className="form-control" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Apellido paterno</label>
              <input type="text" className="form-control" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Apellido materno</label>
              <input type="text" className="form-control" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Rol</label>
              <select className="form-select" value={rol} onChange={(e) => setRol(e.target.value)} required>
                <option value="ESTUDIANTE">ESTUDIANTE</option>
                <option value="USUARIO DE RECAUDACION">USUARIO DE RECAUDACION (Personal Administrativo)</option>
                <option value="COORDINADOR DE TESORERIA">COORDINADOR DE TESORERIA (Personal Administrativo)</option>
                <option value="OPERADOR DE OTI">OPERADOR DE OTI (Personal Administrativo)</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR (Administrador del Sistema)</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small">Oficina (si aplica)</label>
              <select className="form-select" value={oficina} onChange={(e) => setOficina(e.target.value)}>
                <option value="">Ninguna</option>
                {oficinas.map((o) => (
                  <option key={o.id} value={o.id}>{o.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-institucional">Crear usuario</button>
            </div>
          </form>
          {error && <div className="alert alert-danger py-2 small mt-3">{error}</div>}
          {exito && <div className="alert alert-success py-2 small mt-3">{exito}</div>}
        </div>
      </div>
    </div>
  );
}

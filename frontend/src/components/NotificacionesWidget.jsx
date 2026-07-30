import { useEffect, useRef, useState } from "react";
import { Dropdown } from "bootstrap";
import api from "../services/api";
import { obtenerToken } from "../utils/storage";

export default function NotificacionesWidget() {
  const [noLeidas, setNoLeidas] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const botonRef = useRef(null);

  async function cargarNotificaciones() {
    if (!obtenerToken()) return;
    try {
      const respuesta = await api.get("/api/notificaciones");
      setNoLeidas(respuesta.data.no_leidas);
      setNotificaciones(respuesta.data.notificaciones);
    } catch {
      // silencioso: el badge de notificaciones no debe romper la pagina principal
    }
  }

  useEffect(() => {
    cargarNotificaciones();
    const boton = botonRef.current;
    if (!boton) return;
    const manejador = () => cargarNotificaciones();
    boton.addEventListener("show.bs.dropdown", manejador);
    new Dropdown(boton);
    return () => boton.removeEventListener("show.bs.dropdown", manejador);
  }, []);

  async function marcarLeida(id) {
    await api.post(`/api/notificaciones/${id}/leer`);
    cargarNotificaciones();
  }

  if (!obtenerToken()) return null;

  return (
    <div className="dropdown">
      <button
        ref={botonRef}
        className="btn btn-outline-light btn-sm position-relative"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
      >
        <i className="bi bi-bell"></i>
        {noLeidas > 0 && (
          <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
            {noLeidas}
          </span>
        )}
      </button>
      <div className="dropdown-menu dropdown-menu-end p-0" style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
        {notificaciones.length === 0 ? (
          <div className="p-3 text-muted small">Sin notificaciones</div>
        ) : (
          notificaciones.map((n) => (
            <button
              key={n.id_notificacion}
              type="button"
              className={`dropdown-item border-bottom py-2 ${n.leida ? "" : "fw-semibold"}`}
              onClick={() => marcarLeida(n.id_notificacion)}
            >
              <div className="small">{n.mensaje}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                {n.fecha_hora ? n.fecha_hora.replace("T", " ") : ""}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

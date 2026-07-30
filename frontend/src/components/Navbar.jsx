import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES_PERSONAL_ADMINISTRATIVO, ROL_ADMINISTRADOR } from "../utils/roles";
import NotificacionesWidget from "./NotificacionesWidget";

export default function Navbar() {
  const { token, rol, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) return null;

  const esPersonalAdministrativo = ROLES_PERSONAL_ADMINISTRATIVO.includes(rol);
  const esAdministrador = rol === ROL_ADMINISTRADOR;

  function cerrarSesion() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-danger px-3">
      <span className="navbar-brand">TUPA UNSAAC</span>
      <div className="navbar-nav me-auto">
        {rol === "ESTUDIANTE" && (
          <>
            <Link className="nav-link" to="/catalogo">Catálogo</Link>
            <Link className="nav-link" to="/mis-tramites">Mis Trámites</Link>
          </>
        )}
        {(esPersonalAdministrativo || esAdministrador) && (
          <>
            <Link className="nav-link" to="/admin/bandeja">Bandeja</Link>
            <Link className="nav-link" to="/admin/reportes">Reportes</Link>
          </>
        )}
        {esAdministrador && (
          <>
            <Link className="nav-link" to="/admin/catalogo">Gestión de Catálogo</Link>
            <Link className="nav-link" to="/admin/usuarios">Gestión de Usuarios</Link>
          </>
        )}
      </div>
      <div className="d-flex align-items-center gap-2">
        {rol === "ESTUDIANTE" && <NotificacionesWidget />}
        <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

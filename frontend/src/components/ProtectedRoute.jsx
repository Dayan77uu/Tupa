import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// requiredRoles: opcional. String o array de strings. Si se omite, solo exige
// sesion iniciada (cualquier rol). Los grupos de roles reflejan exactamente
// los decoradores del backend (app/auth/decorators.py):
// - ROLES_PERSONAL_ADMINISTRATIVO: USUARIO DE RECAUDACION, COORDINADOR DE
//   TESORERIA, OPERADOR DE OTI (bandeja admin)
// - ADMINISTRADOR (gestion de catalogo/usuarios)
// - ambos combinados (reportes)
export default function ProtectedRoute({ children, requiredRoles }) {
  const { token, rol, loading } = useAuth();

  if (loading) return null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles) {
    const permitidos = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!permitidos.includes(rol)) {
      return <Navigate to="/catalogo" replace />;
    }
  }

  return children;
}

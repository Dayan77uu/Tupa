import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES_GESTION, ROLES_PERSONAL_ADMINISTRATIVO, ROL_ADMINISTRADOR } from "./utils/roles";

import Login from "./pages/Login";
import ActivarCuenta from "./pages/ActivarCuenta";
import Catalogo from "./pages/Catalogo";
import FichaTramite from "./pages/FichaTramite";
import Solicitud from "./pages/Solicitud";
import MisTramites from "./pages/MisTramites";
import Subsanar from "./pages/Subsanar";
import AdminBandeja from "./pages/AdminBandeja";
import AdminExpedienteDetalle from "./pages/AdminExpedienteDetalle";
import AdminCatalogo from "./pages/AdminCatalogo";
import AdminReportes from "./pages/AdminReportes";
import AdminUsuarios from "./pages/AdminUsuarios";

function RaizRedirect() {
  const { token, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={token ? "/catalogo" : "/login"} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RaizRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activar-cuenta" element={<ActivarCuenta />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/ficha/:codigo" element={<FichaTramite />} />

        <Route
          path="/solicitud/:codigo"
          element={
            <ProtectedRoute>
              <Solicitud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-tramites"
          element={
            <ProtectedRoute>
              <MisTramites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subsanar/:nro"
          element={
            <ProtectedRoute>
              <Subsanar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bandeja"
          element={
            <ProtectedRoute requiredRoles={ROLES_PERSONAL_ADMINISTRATIVO}>
              <AdminBandeja />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/expedientes/:nro"
          element={
            <ProtectedRoute requiredRoles={ROLES_PERSONAL_ADMINISTRATIVO}>
              <AdminExpedienteDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/catalogo"
          element={
            <ProtectedRoute requiredRoles={ROL_ADMINISTRADOR}>
              <AdminCatalogo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <ProtectedRoute requiredRoles={ROLES_GESTION}>
              <AdminReportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requiredRoles={ROL_ADMINISTRADOR}>
              <AdminUsuarios />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

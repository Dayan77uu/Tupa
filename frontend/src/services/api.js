import axios from "axios";
import { obtenerToken, limpiarToken } from "../utils/storage";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Endpoints publicos donde un 401 significa "credenciales invalidas" o
// "no coincide", NO "tu sesion expiro" -- ahi el 401 se debe mostrar inline
// en el propio formulario, sin redirigir ni borrar el mensaje de error.
const ENDPOINTS_AUTH_PUBLICOS = [
  "/api/auth/login",
  "/api/auth/registro",
  "/api/auth/verificar-correo",
  "/api/auth/activar-cuenta",
];

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esAuthPublico = ENDPOINTS_AUTH_PUBLICOS.some((ruta) => error.config?.url?.includes(ruta));
    if (error.response && error.response.status === 401 && !esAuthPublico) {
      limpiarToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

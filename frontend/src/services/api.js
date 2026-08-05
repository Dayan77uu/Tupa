import axios from "axios";
import { obtenerToken, limpiarToken } from "../utils/storage";

// Por defecto usa el mismo host desde el que se cargo la pagina (localhost,
// IP de LAN) con el puerto del backend -- sirve para desarrollo local y para
// pruebas en la misma red. Si el frontend y el backend estan detras de URLs
// completamente distintas (ej. dos tuneles de Cloudflare, cada uno con su
// propio dominio), se puede fijar VITE_API_BASE_URL en frontend/.env.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000`,
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

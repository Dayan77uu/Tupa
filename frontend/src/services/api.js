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

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response && error.response.status === 401) {
      limpiarToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

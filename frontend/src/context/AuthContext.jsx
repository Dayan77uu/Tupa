import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { guardarToken, obtenerToken, limpiarToken, obtenerRolDelToken } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenGuardado = obtenerToken();
    if (tokenGuardado) {
      setToken(tokenGuardado);
      setRol(obtenerRolDelToken());
    }
    setLoading(false);
  }, []);

  async function login(correo, contrasena) {
    const respuesta = await api.post("/api/auth/login", { correo, contrasena });
    guardarToken(respuesta.data.token);
    setToken(respuesta.data.token);
    setRol(respuesta.data.rol);
    return respuesta.data;
  }

  function logout() {
    limpiarToken();
    setToken(null);
    setRol(null);
  }

  return (
    <AuthContext.Provider value={{ token, rol, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Fiel al contrato real de frontend-legacy/static/js/sesion.js:
// sessionStorage (no localStorage) con la clave "tupa_token". No existe un
// objeto "usuario" persistido en el vanilla -- el rol se decodifica del JWT.
const TUPA_TOKEN_KEY = "tupa_token";

export function guardarToken(token) {
  sessionStorage.setItem(TUPA_TOKEN_KEY, token);
}

export function obtenerToken() {
  return sessionStorage.getItem(TUPA_TOKEN_KEY);
}

export function limpiarToken() {
  sessionStorage.removeItem(TUPA_TOKEN_KEY);
}

// Decodificacion sin verificar firma: solo para decisiones de UI (mostrar/
// ocultar un link). El backend siempre valida el rol de forma independiente.
export function obtenerRolDelToken() {
  const token = obtenerToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol || null;
  } catch (error) {
    return null;
  }
}

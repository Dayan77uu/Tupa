// Sprint 2: los endpoints de solicitud.html requieren el token en cada llamada,
// incluso despues de navegar desde ficha.html. Se guarda en sessionStorage (no
// localStorage) para que no sobreviva mas alla de la pestana/sesion del navegador.
const TUPA_TOKEN_KEY = "tupa_token";

function guardarToken(token) {
  sessionStorage.setItem(TUPA_TOKEN_KEY, token);
}

function obtenerToken() {
  return sessionStorage.getItem(TUPA_TOKEN_KEY);
}

function limpiarToken() {
  sessionStorage.removeItem(TUPA_TOKEN_KEY);
}

const API_BASE = "http://127.0.0.1:5000";
const DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe";

// Requisito del Sprint 1: el token vive solo en memoria (variable JS), nunca en
// localStorage. Al navegar a otra pagina (catalogo.html) esta variable se pierde;
// como el catalogo es publico eso no bloquea el flujo, pero cualquier endpoint
// protegido que se agregue en Sprint 2 necesitara otra estrategia (sessionStorage
// o mantener todo en una sola pagina tipo SPA).
let tokenEnMemoria = null;

const form = document.getElementById("form-login");
const campoCorreo = document.getElementById("correo");
const errorCorreo = document.getElementById("error-correo");
const errorLogin = document.getElementById("error-login");
const btnLogin = document.getElementById("btn-login");

function correoTieneDominioValido(correo) {
  return correo.trim().toLowerCase().endsWith(DOMINIO_INSTITUCIONAL);
}

campoCorreo.addEventListener("blur", () => {
  const correo = campoCorreo.value.trim();

  if (correo && !correoTieneDominioValido(correo)) {
    campoCorreo.classList.add("campo-invalido");
    errorCorreo.textContent = `El correo debe terminar en ${DOMINIO_INSTITUCIONAL}`;
    errorCorreo.hidden = false;
  } else {
    campoCorreo.classList.remove("campo-invalido");
    errorCorreo.hidden = true;
  }
});

function redirigirSegunRol(rol) {
  if (rol === "ESTUDIANTE") {
    window.location.href = "catalogo.html";
  } else {
    window.location.href = "placeholder.html";
  }
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  errorLogin.hidden = true;

  const correo = campoCorreo.value.trim();
  const contrasena = document.getElementById("contrasena").value;

  if (!correoTieneDominioValido(correo)) {
    campoCorreo.classList.add("campo-invalido");
    errorCorreo.textContent = `El correo debe terminar en ${DOMINIO_INSTITUCIONAL}`;
    errorCorreo.hidden = false;
    return;
  }

  btnLogin.disabled = true;
  btnLogin.textContent = "Ingresando...";

  try {
    const respuesta = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      errorLogin.textContent = datos.error || "No se pudo iniciar sesión.";
      errorLogin.hidden = false;
      return;
    }

    tokenEnMemoria = datos.token;
    redirigirSegunRol(datos.rol);
  } catch (error) {
    errorLogin.textContent = "Error de conexión. Intente nuevamente.";
    errorLogin.hidden = false;
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = "Ingresar";
  }
});

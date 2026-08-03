const API_BASE = window.TUPA_CONFIG.API_BASE_URL;
const DOMINIO_INSTITUCIONAL = "@unsaac.edu.pe";

let intentosFallidos = 0;

const form = document.getElementById("form-login");
const campoCorreo = document.getElementById("correo");
const campoContrasena = document.getElementById("contrasena");
const errorCorreo = document.getElementById("error-correo");
const errorLogin = document.getElementById("error-login");
const avisoActivacion = document.getElementById("aviso-activacion");
const btnLogin = document.getElementById("btn-login");
const contadorIntentos = document.getElementById("contador-intentos");
const btnVerContrasena = document.getElementById("btn-ver-contrasena");
const iconoVerContrasena = document.getElementById("icono-ver-contrasena");

function correoTieneDominioValido(correo) {
  return correo.trim().toLowerCase().endsWith(DOMINIO_INSTITUCIONAL);
}

function actualizarEstiloCorreo() {
  const correo = campoCorreo.value.trim();

  if (!correo) {
    campoCorreo.classList.remove("campo-invalido", "campo-valido");
    errorCorreo.hidden = true;
    return;
  }

  if (correoTieneDominioValido(correo)) {
    campoCorreo.classList.remove("campo-invalido");
    campoCorreo.classList.add("campo-valido");
    errorCorreo.hidden = true;
  } else {
    campoCorreo.classList.remove("campo-valido");
    campoCorreo.classList.add("campo-invalido");
    errorCorreo.textContent = `Solo se aceptan correos ${DOMINIO_INSTITUCIONAL}`;
    errorCorreo.hidden = false;
  }
}

campoCorreo.addEventListener("input", actualizarEstiloCorreo);

btnVerContrasena.addEventListener("click", () => {
  const mostrando = campoContrasena.type === "text";
  campoContrasena.type = mostrando ? "password" : "text";
  iconoVerContrasena.classList.toggle("bi-eye", mostrando);
  iconoVerContrasena.classList.toggle("bi-eye-slash", !mostrando);
});

function mostrarBanner(tipo, mensaje) {
  errorLogin.className = "alert d-flex align-items-start gap-2 mb-4";
  const estilos = {
    error: "alert-danger",
    bloqueo: "alert-warning",
    conexion: "alert-secondary",
  };
  errorLogin.classList.add(estilos[tipo] || "alert-danger");
  errorLogin.innerHTML = `<i class="bi bi-exclamation-circle mt-1"></i><span>${mensaje}</span>`;
  errorLogin.hidden = false;
}

function redirigirSegunRol(rol) {
  if (rol === "ESTUDIANTE") {
    window.location.href = "catalogo.html";
  } else if (rol === "ADMINISTRADOR") {
    window.location.href = "admin-catalogo.html";
  } else {
    window.location.href = "bandeja.html";
  }
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  errorLogin.hidden = true;
  avisoActivacion.hidden = true;

  const correo = campoCorreo.value.trim();
  const contrasena = campoContrasena.value;

  if (!correoTieneDominioValido(correo)) {
    actualizarEstiloCorreo();
    return;
  }

  btnLogin.disabled = true;
  btnLogin.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Ingresando...`;

  try {
    const respuesta = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      if (datos.cuenta_pendiente_activacion) {
        avisoActivacion.hidden = false;
        return;
      }

      const bloqueado = (datos.error || "").toLowerCase().includes("bloqueada");
      mostrarBanner(bloqueado ? "bloqueo" : "error", datos.error || "No se pudo iniciar sesión.");

      if (bloqueado) {
        campoCorreo.disabled = true;
        campoContrasena.disabled = true;
        btnVerContrasena.disabled = true;
        contadorIntentos.hidden = true;
      } else if (respuesta.status === 401) {
        intentosFallidos += 1;
        if (intentosFallidos < 5) {
          contadorIntentos.textContent = `Intento ${intentosFallidos} de 5`;
          contadorIntentos.hidden = false;
        }
      }
      return;
    }

    guardarToken(datos.token);
    redirigirSegunRol(datos.rol);
  } catch (error) {
    mostrarBanner("conexion", "Error de conexión. Intente nuevamente.");
  } finally {
    if (!campoCorreo.disabled) {
      btnLogin.disabled = false;
      btnLogin.textContent = "Ingresar";
    }
  }
});

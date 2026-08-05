const API_BASE = window.TUPA_CONFIG.API_BASE_URL;

// --- ELEMENTOS LOGIN ---
const formLogin = document.getElementById("form-login");
const inputIdentificador = document.getElementById("identificador");
const inputContrasenaLogin = document.getElementById("contrasena-login");
const errorLogin = document.getElementById("error-login");
const exitoLogin = document.getElementById("exito-login");
const btnSubmitLogin = document.getElementById("btn-submit-login");
const contadorIntentos = document.getElementById("contador-intentos");
const contenedorReenviar = document.getElementById("contenedor-reenviar");
const btnReenviar = document.getElementById("btn-reenviar");

// --- ELEMENTOS REGISTRO ---
const formRegister = document.getElementById("form-register");
const inputCodigo = document.getElementById("codigo_registro");
const inputDni = document.getElementById("dni_registro");
const inputContrasenaReg = document.getElementById("contrasena-registro");
const inputContrasenaConfirm = document.getElementById("contrasena-confirm");
const errorRegister = document.getElementById("error-register");
const exitoRegister = document.getElementById("exito-register");
const btnSubmitRegister = document.getElementById("btn-submit-register");
const previewCorreo = document.getElementById("preview-correo");
const textoCorreoGenerado = document.getElementById("texto-correo-generado");

let intentosFallidos = 0;
let ultimoCodigoParaReenvio = "";

// --- UTILIDADES ---
function mostrarMensaje(elemento, tipo, mensaje, HTML = false) {
  elemento.className = `alert alert-${tipo} d-flex align-items-start gap-2 mb-4`;
  const icon = tipo === 'success' ? 'check-circle' : 'exclamation-circle';
  const contenido = HTML ? mensaje : `<span>${mensaje}</span>`;
  elemento.innerHTML = `<i class="bi bi-${icon} mt-1"></i>${contenido}`;
  elemento.hidden = false;
}

function ocultarMensaje(elemento) {
  elemento.hidden = true;
  elemento.innerHTML = "";
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

// Mostrar/Ocultar contraseñas dinámico
document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const icon = btn.querySelector("i");
    
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    }
  });
});

// Mensajes flash desde URL (Verificación de email)
function leerQueryParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("verified") === "1") {
    mostrarMensaje(exitoLogin, "success", "Tu cuenta fue verificada exitosamente. Ya puedes iniciar sesión.");
  } else if (params.get("verified") === "0") {
    mostrarMensaje(errorLogin, "danger", params.get("message") || "La verificación falló. El enlace podría haber expirado.");
  }
}
leerQueryParams();

// --- LOGICA DE REGISTRO ---
inputCodigo.addEventListener("input", (e) => {
  const val = e.target.value.trim();
  if (val) {
    textoCorreoGenerado.textContent = `${val}@unsaac.edu.pe`;
    previewCorreo.hidden = false;
  } else {
    previewCorreo.hidden = true;
  }
});

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  ocultarMensaje(errorRegister);
  ocultarMensaje(exitoRegister);

  const codigo = inputCodigo.value.trim();
  const dni = inputDni.value.trim();
  const password = inputContrasenaReg.value;
  const confirm = inputContrasenaConfirm.value;

  if (password !== confirm) {
    mostrarMensaje(errorRegister, "danger", "Las contraseñas no coinciden.");
    return;
  }

  btnSubmitRegister.disabled = true;
  btnSubmitRegister.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Creando cuenta...`;

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo_alumno: codigo,
        dni: dni,
        password: password,
        password_confirmation: confirm
      })
    });

    const data = await res.json();

    if (res.ok) {
      mostrarMensaje(exitoRegister, "success", `
        <div>
          <strong>¡Cuenta creada correctamente!</strong><br>
          Enviamos un mensaje de verificación a:<br>
          <b>${data.correo}</b><br>
          Revisa tu bandeja de entrada o spam.
        </div>
      `, true);
      formRegister.reset();
      previewCorreo.hidden = true;
    } else {
      mostrarMensaje(errorRegister, "danger", data.error || "No se pudo crear la cuenta.");
    }
  } catch (err) {
    mostrarMensaje(errorRegister, "danger", "Error de conexión. Intente nuevamente.");
  } finally {
    btnSubmitRegister.disabled = false;
    btnSubmitRegister.textContent = "Crear cuenta";
  }
});

// --- LOGICA DE LOGIN ---
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  ocultarMensaje(errorLogin);
  ocultarMensaje(exitoLogin);
  contenedorReenviar.hidden = true;

  const identificador = inputIdentificador.value.trim();
  const contrasena = inputContrasenaLogin.value;

  btnSubmitLogin.disabled = true;
  btnSubmitLogin.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Ingresando...`;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identificador, password: contrasena })
    });

    const data = await res.json();

    if (res.ok) {
      guardarToken(data.token);
      redirigirSegunRol(data.rol);
      return;
    }

    const bloqueado = (data.error || "").toLowerCase().includes("bloqueada");
    mostrarMensaje(errorLogin, bloqueado ? "warning" : "danger", data.error || "Credenciales incorrectas.");

    if (res.status === 403 && data.cuenta_pendiente_activacion) {
      ultimoCodigoParaReenvio = data.codigo_alumno || identificador;
      contenedorReenviar.hidden = false;
    } else if (bloqueado) {
      inputIdentificador.disabled = true;
      inputContrasenaLogin.disabled = true;
      contadorIntentos.hidden = true;
    } else if (res.status === 401) {
      intentosFallidos++;
      if (intentosFallidos < 5) {
        contadorIntentos.textContent = `Intento fallido ${intentosFallidos} de 5`;
        contadorIntentos.hidden = false;
      }
    }
  } catch (err) {
    mostrarMensaje(errorLogin, "danger", "Error de conexión. Intente nuevamente.");
  } finally {
    if (!inputIdentificador.disabled) {
      btnSubmitLogin.disabled = false;
      btnSubmitLogin.textContent = "Ingresar";
    }
  }
});

// --- REENVIO DE CORREO DE VERIFICACION ---
btnReenviar.addEventListener("click", async () => {
  if (!ultimoCodigoParaReenvio) return;
  
  btnReenviar.disabled = true;
  btnReenviar.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Enviando...`;
  
  try {
    const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo_alumno: ultimoCodigoParaReenvio })
    });

    const data = await res.json();
    if (res.ok) {
      mostrarMensaje(exitoLogin, "success", data.mensaje);
      ocultarMensaje(errorLogin);
      contenedorReenviar.hidden = true;
    } else {
      mostrarMensaje(errorLogin, "danger", data.error || "No se pudo reenviar el correo.");
    }
  } catch (err) {
    mostrarMensaje(errorLogin, "danger", "Error de conexión al intentar reenviar.");
  } finally {
    btnReenviar.disabled = false;
    btnReenviar.innerHTML = `<i class="bi bi-envelope-check"></i> Reenviar correo de verificación`;
  }
});

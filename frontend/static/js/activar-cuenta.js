const API_BASE = window.TUPA_CONFIG.API_BASE_URL;

const form = document.getElementById("form-activar-cuenta");
const campoCodigoAlumno = document.getElementById("codigoalumno");
const campoDni = document.getElementById("dni");
const campoNuevaContrasena = document.getElementById("nueva_contrasena");
const campoConfirmarContrasena = document.getElementById("confirmar_contrasena");
const errorConfirmar = document.getElementById("error-confirmar");
const errorActivacion = document.getElementById("error-activacion");
const exitoActivacion = document.getElementById("exito-activacion");
const btnActivar = document.getElementById("btn-activar");

function mostrarError(mensaje) {
  exitoActivacion.hidden = true;
  errorActivacion.innerHTML = `<i class="bi bi-exclamation-circle mt-1"></i><span>${mensaje}</span>`;
  errorActivacion.className = "alert alert-danger d-flex align-items-start gap-2 mb-4";
  errorActivacion.hidden = false;
}

function mostrarExito(mensaje) {
  errorActivacion.hidden = true;
  exitoActivacion.innerHTML = `<i class="bi bi-check-circle mt-1"></i><span>${mensaje}</span>`;
  exitoActivacion.hidden = false;
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  errorActivacion.hidden = true;
  exitoActivacion.hidden = true;
  errorConfirmar.hidden = true;

  const codigoalumno = campoCodigoAlumno.value.trim();
  const dni = campoDni.value.trim();
  const nueva_contrasena = campoNuevaContrasena.value;
  const confirmar = campoConfirmarContrasena.value;

  if (nueva_contrasena !== confirmar) {
    errorConfirmar.textContent = "Las contraseñas ingresadas no coinciden";
    errorConfirmar.hidden = false;
    return;
  }

  btnActivar.disabled = true;
  btnActivar.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Activando...`;

  try {
    const respuesta = await fetch(`${API_BASE}/api/auth/activar-cuenta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigoalumno, dni, nueva_contrasena }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarError(datos.error || "No se pudo activar la cuenta.");
      return;
    }

    mostrarExito(`${datos.mensaje} Redirigiendo al login...`);
    form.reset();
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    mostrarError("Error de conexión. Intente nuevamente.");
  } finally {
    btnActivar.disabled = false;
    btnActivar.textContent = "Activar cuenta";
  }
});

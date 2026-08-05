const API_BASE = window.TUPA_CONFIG.API_BASE_URL;

const form = document.getElementById("form-activar-cuenta");
const btnActivar = document.getElementById("btn-activar");
const errorActivacion = document.getElementById("error-activacion");
const exitoActivacion = document.getElementById("exito-activacion");
const errorConfirmar = document.getElementById("error-confirmar");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  errorActivacion.hidden = true;
  exitoActivacion.hidden = true;
  errorConfirmar.hidden = true;
  
  const codigoalumno = document.getElementById("codigoalumno").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const nueva_contrasena = document.getElementById("nueva_contrasena").value;
  const confirmar_contrasena = document.getElementById("confirmar_contrasena").value;
  
  if (nueva_contrasena !== confirmar_contrasena) {
      errorConfirmar.textContent = "Las contraseñas no coinciden.";
      errorConfirmar.hidden = false;
      return;
  }
  
  btnActivar.disabled = true;
  btnActivar.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Activando...`;
  
  try {
      const resp = await fetch(`${API_BASE}/api/auth/activar-cuenta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigoalumno, dni, nueva_contrasena })
      });
      const data = await resp.json();
      
      if (!resp.ok) {
          errorActivacion.className = "alert alert-danger d-flex align-items-start gap-2 mb-4";
          errorActivacion.innerHTML = `<i class="bi bi-exclamation-circle mt-1"></i><span>${data.error || "Error al activar la cuenta"}</span>`;
          errorActivacion.hidden = false;
      } else {
          exitoActivacion.innerHTML = `<i class="bi bi-check-circle mt-1"></i><span>${data.mensaje}. <a href="login.html" class="alert-link">Iniciar sesión</a></span>`;
          exitoActivacion.hidden = false;
          form.reset();
      }
  } catch (error) {
      errorActivacion.className = "alert alert-danger d-flex align-items-start gap-2 mb-4";
      errorActivacion.innerHTML = `<i class="bi bi-exclamation-circle mt-1"></i><span>Error de conexión. Intente nuevamente.</span>`;
      errorActivacion.hidden = false;
  } finally {
      btnActivar.disabled = false;
      btnActivar.textContent = "Activar cuenta";
  }
});

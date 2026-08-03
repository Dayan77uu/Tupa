const API_BASE = window.TUPA_CONFIG.API_BASE_URL;

async function cargarOficinas() {
  const respuesta = await fetch(`${API_BASE}/api/catalogo/filtros`);
  const datos = await respuesta.json();
  const select = document.getElementById("input-oficina");
  select.innerHTML =
    `<option value="">Ninguna</option>` +
    (datos.unidades || []).map((o) => `<option value="${o.id}">${o.nombre}</option>`).join("");
}

if (!obtenerToken()) {
  window.location.href = "login.html";
}

document.getElementById("form-usuario").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const errorCrear = document.getElementById("error-crear");
  const exitoCrear = document.getElementById("exito-crear");
  errorCrear.hidden = true;
  exitoCrear.hidden = true;

  const oficina = document.getElementById("input-oficina").value;

  const body = {
    cidtusuario: document.getElementById("input-cidtusuario").value.trim(),
    dni: document.getElementById("input-cidtusuario").value.trim(),
    correo: document.getElementById("input-correo").value.trim(),
    nombres: document.getElementById("input-nombres").value.trim(),
    apellido_paterno: document.getElementById("input-appat").value.trim(),
    apellido_materno: document.getElementById("input-apmat").value.trim(),
    rol: document.getElementById("input-rol").value,
    oficina: oficina ? Number(oficina) : null,
  };

  try {
    const respuesta = await fetch(`${API_BASE}/api/admin/usuarios`, {
      method: "POST",
      headers: headersAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    const datos = await respuesta.json();

    if (respuesta.status === 401) {
      limpiarToken();
      window.location.href = "login.html";
      return;
    }
    if (respuesta.status === 403) {
      errorCrear.textContent = "No tiene permisos de administrador del sistema.";
      errorCrear.hidden = false;
      return;
    }
    if (!respuesta.ok) {
      errorCrear.textContent = datos.error;
      errorCrear.hidden = false;
      return;
    }

    exitoCrear.textContent = `Usuario creado: ${datos.correo} (${datos.rol}). Contraseña por defecto: Prueba123!`;
    exitoCrear.hidden = false;
    document.getElementById("form-usuario").reset();
  } catch (error) {
    errorCrear.textContent = "Error de conexión. Intente nuevamente.";
    errorCrear.hidden = false;
  }
});

cargarOficinas();

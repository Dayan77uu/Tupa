const API_BASE_NOTIF = window.TUPA_CONFIG.API_BASE_URL;

function inicializarNotificaciones() {
  const contenedor = document.getElementById("notificaciones-widget");
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="dropdown">
      <button class="btn btn-outline-light btn-sm position-relative" id="btn-notificaciones" type="button"
        data-bs-toggle="dropdown" data-bs-auto-close="true">
        <i class="bi bi-bell"></i>
        <span class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle" id="badge-no-leidas" hidden>0</span>
      </button>
      <div class="dropdown-menu dropdown-menu-end p-0" id="lista-notificaciones-dropdown" style="width: 320px; max-height: 400px; overflow-y: auto;">
        <div class="p-3 text-muted small" id="notificaciones-vacio">Sin notificaciones</div>
      </div>
    </div>
  `;

  document
    .getElementById("btn-notificaciones")
    .addEventListener("show.bs.dropdown", cargarNotificaciones);

  cargarNotificaciones();
}

function notificacionItemHtml(n) {
  const claseNoLeida = n.leida ? "" : "fw-semibold";
  return `
    <button type="button" class="dropdown-item border-bottom py-2 ${claseNoLeida}" data-id="${n.id_notificacion}">
      <div class="small">${n.mensaje}</div>
      <div class="text-muted" style="font-size: 0.7rem">${n.fecha_hora ? n.fecha_hora.replace("T", " ") : ""}</div>
    </button>
  `;
}

async function cargarNotificaciones() {
  const token = obtenerToken();
  if (!token) return;

  try {
    const respuesta = await fetch(`${API_BASE_NOTIF}/api/notificaciones`, { headers: headersAuth() });
    if (!respuesta.ok) return;
    const datos = await respuesta.json();

    const badge = document.getElementById("badge-no-leidas");
    if (datos.no_leidas > 0) {
      badge.textContent = datos.no_leidas;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }

    const lista = document.getElementById("lista-notificaciones-dropdown");
    if (datos.notificaciones.length === 0) {
      lista.innerHTML = `<div class="p-3 text-muted small">Sin notificaciones</div>`;
      return;
    }

    lista.innerHTML = datos.notificaciones.map(notificacionItemHtml).join("");
    lista.querySelectorAll("[data-id]").forEach((item) => {
      item.addEventListener("click", async () => {
        const id = item.dataset.id;
        await fetch(`${API_BASE_NOTIF}/api/notificaciones/${id}/leer`, {
          method: "POST",
          headers: headersAuth(),
        });
        cargarNotificaciones();
      });
    });
  } catch (error) {
    // silencioso: el badge de notificaciones no debe romper la pagina principal
  }
}

document.addEventListener("DOMContentLoaded", inicializarNotificaciones);

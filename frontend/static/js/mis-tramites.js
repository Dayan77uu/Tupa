const API_BASE = "http://127.0.0.1:5000";

const estadoCarga = document.getElementById("estado-carga");
const errorGeneral = document.getElementById("error-general");
const sinExpedientes = document.getElementById("sin-expedientes");
const contenedorExpedientes = document.getElementById("contenedor-expedientes");

const ESTADO_LABEL = {
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  OBSERVADO: "Observado",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

function tarjetaExpedienteHtml(e) {
  const botonSubsanar =
    e.estado === "OBSERVADO"
      ? `<a href="subsanar.html?nro=${encodeURIComponent(e.nro_expediente)}" class="btn btn-institucional btn-sm w-100 mt-2">
           <i class="bi bi-upload"></i> Subsanar documentos
         </a>`
      : "";

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 tarjeta-expediente estado-${e.color}">
        <div class="card-body p-4">
          <div class="d-flex align-items-start justify-content-between mb-2">
            <span class="badge border text-dark bg-white">${e.nro_expediente}</span>
            <span class="badge badge-estado-${e.color}">${e.estado_label}</span>
          </div>
          <h3 class="h6 mb-2">${e.nombre_tramite || "Trámite"}</h3>
          <p class="text-muted small mb-1">
            <i class="bi bi-calendar3"></i> ${e.fecha_registro ? e.fecha_registro.split("T")[0] : ""}
          </p>
          <p class="text-muted small mb-3">
            <i class="bi bi-clock-history"></i> ${e.dias_transcurridos} día(s) transcurridos
          </p>
          <button type="button" class="btn btn-outline-secondary btn-sm w-100 btn-ver-historial" data-nro="${e.nro_expediente}">
            Ver historial
          </button>
          ${botonSubsanar}
        </div>
      </div>
    </div>
  `;
}

function itemHistorialHtml(m) {
  return `
    <div class="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
      <div class="icono-requisito"><i class="bi bi-arrow-right"></i></div>
      <div>
        <p class="mb-1 small fw-medium">
          ${m.estado_anterior ? `${ESTADO_LABEL[m.estado_anterior] || m.estado_anterior} → ` : ""}${ESTADO_LABEL[m.estado_nuevo] || m.estado_nuevo}
        </p>
        ${m.comentario ? `<p class="mb-1 small text-muted">${m.comentario}</p>` : ""}
        <p class="mb-0 text-muted" style="font-size: 0.75rem">${(m.fecha_hora || "").replace("T", " ")}</p>
      </div>
    </div>
  `;
}

async function mostrarHistorial(nroExpediente) {
  const cuerpo = document.getElementById("modal-historial-cuerpo");
  const titulo = document.getElementById("modal-historial-titulo");
  titulo.textContent = `Historial — ${nroExpediente}`;
  cuerpo.innerHTML = `<p class="text-muted small">Cargando...</p>`;

  const modal = new bootstrap.Modal(document.getElementById("modal-historial"));
  modal.show();

  try {
    const respuesta = await fetch(`${API_BASE}/api/expedientes/${nroExpediente}/historial`, {
      headers: headersAuth(),
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      cuerpo.innerHTML = `<div class="alert alert-danger mb-0">${datos.error || "No se pudo cargar el historial."}</div>`;
      return;
    }

    if (datos.historial.length === 0) {
      cuerpo.innerHTML = `<p class="text-muted small mb-0">Sin movimientos registrados todavía.</p>`;
      return;
    }

    cuerpo.innerHTML = datos.historial.map(itemHistorialHtml).join("");
  } catch (error) {
    cuerpo.innerHTML = `<div class="alert alert-danger mb-0">Error de conexión. Intente nuevamente.</div>`;
  }
}

async function cargarMisExpedientes() {
  if (!obtenerToken()) {
    window.location.href = "login.html";
    return;
  }

  try {
    const respuesta = await fetch(`${API_BASE}/api/mis-expedientes`, { headers: headersAuth() });

    if (respuesta.status === 401) {
      limpiarToken();
      window.location.href = "login.html";
      return;
    }

    const datos = await respuesta.json();
    estadoCarga.hidden = true;

    if (!respuesta.ok) {
      errorGeneral.textContent = datos.error || "No se pudieron cargar tus trámites.";
      errorGeneral.hidden = false;
      return;
    }

    if (datos.expedientes.length === 0) {
      sinExpedientes.hidden = false;
      return;
    }

    contenedorExpedientes.innerHTML = datos.expedientes.map(tarjetaExpedienteHtml).join("");
    contenedorExpedientes.querySelectorAll(".btn-ver-historial").forEach((boton) => {
      boton.addEventListener("click", () => mostrarHistorial(boton.dataset.nro));
    });
  } catch (error) {
    estadoCarga.hidden = true;
    errorGeneral.textContent = "Error de conexión. Intente nuevamente.";
    errorGeneral.hidden = false;
  }
}

cargarMisExpedientes();

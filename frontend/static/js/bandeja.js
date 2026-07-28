const API_BASE = "http://127.0.0.1:5000";

const estadoCarga = document.getElementById("estado-carga");
const errorGeneral = document.getElementById("error-general");
const sinExpedientes = document.getElementById("sin-expedientes");
const contenedorBandeja = document.getElementById("contenedor-bandeja");

const modalObservar = new bootstrap.Modal(document.getElementById("modal-observar"));
const modalRechazar = new bootstrap.Modal(document.getElementById("modal-rechazar"));

const PLAZO_COLOR = { verde: "#10B981", amarillo: "#F59E0B", rojo: "#EF4444" };

let nroEnAccion = null;

function filaExpedienteHtml(e) {
  return `
    <div class="card tarjeta-expediente estado-${e.color_plazo === "rojo" ? "rojo" : e.color_plazo === "amarillo" ? "naranja" : "verde"}" data-nro="${e.nro_expediente}" data-ccodigo="${e.ccodigo}">
      <div class="card-body p-4">
        <div class="row align-items-center g-3">
          <div class="col-md-3">
            <span class="badge border text-dark bg-white d-block mb-1" style="width: fit-content">${e.nro_expediente}</span>
            <p class="mb-0 small fw-medium">${e.nombre_tramite || ""}</p>
          </div>
          <div class="col-md-2">
            <span class="badge badge-estado-${e.color_plazo === "rojo" ? "rojo" : e.color_plazo === "amarillo" ? "naranja" : "verde"}">${e.estado_label}</span>
          </div>
          <div class="col-md-2">
            <span class="d-inline-block rounded-circle" style="width:10px;height:10px;background:${PLAZO_COLOR[e.color_plazo]}"></span>
            <span class="small text-muted">${e.fecha_vencimiento || "sin plazo"}</span>
          </div>
          <div class="col-md-5 d-flex gap-2 justify-content-end flex-wrap">
            <a href="expediente-admin.html?nro=${encodeURIComponent(e.nro_expediente)}" class="btn btn-outline-secondary btn-sm">Ver detalle</a>
            <button type="button" class="btn btn-outline-success btn-sm btn-aprobar">Aprobar</button>
            <button type="button" class="btn btn-outline-warning btn-sm btn-observar">Observar</button>
            <button type="button" class="btn btn-outline-danger btn-sm btn-rechazar">Rechazar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function cargarBandeja() {
  if (!obtenerToken()) {
    window.location.href = "login.html";
    return;
  }

  try {
    const respuesta = await fetch(`${API_BASE}/api/admin/bandeja`, { headers: headersAuth() });

    if (respuesta.status === 401) {
      limpiarToken();
      window.location.href = "login.html";
      return;
    }

    const datos = await respuesta.json();
    estadoCarga.hidden = true;

    if (respuesta.status === 403) {
      errorGeneral.textContent = datos.error || "No tiene permisos de personal administrativo.";
      errorGeneral.hidden = false;
      return;
    }
    if (!respuesta.ok) {
      errorGeneral.textContent = datos.error || "No se pudo cargar la bandeja.";
      errorGeneral.hidden = false;
      return;
    }

    if (datos.expedientes.length === 0) {
      sinExpedientes.hidden = false;
      contenedorBandeja.innerHTML = "";
      return;
    }

    sinExpedientes.hidden = true;
    contenedorBandeja.innerHTML = datos.expedientes.map(filaExpedienteHtml).join("");
    asignarEventos();
  } catch (error) {
    estadoCarga.hidden = true;
    errorGeneral.textContent = "Error de conexión. Intente nuevamente.";
    errorGeneral.hidden = false;
  }
}

function asignarEventos() {
  contenedorBandeja.querySelectorAll(".btn-aprobar").forEach((btn) => {
    btn.addEventListener("click", () => aprobar(btn.closest("[data-nro]").dataset.nro));
  });
  contenedorBandeja.querySelectorAll(".btn-observar").forEach((btn) => {
    btn.addEventListener("click", () => abrirObservar(btn.closest("[data-nro]")));
  });
  contenedorBandeja.querySelectorAll(".btn-rechazar").forEach((btn) => {
    btn.addEventListener("click", () => abrirRechazar(btn.closest("[data-nro]").dataset.nro));
  });
}

async function aprobar(nro) {
  if (!confirm(`¿Aprobar el expediente ${nro}?`)) return;
  const respuesta = await fetch(`${API_BASE}/api/admin/expedientes/${nro}/decision`, {
    method: "POST",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ accion: "aprobar" }),
  });
  if (respuesta.ok) cargarBandeja();
  else alert((await respuesta.json()).error || "No se pudo aprobar.");
}

async function abrirObservar(fila) {
  nroEnAccion = fila.dataset.nro;
  const ccodigo = fila.dataset.ccodigo;
  document.getElementById("error-observar").hidden = true;
  document.getElementById("texto-comentario-observar").value = "";

  const select = document.getElementById("select-requisito-observar");
  select.innerHTML = "<option>Cargando...</option>";
  modalObservar.show();

  const respuesta = await fetch(`${API_BASE}/api/tramites/${encodeURIComponent(ccodigo)}/checklist`, {
    headers: headersAuth(),
  });
  const datos = await respuesta.json();
  select.innerHTML = datos.requisitos
    .map((r) => `<option value="${r.id_requisito}">${r.descripcion}</option>`)
    .join("");
}

document.getElementById("btn-confirmar-observar").addEventListener("click", async () => {
  const idRequisito = document.getElementById("select-requisito-observar").value;
  const comentario = document.getElementById("texto-comentario-observar").value.trim();
  const error = document.getElementById("error-observar");

  const respuesta = await fetch(`${API_BASE}/api/admin/expedientes/${nroEnAccion}/decision`, {
    method: "POST",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ accion: "observar", comentario, id_requisito: Number(idRequisito) }),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    error.textContent = datos.error;
    error.hidden = false;
    return;
  }

  modalObservar.hide();
  cargarBandeja();
});

function abrirRechazar(nro) {
  nroEnAccion = nro;
  document.getElementById("error-rechazar").hidden = true;
  document.getElementById("texto-motivo-rechazar").value = "";
  modalRechazar.show();
}

document.getElementById("btn-confirmar-rechazar").addEventListener("click", async () => {
  const motivo = document.getElementById("texto-motivo-rechazar").value.trim();
  const error = document.getElementById("error-rechazar");

  const respuesta = await fetch(`${API_BASE}/api/admin/expedientes/${nroEnAccion}/decision`, {
    method: "POST",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ accion: "rechazar", motivo }),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    error.textContent = datos.error;
    error.hidden = false;
    return;
  }

  modalRechazar.hide();
  cargarBandeja();
});

document.getElementById("btn-salir").addEventListener("click", () => limpiarToken());

cargarBandeja();

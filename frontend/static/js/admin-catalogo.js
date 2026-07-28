const API_BASE = "http://127.0.0.1:5000";

const estadoCarga = document.getElementById("estado-carga");
const errorGeneral = document.getElementById("error-general");
const tablaContenedor = document.getElementById("tabla-contenedor");
const tablaCatalogo = document.getElementById("tabla-catalogo");
const modalEditar = new bootstrap.Modal(document.getElementById("modal-editar"));

let ccodigoEnEdicion = null;
let oficinasCache = [];

function filaHtml(t) {
  const estadoBadge =
    t.estado === "ACTIVO"
      ? `<span class="badge badge-gratuito">Activo</span>`
      : `<span class="badge badge-estado-rojo">Inactivo</span>`;

  return `
    <tr data-ccodigo="${t.ccodigo}">
      <td><span class="badge border text-dark bg-white">${t.ccodigo}</span></td>
      <td class="small">${t.nombre}</td>
      <td>${t.plazo_dias ?? "—"}</td>
      <td>${estadoBadge}</td>
      <td class="text-end">
        <button type="button" class="btn btn-outline-secondary btn-sm btn-editar">Editar</button>
        <button type="button" class="btn btn-outline-${t.estado === "ACTIVO" ? "danger" : "success"} btn-sm btn-toggle-estado">
          ${t.estado === "ACTIVO" ? "Desactivar" : "Activar"}
        </button>
      </td>
    </tr>
  `;
}

async function cargarOficinas() {
  const respuesta = await fetch(`${API_BASE}/api/catalogo/filtros`);
  const datos = await respuesta.json();
  oficinasCache = datos.unidades || [];
  const select = document.getElementById("input-oficina");
  select.innerHTML =
    `<option value="">Sin cambio</option>` +
    oficinasCache.map((o) => `<option value="${o.id}">${o.nombre}</option>`).join("");
}

async function cargarCatalogo() {
  if (!obtenerToken()) {
    window.location.href = "login.html";
    return;
  }

  try {
    const respuesta = await fetch(`${API_BASE}/api/admin/catalogo`, { headers: headersAuth() });
    estadoCarga.hidden = true;

    if (respuesta.status === 401) {
      limpiarToken();
      window.location.href = "login.html";
      return;
    }
    if (respuesta.status === 403) {
      errorGeneral.textContent = "No tiene permisos de administrador del sistema.";
      errorGeneral.hidden = false;
      return;
    }

    const datos = await respuesta.json();
    tablaCatalogo.innerHTML = datos.tramites.map(filaHtml).join("");
    tablaContenedor.hidden = false;
    asignarEventos();
  } catch (error) {
    estadoCarga.hidden = true;
    errorGeneral.textContent = "Error de conexión. Intente nuevamente.";
    errorGeneral.hidden = false;
  }
}

function asignarEventos() {
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => abrirEditar(btn.closest("tr").dataset.ccodigo));
  });
  document.querySelectorAll(".btn-toggle-estado").forEach((btn) => {
    btn.addEventListener("click", () => toggleEstado(btn.closest("tr")));
  });
}

function abrirEditar(ccodigo) {
  ccodigoEnEdicion = ccodigo;
  document.getElementById("modal-editar-titulo").textContent = `Editar ${ccodigo}`;
  document.getElementById("input-plazo").value = "";
  document.getElementById("input-costo").value = "";
  document.getElementById("input-descripcion").value = "";
  document.getElementById("input-resolucion").value = "";
  document.getElementById("error-editar").hidden = true;
  modalEditar.show();
}

document.getElementById("btn-guardar-cambios").addEventListener("click", async () => {
  const error = document.getElementById("error-editar");
  const resolucion = document.getElementById("input-resolucion").value.trim();
  const plazo = document.getElementById("input-plazo").value;
  const costo = document.getElementById("input-costo").value;
  const oficina = document.getElementById("input-oficina").value;
  const descripcion = document.getElementById("input-descripcion").value.trim();

  const body = { numero_resolucion_rectoral: resolucion };
  if (plazo) body.plazo_dias = Number(plazo);
  if (costo) body.costo = Number(costo);
  if (oficina) body.oficina_responsable = Number(oficina);
  if (descripcion) body.descripcion = descripcion;

  const respuesta = await fetch(`${API_BASE}/api/admin/catalogo/${ccodigoEnEdicion}`, {
    method: "PUT",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    error.textContent = datos.error;
    error.hidden = false;
    return;
  }

  modalEditar.hide();
  cargarCatalogo();
});

async function toggleEstado(fila) {
  const ccodigo = fila.dataset.ccodigo;
  const estaActivo = fila.querySelector(".badge-gratuito") !== null;
  const nuevoEstado = estaActivo ? "INACTIVO" : "ACTIVO";
  const resolucion = prompt(`N° de resolución rectoral para ${nuevoEstado === "ACTIVO" ? "activar" : "desactivar"} este trámite:`);
  if (!resolucion) return;

  const respuesta = await fetch(`${API_BASE}/api/admin/catalogo/${ccodigo}/estado`, {
    method: "PATCH",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ estado: nuevoEstado, numero_resolucion_rectoral: resolucion }),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    alert(datos.error);
    return;
  }
  cargarCatalogo();
}

cargarOficinas();
cargarCatalogo();

const API_BASE = "http://127.0.0.1:5000";

const estadoCarga = document.getElementById("estado-carga");
const errorGeneral = document.getElementById("error-general");
const sinDatos = document.getElementById("sin-datos");
const contenidoReporte = document.getElementById("contenido-reporte");

if (!obtenerToken()) {
  window.location.href = "login.html";
}

if (obtenerRolDelToken() === "ADMINISTRADOR") {
  document.getElementById("contenedor-filtro-oficina").hidden = false;
  fetch(`${API_BASE}/api/catalogo/filtros`)
    .then((r) => r.json())
    .then((datos) => {
      const select = document.getElementById("filtro-oficina");
      select.innerHTML =
        `<option value="">Todas</option>` +
        (datos.unidades || []).map((o) => `<option value="${o.id}">${o.nombre}</option>`).join("");
    });
}

function construirQuery() {
  const params = new URLSearchParams();
  params.set("periodo", document.getElementById("filtro-periodo").value);
  const estado = document.getElementById("filtro-estado").value;
  if (estado) params.set("estado", estado);
  const oficina = document.getElementById("filtro-oficina")?.value;
  if (oficina) params.set("oficina", oficina);
  return params.toString();
}

function barraTop5Html(item, maximo) {
  const porcentaje = maximo > 0 ? Math.round((item.cantidad / maximo) * 100) : 0;
  return `
    <div class="mb-2">
      <div class="d-flex justify-content-between small mb-1">
        <span>${item.nombre}</span>
        <span class="fw-medium">${item.cantidad}</span>
      </div>
      <div class="progress" style="height: 10px;">
        <div class="progress-bar" role="progressbar" style="width: ${porcentaje}%; background-color: var(--unsaac-red);"></div>
      </div>
    </div>
  `;
}

async function generarReporte() {
  estadoCarga.hidden = false;
  errorGeneral.hidden = true;
  sinDatos.hidden = true;
  contenidoReporte.hidden = true;

  try {
    const respuesta = await fetch(`${API_BASE}/api/reportes?${construirQuery()}`, {
      headers: headersAuth(),
    });

    if (respuesta.status === 401) {
      limpiarToken();
      window.location.href = "login.html";
      return;
    }

    const datos = await respuesta.json();
    estadoCarga.hidden = true;

    if (respuesta.status === 403) {
      errorGeneral.textContent = datos.error || "No tiene permisos para ver reportes.";
      errorGeneral.hidden = false;
      return;
    }
    if (!respuesta.ok) {
      errorGeneral.textContent = datos.error || "No se pudo generar el reporte.";
      errorGeneral.hidden = false;
      return;
    }
    if (datos.sin_datos) {
      sinDatos.textContent = datos.mensaje;
      sinDatos.hidden = false;
      return;
    }

    document.getElementById("metrica-atendidos").textContent = datos.tramites_atendidos;
    document.getElementById("metrica-tiempo").textContent = datos.tiempo_promedio_dias ?? "—";
    document.getElementById("metrica-vencidos").textContent = datos.tramites_vencidos;
    document.getElementById("metrica-cumplimiento").textContent =
      datos.porcentaje_cumplimiento != null ? `${datos.porcentaje_cumplimiento}%` : "—";

    const maximo = Math.max(...datos.top_5_procedimientos.map((i) => i.cantidad), 1);
    document.getElementById("grafico-top5").innerHTML = datos.top_5_procedimientos
      .map((i) => barraTop5Html(i, maximo))
      .join("");

    contenidoReporte.hidden = false;
  } catch (error) {
    estadoCarga.hidden = true;
    errorGeneral.textContent = "Error de conexión. Intente nuevamente.";
    errorGeneral.hidden = false;
  }
}

async function exportar(formato) {
  const respuesta = await fetch(`${API_BASE}/api/reportes/exportar?formato=${formato}&${construirQuery()}`, {
    headers: headersAuth(),
  });

  if (!respuesta.ok) {
    alert("No se pudo exportar el reporte.");
    return;
  }

  const contentType = respuesta.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const datos = await respuesta.json();
    alert(datos.mensaje || "No hay datos para exportar en este período.");
    return;
  }

  const blob = await respuesta.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = formato === "excel" ? "reporte_tupa.xlsx" : "reporte_tupa.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("btn-generar").addEventListener("click", generarReporte);
document.getElementById("btn-exportar-pdf").addEventListener("click", () => exportar("pdf"));
document.getElementById("btn-exportar-excel").addEventListener("click", () => exportar("excel"));

generarReporte();

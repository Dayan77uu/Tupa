const API_BASE = window.TUPA_CONFIG.API_BASE_URL;
const DEBOUNCE_MS = 300;

const buscador = document.getElementById("buscador");
const filtroUnidad = document.getElementById("filtro-unidad");
const estadoCarga = document.getElementById("estado-carga");
const sinResultados = document.getElementById("sin-resultados");
const contenedorSugerencias = document.getElementById("contenedor-sugerencias");
const contenedorResultados = document.getElementById("contenedor-resultados");
const contadorResultados = document.getElementById("contador-resultados");

let temporizadorDebounce = null;

async function cargarFiltros() {
  try {
    const respuesta = await fetch(`${API_BASE}/api/catalogo/filtros`);
    const datos = await respuesta.json();

    datos.unidades.forEach((unidad) => {
      const opcion = document.createElement("option");
      opcion.value = unidad.id;
      opcion.textContent = unidad.nombre;
      filtroUnidad.appendChild(opcion);
    });
  } catch (error) {
    console.error("No se pudieron cargar los filtros", error);
  }
}

function esGratuito(costoResumen) {
  return /^S\/\s*0(\.00)?$/.test((costoResumen || "").trim());
}

function tarjetaHtml(tramite) {
  const badgeCosto = esGratuito(tramite.costo_resumen)
    ? `<span class="badge badge-gratuito">Gratuito</span>`
    : `<span class="badge badge-costo">${tramite.costo_resumen}</span>`;

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 tarjeta-tramite">
        <div class="card-body p-4 d-flex flex-column">
          <div class="d-flex align-items-start justify-content-between mb-2">
            <span class="badge border text-dark bg-white">${tramite.codigo}</span>
            ${badgeCosto}
          </div>
          <h3 class="h6 mb-3">${tramite.nombre}</h3>
          <div class="mt-auto d-flex gap-2">
            <a href="ficha.html?codigo=${encodeURIComponent(tramite.codigo)}" class="btn btn-institucional btn-sm flex-fill">Ver detalle</a>
            <a href="login.html" class="btn btn-outline-secondary btn-sm flex-fill">Solicitar</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderizarResultados(resultados) {
  contenedorResultados.innerHTML = resultados.map(tarjetaHtml).join("");
}

function renderizarSugerencias(sugerencias) {
  if (!sugerencias || sugerencias.length === 0) {
    contenedorSugerencias.innerHTML = "";
    return;
  }

  contenedorSugerencias.innerHTML =
    "<p class='mb-2 fw-medium'>Quizás quisiste decir:</p>" +
    sugerencias.map(tarjetaHtml).join("");
}

async function buscarCatalogo() {
  const parametros = new URLSearchParams();

  if (buscador.value.trim()) parametros.set("q", buscador.value.trim());
  if (filtroUnidad.value) parametros.set("unidad", filtroUnidad.value);

  estadoCarga.hidden = false;
  sinResultados.hidden = true;
  contadorResultados.textContent = "";
  contenedorResultados.innerHTML = "";

  try {
    const respuesta = await fetch(`${API_BASE}/api/catalogo?${parametros.toString()}`);
    const datos = await respuesta.json();

    if (datos.resultados.length === 0) {
      sinResultados.hidden = false;
      renderizarSugerencias(datos.sugerencias);
    } else {
      renderizarResultados(datos.resultados);
      contadorResultados.textContent = `Mostrando ${datos.resultados.length} trámite${datos.resultados.length === 1 ? "" : "s"}`;
    }
  } catch (error) {
    contenedorResultados.innerHTML =
      "<div class='col-12'><div class='alert alert-danger'>Error de conexión. Intente nuevamente.</div></div>";
  } finally {
    estadoCarga.hidden = true;
  }
}

buscador.addEventListener("input", () => {
  clearTimeout(temporizadorDebounce);
  temporizadorDebounce = setTimeout(buscarCatalogo, DEBOUNCE_MS);
});

filtroUnidad.addEventListener("change", buscarCatalogo);

cargarFiltros();
buscarCatalogo();

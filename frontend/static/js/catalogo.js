const API_BASE = "http://127.0.0.1:5000";
const DEBOUNCE_MS = 300;

const buscador = document.getElementById("buscador");
const filtroUnidad = document.getElementById("filtro-unidad");
const estadoCarga = document.getElementById("estado-carga");
const sinResultados = document.getElementById("sin-resultados");
const contenedorSugerencias = document.getElementById("contenedor-sugerencias");
const contenedorResultados = document.getElementById("contenedor-resultados");

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

function tarjetaHtml(tramite) {
  return `
    <div class="col-md-4">
      <div class="card h-100 tarjeta-tramite" data-codigo="${tramite.codigo}">
        <div class="card-body">
          <span class="badge bg-light text-dark mb-2">${tramite.codigo}</span>
          <h2 class="h6 card-title">${tramite.nombre}</h2>
          <p class="card-text text-muted mb-0">${tramite.costo_resumen}</p>
        </div>
      </div>
    </div>
  `;
}

function renderizarResultados(resultados) {
  contenedorResultados.innerHTML = resultados.map(tarjetaHtml).join("");

  contenedorResultados.querySelectorAll(".tarjeta-tramite").forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const codigo = tarjeta.dataset.codigo;
      window.location.href = `ficha.html?codigo=${encodeURIComponent(codigo)}`;
    });
  });
}

function renderizarSugerencias(sugerencias) {
  if (!sugerencias || sugerencias.length === 0) {
    contenedorSugerencias.innerHTML = "";
    return;
  }

  contenedorSugerencias.innerHTML =
    "<p class='mb-2'>Quizás quisiste decir:</p>" +
    "<div class='row g-3'>" +
    sugerencias.map(tarjetaHtml).join("") +
    "</div>";

  contenedorSugerencias.querySelectorAll(".tarjeta-tramite").forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const codigo = tarjeta.dataset.codigo;
      window.location.href = `ficha.html?codigo=${encodeURIComponent(codigo)}`;
    });
  });
}

async function buscarCatalogo() {
  const parametros = new URLSearchParams();

  if (buscador.value.trim()) parametros.set("q", buscador.value.trim());
  if (filtroUnidad.value) parametros.set("unidad", filtroUnidad.value);

  estadoCarga.hidden = false;
  sinResultados.hidden = true;
  contenedorResultados.innerHTML = "";

  try {
    const respuesta = await fetch(`${API_BASE}/api/catalogo?${parametros.toString()}`);
    const datos = await respuesta.json();

    if (datos.resultados.length === 0) {
      sinResultados.hidden = false;
      renderizarSugerencias(datos.sugerencias);
    } else {
      renderizarResultados(datos.resultados);
    }
  } catch (error) {
    contenedorResultados.innerHTML =
      "<div class='alert alert-danger'>Error de conexión. Intente nuevamente.</div>";
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

const API_BASE = "http://127.0.0.1:5000";

const estadoCarga = document.getElementById("estado-carga");
const errorFicha = document.getElementById("error-ficha");
const contenidoFicha = document.getElementById("contenido-ficha");

function obtenerCodigoDeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("codigo");
}

function renderizarFicha(ficha) {
  document.getElementById("ficha-codigo").textContent = ficha.codigo;
  document.getElementById("ficha-nombre").textContent = ficha.nombre;
  document.getElementById("ficha-descripcion").textContent = ficha.descripcion || "";
  document.getElementById("ficha-costo").textContent = ficha.costo_resumen;
  document.getElementById("ficha-plazo").textContent = ficha.plazo_dias_habiles
    ? `${ficha.plazo_dias_habiles} días hábiles`
    : "No especificado";
  document.getElementById("ficha-oficina").textContent =
    ficha.oficinas_responsables.length > 0
      ? ficha.oficinas_responsables.join(", ")
      : "No especificado";

  const listaRequisitos = document.getElementById("ficha-requisitos");
  if (ficha.requisitos.length === 0) {
    listaRequisitos.innerHTML = "<li class='text-muted'>Sin requisitos registrados.</li>";
  } else {
    listaRequisitos.innerHTML = ficha.requisitos.map((r) => `<li>${r}</li>`).join("");
  }

  estadoCarga.hidden = true;
  contenidoFicha.hidden = false;
}

async function cargarFicha() {
  const codigo = obtenerCodigoDeUrl();

  if (!codigo) {
    estadoCarga.hidden = true;
    errorFicha.textContent = "No se especificó un trámite.";
    errorFicha.hidden = false;
    return;
  }

  try {
    const respuesta = await fetch(`${API_BASE}/api/catalogo/${encodeURIComponent(codigo)}`);

    if (!respuesta.ok) {
      const datos = await respuesta.json();
      estadoCarga.hidden = true;
      errorFicha.textContent = datos.error || "No se pudo cargar la ficha.";
      errorFicha.hidden = false;
      return;
    }

    renderizarFicha(await respuesta.json());
  } catch (error) {
    estadoCarga.hidden = true;
    errorFicha.textContent = "Error de conexión. Intente nuevamente.";
    errorFicha.hidden = false;
  }
}

cargarFicha();

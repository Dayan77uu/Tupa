const API_BASE = "http://127.0.0.1:5000";

const estadoCarga = document.getElementById("estado-carga");
const errorGeneral = document.getElementById("error-general");
const contenidoSubsanar = document.getElementById("contenido-subsanar");
const btnReenviar = document.getElementById("btn-reenviar");
const archivoInput = document.getElementById("archivo-subsanar");
const mensajeArchivo = document.getElementById("mensaje-archivo");
const errorSubsanar = document.getElementById("error-subsanar");
const exitoSubsanar = document.getElementById("exito-subsanar");

let idRequisitoObservado = null;

const ESTADO_LABEL = {
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  OBSERVADO: "Observado",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

function obtenerNroDeUrl() {
  return new URLSearchParams(window.location.search).get("nro");
}

async function cargarObservacion() {
  if (!obtenerToken()) {
    window.location.href = "login.html";
    return;
  }

  const nro = obtenerNroDeUrl();
  if (!nro) {
    estadoCarga.hidden = true;
    errorGeneral.textContent = "No se especificó un expediente.";
    errorGeneral.hidden = false;
    return;
  }

  try {
    const respuesta = await fetch(`${API_BASE}/api/expedientes/${nro}/observacion`, {
      headers: headersAuth(),
    });

    if (respuesta.status === 401) {
      limpiarToken();
      window.location.href = "login.html";
      return;
    }

    const datos = await respuesta.json();
    estadoCarga.hidden = true;

    if (!respuesta.ok) {
      errorGeneral.textContent = datos.error || "No se pudo cargar la observación.";
      errorGeneral.hidden = false;
      return;
    }

    idRequisitoObservado = datos.id_requisito_observado;
    document.getElementById("texto-comentario").textContent =
      datos.comentario || "Sin descripción registrada.";
    document.getElementById("texto-requisito").textContent =
      datos.descripcion_requisito || "Documento observado";

    contenidoSubsanar.hidden = false;
  } catch (error) {
    estadoCarga.hidden = true;
    errorGeneral.textContent = "Error de conexión. Intente nuevamente.";
    errorGeneral.hidden = false;
  }
}

archivoInput.addEventListener("change", () => {
  btnReenviar.disabled = archivoInput.files.length === 0;
  mensajeArchivo.textContent = "";
});

btnReenviar.addEventListener("click", async () => {
  const nro = obtenerNroDeUrl();
  const archivo = archivoInput.files[0];
  if (!archivo) return;

  errorSubsanar.hidden = true;
  exitoSubsanar.hidden = true;
  btnReenviar.disabled = true;
  btnReenviar.textContent = "Enviando...";

  const formData = new FormData();
  formData.append("id_requisito", idRequisitoObservado);
  formData.append("archivo", archivo);

  try {
    const respuesta = await fetch(`${API_BASE}/api/expedientes/${nro}/subsanar`, {
      method: "POST",
      headers: headersAuth(),
      body: formData,
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      errorSubsanar.textContent = datos.error || "No se pudo subsanar el documento.";
      errorSubsanar.hidden = false;
      btnReenviar.disabled = false;
      btnReenviar.textContent = "Reenviar expediente";
      return;
    }

    exitoSubsanar.textContent = `Expediente reenviado. Nuevo estado: ${ESTADO_LABEL[datos.estado] || datos.estado}.`;
    exitoSubsanar.hidden = false;
    btnReenviar.textContent = "Expediente reenviado";
    setTimeout(() => (window.location.href = "mis-tramites.html"), 1500);
  } catch (error) {
    errorSubsanar.textContent = "Error de conexión. Intente nuevamente.";
    errorSubsanar.hidden = false;
    btnReenviar.disabled = false;
    btnReenviar.textContent = "Reenviar expediente";
  }
});

cargarObservacion();

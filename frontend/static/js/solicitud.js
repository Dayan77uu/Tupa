const API_BASE = "http://127.0.0.1:5000";

const estadoCarga = document.getElementById("estado-carga");
const errorGeneral = document.getElementById("error-general");
const contenidoSolicitud = document.getElementById("contenido-solicitud");
const listaRequisitos = document.getElementById("lista-requisitos");
const btnEnviarSolicitud = document.getElementById("btn-enviar-solicitud");
const ayudaEnvio = document.getElementById("ayuda-envio");
const errorConfirmar = document.getElementById("error-confirmar");
const exitoConfirmar = document.getElementById("exito-confirmar");
const formVoucher = document.getElementById("form-voucher");
const estadoVoucher = document.getElementById("estado-voucher");

let nroExpediente = null;

function obtenerCodigoDeUrl() {
  return new URLSearchParams(window.location.search).get("codigo");
}

function headersAuth(extra = {}) {
  return { Authorization: `Bearer ${obtenerToken()}`, ...extra };
}

function mostrarErrorGeneral(mensaje) {
  estadoCarga.hidden = true;
  errorGeneral.textContent = mensaje;
  errorGeneral.hidden = false;
}

async function manejarRespuesta(respuesta) {
  if (respuesta.status === 401) {
    limpiarToken();
    window.location.href = "login.html";
    return null;
  }
  return respuesta.json();
}

function filaRequisitoHtml(req) {
  return `
    <div class="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom" data-requisito="${req.id_requisito}">
      <div class="icono-requisito" id="icono-req-${req.id_requisito}">
        <i class="bi bi-hourglass-split"></i>
      </div>
      <div class="flex-grow-1">
        <p class="mb-1 small">${req.descripcion}${req.obligatorio ? "" : " <span class='text-muted'>(opcional)</span>"}</p>
        <input type="file" class="form-control form-control-sm" id="archivo-req-${req.id_requisito}"
          accept="${req.formatos_permitidos.map((f) => "." + f).join(",")}" />
        <p class="small text-muted mb-0 mt-1">Formatos: ${req.formatos_permitidos.join(", ")} — máx. ${req.tamano_max_mb} MB</p>
        <p class="small mb-0 mt-1" id="mensaje-req-${req.id_requisito}"></p>
      </div>
    </div>
  `;
}

function marcarRequisito(idRequisito, subido) {
  const icono = document.getElementById(`icono-req-${idRequisito}`);
  icono.innerHTML = subido
    ? `<i class="bi bi-check-lg" style="color:#10B981"></i>`
    : `<i class="bi bi-hourglass-split"></i>`;
}

async function subirArchivo(idRequisito, archivo) {
  const mensaje = document.getElementById(`mensaje-req-${idRequisito}`);
  mensaje.className = "small mb-0 mt-1 text-muted";
  mensaje.textContent = "Subiendo...";

  const formData = new FormData();
  formData.append("id_requisito", idRequisito);
  formData.append("archivo", archivo);

  try {
    const respuesta = await fetch(`${API_BASE}/api/solicitudes/${nroExpediente}/documentos`, {
      method: "POST",
      headers: headersAuth(),
      body: formData,
    });
    const datos = await manejarRespuesta(respuesta);
    if (datos === null) return;

    if (!respuesta.ok) {
      mensaje.className = "small mb-0 mt-1 text-danger";
      mensaje.textContent = datos.error || "No se pudo subir el archivo.";
      marcarRequisito(idRequisito, false);
      return;
    }

    mensaje.className = "small mb-0 mt-1 text-success";
    mensaje.textContent = "Documento cargado correctamente.";
    datos.requisitos.forEach((r) => marcarRequisito(r.id_requisito, r.subido));
    actualizarBotonEnvio(datos.completo, datos.faltantes);
  } catch (error) {
    mensaje.className = "small mb-0 mt-1 text-danger";
    mensaje.textContent = "Error de conexión. Intente nuevamente.";
  }
}

function actualizarBotonEnvio(completo, faltantes) {
  btnEnviarSolicitud.disabled = !completo;
  ayudaEnvio.textContent = completo
    ? "Todos los documentos obligatorios están completos."
    : `Faltan: ${faltantes.join(", ")}`;
}

async function cargarChecklist(codigo) {
  const respuesta = await fetch(`${API_BASE}/api/tramites/${encodeURIComponent(codigo)}/checklist`, {
    headers: headersAuth(),
  });
  const datos = await manejarRespuesta(respuesta);
  if (datos === null) return;

  if (!respuesta.ok) {
    mostrarErrorGeneral(datos.error || "No se pudo cargar el checklist.");
    return;
  }

  if (datos.requisitos.length === 0) {
    listaRequisitos.innerHTML = "<p class='text-muted small mb-0'>Este trámite no tiene requisitos registrados.</p>";
    actualizarBotonEnvio(true, []);
    return;
  }

  listaRequisitos.innerHTML = datos.requisitos.map(filaRequisitoHtml).join("");

  datos.requisitos.forEach((req) => {
    document.getElementById(`archivo-req-${req.id_requisito}`).addEventListener("change", (evento) => {
      const archivo = evento.target.files[0];
      if (archivo) subirArchivo(req.id_requisito, archivo);
    });
  });

  const estadoInicial = await (
    await fetch(`${API_BASE}/api/solicitudes/${nroExpediente}/estado-checklist`, { headers: headersAuth() })
  ).json();
  actualizarBotonEnvio(estadoInicial.completo, estadoInicial.faltantes);
}

async function cargarPerfil() {
  const respuesta = await fetch(`${API_BASE}/api/mi-perfil`, { headers: headersAuth() });
  const datos = await manejarRespuesta(respuesta);
  if (datos === null) return;

  if (!respuesta.ok) {
    mostrarErrorGeneral(datos.error || "No se pudo cargar su perfil.");
    return;
  }

  document.getElementById("perfil-nombre").textContent = datos.nombre || "No especificado";
  document.getElementById("perfil-correo").textContent = datos.correo || "No especificado";
  document.getElementById("perfil-carrera").textContent = datos.carrera || "No especificado";
}

async function crearSolicitud(codigo) {
  const respuesta = await fetch(`${API_BASE}/api/solicitudes`, {
    method: "POST",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id_tramite: codigo }),
  });
  const datos = await manejarRespuesta(respuesta);
  if (datos === null) return null;

  if (!respuesta.ok) {
    mostrarErrorGeneral(datos.error || "No se pudo registrar la solicitud.");
    return null;
  }

  return datos.nro_expediente;
}

async function cargarNombreTramite(codigo) {
  try {
    const respuesta = await fetch(`${API_BASE}/api/catalogo/${encodeURIComponent(codigo)}`);
    if (respuesta.ok) {
      const datos = await respuesta.json();
      document.getElementById("nombre-tramite").textContent = datos.nombre;
    }
  } catch (error) {
    // La solicitud ya se registro; el nombre del tramite es solo informativo.
  }
}

formVoucher.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const btn = document.getElementById("btn-registrar-voucher");
  btn.disabled = true;
  estadoVoucher.className = "ms-2 small text-muted";
  estadoVoucher.textContent = "Registrando...";

  try {
    const respuesta = await fetch(`${API_BASE}/api/solicitudes/${nroExpediente}/voucher`, {
      method: "POST",
      headers: headersAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        numero_voucher: document.getElementById("voucher-numero").value,
        monto: parseFloat(document.getElementById("voucher-monto").value),
        fecha_pago: document.getElementById("voucher-fecha").value,
      }),
    });
    const datos = await manejarRespuesta(respuesta);
    if (datos === null) return;

    if (!respuesta.ok) {
      estadoVoucher.className = "ms-2 small text-danger";
      estadoVoucher.textContent = datos.error || "No se pudo registrar el voucher.";
      return;
    }

    estadoVoucher.className = "ms-2 small text-success";
    estadoVoucher.textContent = "Voucher pendiente de validación por Tesorería.";
  } catch (error) {
    estadoVoucher.className = "ms-2 small text-danger";
    estadoVoucher.textContent = "Error de conexión.";
  } finally {
    btn.disabled = false;
  }
});

btnEnviarSolicitud.addEventListener("click", async () => {
  errorConfirmar.hidden = true;
  exitoConfirmar.hidden = true;
  btnEnviarSolicitud.disabled = true;
  btnEnviarSolicitud.textContent = "Enviando...";

  try {
    const respuesta = await fetch(`${API_BASE}/api/solicitudes/${nroExpediente}/confirmar`, {
      method: "POST",
      headers: headersAuth(),
    });
    const datos = await manejarRespuesta(respuesta);
    if (datos === null) return;

    if (!respuesta.ok) {
      errorConfirmar.textContent = `${datos.error} ${(datos.faltantes || []).join(", ")}`.trim();
      errorConfirmar.hidden = false;
      btnEnviarSolicitud.disabled = false;
      return;
    }

    exitoConfirmar.textContent = `Solicitud recibida. Número de expediente: ${datos.nro_expediente}`;
    exitoConfirmar.hidden = false;
    btnEnviarSolicitud.textContent = "Solicitud enviada";
  } catch (error) {
    errorConfirmar.textContent = "Error de conexión. Intente nuevamente.";
    errorConfirmar.hidden = false;
    btnEnviarSolicitud.disabled = false;
  } finally {
    if (btnEnviarSolicitud.textContent === "Enviando...") {
      btnEnviarSolicitud.textContent = "Enviar solicitud";
    }
  }
});

async function iniciar() {
  if (!obtenerToken()) {
    window.location.href = "login.html";
    return;
  }

  const codigo = obtenerCodigoDeUrl();
  if (!codigo) {
    mostrarErrorGeneral("No se especificó un trámite.");
    return;
  }

  await cargarPerfil();
  await cargarNombreTramite(codigo);

  nroExpediente = await crearSolicitud(codigo);
  if (!nroExpediente) return;

  document.getElementById("nro-expediente").textContent = nroExpediente;
  await cargarChecklist(codigo);

  estadoCarga.hidden = true;
  contenidoSolicitud.hidden = false;
}

iniciar();

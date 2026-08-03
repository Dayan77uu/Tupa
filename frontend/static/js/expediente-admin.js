const API_BASE = window.TUPA_CONFIG.API_BASE_URL;

const ESTADO_LABEL_COLOR = {
  PENDIENTE: "gris",
  EN_REVISION: "azul",
  OBSERVADO: "naranja",
  APROBADO: "verde",
  RECHAZADO: "rojo",
};

function obtenerNroDeUrl() {
  return new URLSearchParams(window.location.search).get("nro");
}

async function verDocumento(idDocumento, nombreArchivo) {
  const respuesta = await fetch(`${API_BASE}/api/admin/documentos/${idDocumento}`, {
    headers: headersAuth(),
  });
  if (!respuesta.ok) {
    alert("No se pudo cargar el documento.");
    return;
  }
  const blob = await respuesta.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

function documentoItemHtml(d) {
  return `
    <div class="d-flex align-items-center justify-content-between border-bottom py-2">
      <div>
        <p class="mb-0 small fw-medium">${d.descripcion_requisito || "Documento"}</p>
        <p class="mb-0 text-muted" style="font-size:0.75rem">${d.nombre_archivo}</p>
      </div>
      <button type="button" class="btn btn-outline-secondary btn-sm btn-ver-doc" data-id="${d.id_documento}" data-nombre="${d.nombre_archivo}">
        <i class="bi bi-eye"></i> Ver
      </button>
    </div>
  `;
}

function historialItemHtml(m) {
  let texto = "";
  if (m.oficina_nueva) {
    texto = `Derivado de oficina ${m.oficina_anterior} a oficina ${m.oficina_nueva}`;
  } else {
    texto = `${m.estado_anterior || ""} → ${m.estado_nuevo}`;
  }
  return `
    <div class="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
      <div class="icono-requisito"><i class="bi bi-arrow-right"></i></div>
      <div>
        <p class="mb-1 small fw-medium">${texto}</p>
        ${m.comentario ? `<p class="mb-1 small text-muted">${m.comentario}</p>` : ""}
        <p class="mb-0 text-muted" style="font-size:0.75rem">${(m.fecha_hora || "").replace("T", " ")}</p>
      </div>
    </div>
  `;
}

async function cargarDetalle() {
  if (!obtenerToken()) {
    window.location.href = "login.html";
    return;
  }

  const nro = obtenerNroDeUrl();
  const estadoCarga = document.getElementById("estado-carga");
  const errorGeneral = document.getElementById("error-general");

  try {
    const respuesta = await fetch(`${API_BASE}/api/admin/expedientes/${nro}`, {
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
      errorGeneral.textContent = datos.error || "No se pudo cargar el expediente.";
      errorGeneral.hidden = false;
      return;
    }

    document.getElementById("texto-nro").textContent = datos.nro_expediente;
    document.getElementById("texto-tramite").textContent = datos.nombre_tramite || "";
    document.getElementById("texto-solicitante").textContent = datos.solicitante.nombre || "";
    document.getElementById("texto-correo").textContent = datos.solicitante.correo || "";

    const badgeEstado = document.getElementById("badge-estado");
    badgeEstado.textContent = datos.estado_label;
    badgeEstado.className = `badge badge-estado-${ESTADO_LABEL_COLOR[datos.estado] || "gris"}`;

    document.getElementById("lista-documentos").innerHTML = datos.documentos.map(documentoItemHtml).join("");
    document.querySelectorAll(".btn-ver-doc").forEach((btn) => {
      btn.addEventListener("click", () => verDocumento(btn.dataset.id, btn.dataset.nombre));
    });

    document.getElementById("lista-historial").innerHTML =
      datos.historial.length > 0
        ? datos.historial.map(historialItemHtml).join("")
        : "<p class='text-muted small mb-0'>Sin movimientos.</p>";

    document.getElementById("voucher-numero").textContent = datos.voucher.numero || "—";
    document.getElementById("voucher-monto").textContent =
      datos.voucher.monto != null ? `S/ ${datos.voucher.monto.toFixed(2)}` : "—";
    document.getElementById("voucher-estado").textContent = datos.voucher.estado || "Sin registrar";

    if (!datos.voucher.estado) {
      document.getElementById("voucher-acciones").hidden = true;
    }

    document.getElementById("contenido").hidden = false;

    await cargarOficinasValidas(nro);

    document.getElementById("btn-validar-voucher").addEventListener("click", () => validarVoucher(nro, "validado"));
    document.getElementById("btn-rechazar-voucher").addEventListener("click", () => {
      const motivo = prompt("Motivo del rechazo del voucher:");
      if (motivo) validarVoucher(nro, "rechazado", motivo);
    });
    document.getElementById("btn-derivar").addEventListener("click", () => derivar(nro));
  } catch (error) {
    estadoCarga.hidden = true;
    errorGeneral.textContent = "Error de conexión. Intente nuevamente.";
    errorGeneral.hidden = false;
  }
}

async function validarVoucher(nro, resultado, motivo) {
  const errorVoucher = document.getElementById("error-voucher");
  errorVoucher.hidden = true;

  const respuesta = await fetch(`${API_BASE}/api/admin/expedientes/${nro}/voucher/validar`, {
    method: "POST",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ resultado, motivo }),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    errorVoucher.textContent = datos.error;
    errorVoucher.hidden = false;
    return;
  }

  document.getElementById("voucher-estado").textContent = datos.estado_voucher;
}

async function cargarOficinasValidas(nro) {
  const select = document.getElementById("select-oficina-destino");
  const respuesta = await fetch(`${API_BASE}/api/admin/expedientes/${nro}/oficinas-validas`, {
    headers: headersAuth(),
  });
  const datos = await respuesta.json();

  if (!datos.oficinas || datos.oficinas.length === 0) {
    select.innerHTML = "<option value=''>No hay oficinas de destino configuradas</option>";
    document.getElementById("btn-derivar").disabled = true;
    return;
  }

  select.innerHTML = datos.oficinas.map((o) => `<option value="${o.id}">${o.nombre}</option>`).join("");
}

async function derivar(nro) {
  const oficinaDestino = document.getElementById("select-oficina-destino").value;
  const comentario = document.getElementById("texto-comentario-derivar").value.trim();
  const errorDerivar = document.getElementById("error-derivar");
  const exitoDerivar = document.getElementById("exito-derivar");
  errorDerivar.hidden = true;
  exitoDerivar.hidden = true;

  const respuesta = await fetch(`${API_BASE}/api/admin/expedientes/${nro}/derivar`, {
    method: "POST",
    headers: headersAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify({ oficina_destino: Number(oficinaDestino), comentario }),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    errorDerivar.textContent = datos.error;
    errorDerivar.hidden = false;
    return;
  }

  exitoDerivar.textContent = "Expediente derivado correctamente.";
  exitoDerivar.hidden = false;
  setTimeout(() => (window.location.href = "bandeja.html"), 1200);
}

cargarDetalle();

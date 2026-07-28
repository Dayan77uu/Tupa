"""
Carga de datos reales del TUPA (CSV oficial) sobre el catalogo de Sprint 4/5.

Cruce CSV <-> tcatalogotramite: los codigos del CSV no coinciden con los
codigos reales (prefijo "510" vs "884"/otros - ediciones distintas del TUPA),
asi que el cruce se hizo por similitud de nombre normalizado. Solo se aplican
aqui los pares confirmados por el usuario: coincidencia exacta de nombre o
similitud >= 0.90 (ver scratchpad/fuzzy_match2.py -> confirmados.json).
Los ~96 tramites del CSV sin match confiable NO se tocan (se reportan aparte).

Uso: backend/venv/Scripts/python.exe -m scripts.cargar_tupa_real
"""
import io
import json
from datetime import datetime

from app import create_app
from app.extensions import db
from app.models.tramite import CatalogoTramite, UnidadTramite, MontoTramite, UnidadOrganizativa
from app.models.flujo_derivacion import FlujoDerivacion
from app.models.historial_catalogo import HistorialCatalogo

CONFIRMADOS_PATH = (
    r"C:/Users/User/AppData/Local/Temp/claude/c--Users-User-Tupa/"
    r"dc79bd91-2e5b-4965-a8ac-86262cb1be01/scratchpad/confirmados.json"
)

NUMERO_RESOLUCION = "Carga TUPA oficial (CSV, sin resolucion)"

# Normalizacion de nombres de oficina vistos en el CSV -> nombre canonico
# (confirmado con el usuario: son la misma oficina / se asimilan a esta).
ALIAS_OFICINA = {
    "secretaria del centro de computo": "Centro de Computo",
    "direccion del centro de computo": "Centro de Computo",
    "mesa de partes facultad": "Decanato de la Facultad",
    "centro de computo": "Centro de Computo",
    "direccion general de admision": "Direccion General de Admision",
    "direccion de registros y servicios academicos": "Direccion de Registros y Servicios Academicos",
    "secretaria general": "Secretaria General",
    "unidad de tramite documentario": "Unidad de Tramite Documentario",
    "decanato de la facultad": "Decanato de la Facultad",
    "rectorado": "Rectorado",
    "direccion de red de comunicaciones": "Direccion de Red de Comunicaciones",
    "direccion de la escuela de posgrado": "Direccion de la Escuela de Posgrado",
}

# Nombres canonicos "bonitos" (con tildes) para crear en tunidadorganizativa,
# tomados literalmente de la lista de 13 oficinas que dio el usuario.
NOMBRE_BONITO = {
    "Decanato de la Facultad": "Decanato de la Facultad",
    "Vice Rectorado Academico": "Vice Rectorado Académico",
    "Rectorado": "Rectorado",
    "Direccion de la Escuela de Posgrado": "Dirección de la Escuela de Posgrado",
    "Secretaria General": "Secretaría General",
    "Centro de Computo": "Centro de Cómputo",
    "Direccion de Registros y Servicios Academicos": "Dirección de Registros y Servicios Académicos",
    "Direccion de Biblioteca Central": "Dirección de Biblioteca Central",
    "Direccion General de Admision": "Dirección General de Admisión",
    "Direccion de Sistemas de Informacion": "Dirección de Sistemas de Información",
    "Direccion de Red de Comunicaciones": "Dirección de Red de Comunicaciones",
    "Direccion General de Administracion": "Dirección General de Administración",
    "Unidad de Tramite Documentario": "Unidad de Trámite Documentario",
}


def _clave_oficina(nombre_csv):
    limpio = nombre_csv.split(":")[0].strip()
    import re
    import unicodedata

    sin_tildes = "".join(
        c for c in unicodedata.normalize("NFD", limpio) if unicodedata.category(c) != "Mn"
    )
    return re.sub(r"\s+", " ", sin_tildes).strip().lower()


def _get_or_create_oficina(clave_canonica, cache):
    if clave_canonica in cache:
        return cache[clave_canonica]

    nombre_bonito = NOMBRE_BONITO[clave_canonica]
    oficina = UnidadOrganizativa.query.filter_by(cnombreunidadorganizativa=nombre_bonito).first()
    if oficina is None:
        oficina = UnidadOrganizativa(cnombreunidadorganizativa=nombre_bonito)
        db.session.add(oficina)
        db.session.flush()
        print(f"  Oficina creada: {nombre_bonito} (id={oficina.nidtunidadorganizativa})")
    else:
        print(f"  Oficina ya existia: {nombre_bonito} (id={oficina.nidtunidadorganizativa})")
    cache[clave_canonica] = oficina.nidtunidadorganizativa
    return oficina.nidtunidadorganizativa


def _registrar_cambio(ccodigo, campo, valor_anterior, valor_nuevo):
    db.session.add(
        HistorialCatalogo(
            ccodigo=ccodigo,
            campo_modificado=campo,
            valor_anterior=str(valor_anterior) if valor_anterior is not None else None,
            valor_nuevo=str(valor_nuevo) if valor_nuevo is not None else None,
            usuario=None,
            numero_resolucion=NUMERO_RESOLUCION,
        )
    )


def run():
    with io.open(CONFIRMADOS_PATH, encoding="utf-8") as f:
        confirmados = json.load(f)

    app = create_app()
    with app.app_context():
        cache_oficinas = {}
        actualizados = []
        sin_tramite_real = []
        flujo_creados = 0
        flujo_omitidos_mismo = 0

        for c in confirmados:
            ccodigo = c["real_codigo"]
            tramite = db.session.get(CatalogoTramite, ccodigo)
            if tramite is None:
                sin_tramite_real.append(c)
                continue

            print(f"\n{ccodigo} - {c['real_nombre']}")
            cambios = []

            # --- costo ---
            monto_raw = (c.get("monto") or "").strip()
            if monto_raw and monto_raw.lower() != "gratuito":
                try:
                    costo = float(monto_raw.replace(",", ""))
                except ValueError:
                    costo = None
            elif monto_raw.lower() == "gratuito":
                costo = 0.0
            else:
                costo = None

            if costo is not None:
                ahora = datetime.utcnow()
                vigentes = MontoTramite.query.filter(
                    MontoTramite.ccodigo == ccodigo,
                    MontoTramite.dfechainicio <= ahora,
                    db.or_(MontoTramite.dfechafin.is_(None), MontoTramite.dfechafin >= ahora),
                ).all()
                valor_anterior = vigentes[0].nmonto if vigentes else None
                if valor_anterior is None or float(valor_anterior) != costo:
                    for m in vigentes:
                        m.dfechafin = ahora
                    db.session.add(
                        MontoTramite(
                            ccodigo=ccodigo,
                            nmonto=costo,
                            cdescripcionpago="Carga de datos reales del TUPA (CSV oficial)",
                            dfechainicio=ahora,
                            dfechafin=None,
                        )
                    )
                    _registrar_cambio(ccodigo, "costo", valor_anterior, costo)
                    cambios.append(f"costo: {valor_anterior} -> {costo}")

            # --- plazo ---
            plazo_raw = (c.get("plazo_dias_habiles") or "").strip()
            if plazo_raw:
                try:
                    plazo = int(float(plazo_raw))
                except ValueError:
                    plazo = None
                if plazo is not None and plazo != tramite.nplazodias:
                    anterior = tramite.nplazodias
                    tramite.nplazodias = plazo
                    _registrar_cambio(ccodigo, "plazo_dias", anterior, plazo)
                    cambios.append(f"plazo_dias: {anterior} -> {plazo}")

            # --- oficina responsable (unidad_aprobacion) ---
            clave_aprob = ALIAS_OFICINA.get(_clave_oficina(c["unidad_aprobacion"]))
            id_oficina_aprob = None
            if clave_aprob:
                id_oficina_aprob = _get_or_create_oficina(clave_aprob, cache_oficinas)
                actual = UnidadTramite.query.filter_by(ccodigo=ccodigo).first()
                valor_anterior = actual.nidtunidadorganizativa if actual else None
                if valor_anterior != id_oficina_aprob:
                    UnidadTramite.query.filter_by(ccodigo=ccodigo).delete()
                    db.session.add(UnidadTramite(ccodigo=ccodigo, nidtunidadorganizativa=id_oficina_aprob))
                    _registrar_cambio(ccodigo, "oficina_responsable", valor_anterior, id_oficina_aprob)
                    cambios.append(f"oficina_responsable -> {NOMBRE_BONITO[clave_aprob]} (id={id_oficina_aprob})")

            # --- flujo de derivacion (unidad_presentacion -> unidad_aprobacion) ---
            clave_present = ALIAS_OFICINA.get(_clave_oficina(c["unidad_presentacion"]))
            if clave_present and clave_aprob:
                id_origen = _get_or_create_oficina(clave_present, cache_oficinas)
                id_destino = id_oficina_aprob
                if id_origen == id_destino:
                    flujo_omitidos_mismo += 1
                    cambios.append("(sin derivacion: origen y destino son la misma oficina)")
                else:
                    existente = FlujoDerivacion.query.filter_by(
                        ccodigo=ccodigo, oficina_origen=id_origen, oficina_destino=id_destino
                    ).first()
                    if existente is None:
                        db.session.add(
                            FlujoDerivacion(ccodigo=ccodigo, oficina_origen=id_origen, oficina_destino=id_destino)
                        )
                        flujo_creados += 1
                        cambios.append(
                            f"flujo: {NOMBRE_BONITO[clave_present]} -> {NOMBRE_BONITO[clave_aprob]}"
                        )

            if cambios:
                for linea in cambios:
                    print(f"  {linea}")
                actualizados.append(ccodigo)
            else:
                print("  (sin cambios: datos ya coincidian)")

        db.session.commit()

        print("\n" + "=" * 60)
        print(f"Tramites actualizados con datos reales: {len(actualizados)}")
        print(f"Confirmados sin tramite real en BD (¿ccodigo movido/borrado?): {len(sin_tramite_real)}")
        for s in sin_tramite_real:
            print(f"  - {s['real_codigo']} ({s['real_nombre']})")
        print(f"Filas creadas en tflujoderivacion: {flujo_creados}")
        print(f"Casos sin derivacion (origen == destino): {flujo_omitidos_mismo}")


if __name__ == "__main__":
    run()

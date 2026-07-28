"""
Fase 2 (Sprint 6): actualiza 18 tramites YA EXISTENTES en tcatalogotramite con
datos reales del CSV oficial del TUPA, para los pares que el usuario revisó
manualmente (score 0.55-0.89, descartados en la carga automatica de la sesion
anterior por riesgo de falso positivo, y ahora confirmados uno por uno).

Autorizacion: docente, 23/07/2026. Resolucion Rectoral CU-520-2024-UNSAAC
(21/10/2024) -- unica fuente del catalogo de este sprint.

Un 19no par (Certificacion de Copia de Diploma) ya habia sido cargado
correctamente en la sesion anterior (score 0.97) con una resolucion
placeholder; no requiere cambio de datos, solo se documenta en el resumen.

Uso: backend/venv/Scripts/python.exe -m scripts.cargar_fase2_actualizaciones
"""
import io
import json
from datetime import datetime

from app import create_app
from app.extensions import db
from app.models.tramite import CatalogoTramite, UnidadTramite, MontoTramite, UnidadOrganizativa
from app.models.flujo_derivacion import FlujoDerivacion
from app.models.historial_catalogo import HistorialCatalogo

FASE2_PATH = (
    r"C:/Users/User/AppData/Local/Temp/claude/c--Users-User-Tupa/"
    r"dc79bd91-2e5b-4965-a8ac-86262cb1be01/scratchpad/fase2.json"
)

NUMERO_RESOLUCION = "RESOLUCION N. CU-520-2024-UNSAAC (21/10/2024)"

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
    "secretaria de biblioteca central": "Direccion de Biblioteca Central",
    "direccion de biblioteca central": "Direccion de Biblioteca Central",
}

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
    with io.open(FASE2_PATH, encoding="utf-8") as f:
        pares = json.load(f)

    app = create_app()
    with app.app_context():
        cache_oficinas = {}
        actualizados = []
        flujo_creados = 0
        flujo_omitidos_mismo = 0

        for c in pares:
            ccodigo = c["real_codigo"]
            tramite = db.session.get(CatalogoTramite, ccodigo)
            if tramite is None:
                print(f"ERROR: {ccodigo} no existe en tcatalogotramite, se omite.")
                continue

            print(f"\n{ccodigo} - {c['real_nombre']}  (CSV: {c['csv_codigo']} '{c['csv_nombre']}', score={c['score']})")
            cambios = []

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
                            cdescripcionpago="Carga de datos reales del TUPA (CSV oficial, CU-520)",
                            dfechainicio=ahora,
                            dfechafin=None,
                        )
                    )
                    _registrar_cambio(ccodigo, "costo", valor_anterior, costo)
                    cambios.append(f"costo: {valor_anterior} -> {costo}")

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
            else:
                print(f"  AVISO: oficina de aprobacion '{c['unidad_aprobacion']}' sin alias conocido, no se asigna.")

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
            elif not clave_present:
                print(f"  AVISO: oficina de presentacion '{c['unidad_presentacion']}' sin alias conocido, sin flujo.")

            if cambios:
                for linea in cambios:
                    print(f"  {linea}")
                actualizados.append(ccodigo)
            else:
                print("  (sin cambios: datos ya coincidian)")

        db.session.commit()

        print("\n" + "=" * 60)
        print(f"Tramites actualizados (Fase 2): {len(actualizados)}")
        print(f"Filas nuevas en tflujoderivacion: {flujo_creados}")
        print(f"Casos sin derivacion (origen == destino): {flujo_omitidos_mismo}")


if __name__ == "__main__":
    run()

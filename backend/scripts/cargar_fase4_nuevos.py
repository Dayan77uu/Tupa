"""
Fase 4 (Sprint 6): inserta el resto de tramites del CSV oficial del TUPA que
no quedaron ni confirmados contra un tramite existente (sesion anterior +
Fase 2) ni en la lista explicita de Fase 3 -- calculado programaticamente
sobre los 115 del CSV (ver scratchpad/fase4.json), tal como se pidio: nunca
compitieron por un match de texto valido, asi que no hay riesgo de duplicar.

Autorizacion: docente, 23/07/2026. Resolucion Rectoral CU-520-2024-UNSAAC
(21/10/2024) -- unica fuente del catalogo de este sprint.

Uso: backend/venv/Scripts/python.exe -m scripts.cargar_fase4_nuevos
"""
import io
import json
from datetime import datetime

from app import create_app
from app.extensions import db
from app.models.tramite import CatalogoTramite, UnidadTramite, MontoTramite, UnidadOrganizativa
from app.models.flujo_derivacion import FlujoDerivacion
from app.models.historial_catalogo import HistorialCatalogo

FASE4_PATH = (
    r"C:/Users/User/AppData/Local/Temp/claude/c--Users-User-Tupa/"
    r"dc79bd91-2e5b-4965-a8ac-86262cb1be01/scratchpad/fase4.json"
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
    "direccion general de administracion": "Direccion General de Administracion",
    "vice rectorado academico": "Vice Rectorado Academico",
    "direccion de sistemas de informacion": "Direccion de Sistemas de Informacion",
    # "secretaria de la sede sicuani" NO esta en la lista de 13 oficinas -> sin alias a proposito.
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


def run():
    with io.open(FASE4_PATH, encoding="utf-8") as f:
        filas = json.load(f)

    app = create_app()
    with app.app_context():
        cache_oficinas = {}
        insertados = []
        omitidos_ya_existe = []
        flujo_creados = 0
        flujo_omitidos_mismo = 0
        flujo_omitidos_sin_alias = 0

        for row in filas:
            ccodigo = row["codigo"].strip()
            existente = db.session.get(CatalogoTramite, ccodigo)
            if existente is not None:
                print(f"AVISO: {ccodigo} ya existe ({existente.cdenominaciontramite}), se omite insercion.")
                omitidos_ya_existe.append(ccodigo)
                continue

            nombre = row["nombre"].strip().upper()
            print(f"\n{ccodigo} - {nombre}")

            monto_raw = (row.get("monto") or "").strip()
            if monto_raw and monto_raw.lower() != "gratuito":
                costo = float(monto_raw.replace(",", ""))
            elif monto_raw.lower() == "gratuito":
                costo = 0.0
            else:
                costo = None

            plazo_raw = (row.get("plazo_dias_habiles") or "").strip()
            plazo = int(float(plazo_raw)) if plazo_raw else None

            db.session.add(
                CatalogoTramite(
                    ccodigo=ccodigo,
                    cdenominaciontramite=nombre,
                    cdescripcion=None,
                    ccodigobanco=None,
                    btienemontofijo=costo is not None,
                    estado="ACTIVO",
                    nplazodias=plazo,
                )
            )
            db.session.flush()

            db.session.add(
                HistorialCatalogo(
                    ccodigo=ccodigo,
                    campo_modificado="alta_tramite",
                    valor_anterior=None,
                    valor_nuevo=nombre,
                    usuario=None,
                    numero_resolucion=NUMERO_RESOLUCION,
                )
            )

            if costo is not None:
                ahora = datetime.utcnow()
                db.session.add(
                    MontoTramite(
                        ccodigo=ccodigo,
                        nmonto=costo,
                        cdescripcionpago="Alta de tramite del TUPA oficial (CSV, CU-520)",
                        dfechainicio=ahora,
                        dfechafin=None,
                    )
                )
                print(f"  costo: {costo}")

            if plazo is not None:
                print(f"  plazo_dias: {plazo}")

            clave_aprob = ALIAS_OFICINA.get(_clave_oficina(row["unidad_aprobacion"]))
            id_oficina_aprob = None
            if clave_aprob:
                id_oficina_aprob = _get_or_create_oficina(clave_aprob, cache_oficinas)
                db.session.add(UnidadTramite(ccodigo=ccodigo, nidtunidadorganizativa=id_oficina_aprob))
                print(f"  oficina_responsable: {NOMBRE_BONITO[clave_aprob]} (id={id_oficina_aprob})")
            else:
                print(f"  AVISO: oficina de aprobacion '{row['unidad_aprobacion']}' sin alias conocido, no se asigna.")

            clave_present = ALIAS_OFICINA.get(_clave_oficina(row["unidad_presentacion"]))
            if clave_present and clave_aprob:
                id_origen = _get_or_create_oficina(clave_present, cache_oficinas)
                id_destino = id_oficina_aprob
                if id_origen == id_destino:
                    flujo_omitidos_mismo += 1
                    print("  (sin derivacion: origen y destino son la misma oficina)")
                else:
                    db.session.add(FlujoDerivacion(ccodigo=ccodigo, oficina_origen=id_origen, oficina_destino=id_destino))
                    flujo_creados += 1
                    print(f"  flujo: {NOMBRE_BONITO[clave_present]} -> {NOMBRE_BONITO[clave_aprob]}")
            else:
                flujo_omitidos_sin_alias += 1
                print(f"  AVISO: oficina de presentacion '{row['unidad_presentacion']}' sin alias conocido, sin flujo.")

            insertados.append(ccodigo)

        db.session.commit()

        print("\n" + "=" * 60)
        print(f"Tramites insertados (Fase 4): {len(insertados)}")
        print(f"Omitidos (ya existian): {len(omitidos_ya_existe)}")
        print(f"Filas nuevas en tflujoderivacion: {flujo_creados}")
        print(f"Casos sin derivacion (origen == destino): {flujo_omitidos_mismo}")
        print(f"Casos sin derivacion (oficina de origen sin alias, ej. Secretaria Sede Sicuani): {flujo_omitidos_sin_alias}")


if __name__ == "__main__":
    run()

from datetime import datetime

from sqlalchemy import or_

from app.extensions import db
from app.models.tramite import (
    CatalogoTramite,
    RequisitoTramite,
    UnidadTramite,
    UnidadOrganizativa,
    MontoTramite,
)

MAX_SUGERENCIAS = 5


def _query_base_activos():
    return CatalogoTramite.query.filter(CatalogoTramite.estado == "ACTIVO")


def _aplicar_filtro_texto(query, texto: str):
    patron = f"%{texto}%"
    return query.filter(
        or_(
            CatalogoTramite.cdenominaciontramite.like(patron),
            CatalogoTramite.ccodigo.like(patron),
            CatalogoTramite.cdescripcion.like(patron),
        )
    )


def _aplicar_filtro_unidad(query, id_unidad: int):
    return query.join(UnidadTramite, UnidadTramite.ccodigo == CatalogoTramite.ccodigo).filter(
        UnidadTramite.nidtunidadorganizativa == id_unidad
    )


def _montos_vigentes(ccodigo: str):
    ahora = datetime.utcnow()
    montos = MontoTramite.query.filter(
        MontoTramite.ccodigo == ccodigo,
        MontoTramite.dfechainicio <= ahora,
        or_(MontoTramite.dfechafin.is_(None), MontoTramite.dfechafin >= ahora),
    ).all()
    return [
        {"concepto": m.cdescripcionpago, "monto": float(m.nmonto) if m.nmonto is not None else None}
        for m in montos
    ]


def _costo_resumen(montos_vigentes: list) -> str:
    if not montos_vigentes:
        return "No especificado"
    valores = [m["monto"] for m in montos_vigentes if m["monto"] is not None]
    if not valores:
        return "No especificado"
    if len(valores) == 1:
        return f"S/ {valores[0]:.2f}"
    return f"Desde S/ {min(valores):.2f}"


def _unidades_de(ccodigo: str):
    filas = (
        db.session.query(UnidadOrganizativa)
        .join(UnidadTramite, UnidadTramite.nidtunidadorganizativa == UnidadOrganizativa.nidtunidadorganizativa)
        .filter(UnidadTramite.ccodigo == ccodigo)
        .all()
    )
    return [u.cnombreunidadorganizativa for u in filas]


def _tramite_a_tarjeta(tramite: CatalogoTramite) -> dict:
    return {
        "codigo": tramite.ccodigo,
        "nombre": tramite.cdenominaciontramite,
        "costo_resumen": _costo_resumen(_montos_vigentes(tramite.ccodigo)),
    }


def buscar(texto: str, id_unidad):
    query = _query_base_activos()

    if texto:
        query = _aplicar_filtro_texto(query, texto)
    if id_unidad:
        query = _aplicar_filtro_unidad(query, id_unidad)

    resultados = query.order_by(CatalogoTramite.cdenominaciontramite).all()

    if resultados:
        return {"resultados": [_tramite_a_tarjeta(t) for t in resultados]}

    sugerencias = []
    if texto:
        primera_palabra = texto.strip().split(" ")[0]
        if len(primera_palabra) >= 3:
            query_sug = _aplicar_filtro_texto(_query_base_activos(), primera_palabra)
            sugerencias = [
                _tramite_a_tarjeta(t)
                for t in query_sug.order_by(CatalogoTramite.cdenominaciontramite)
                .limit(MAX_SUGERENCIAS)
                .all()
            ]

    return {"resultados": [], "sugerencias": sugerencias}


def obtener_ficha(ccodigo: str):
    tramite = db.session.get(CatalogoTramite, ccodigo)
    if tramite is None or tramite.estado != "ACTIVO":
        return None

    requisitos = (
        RequisitoTramite.query.filter_by(ccodigo=ccodigo)
        .order_by(RequisitoTramite.nidtrequisitotramite)
        .all()
    )

    return {
        "codigo": tramite.ccodigo,
        "nombre": tramite.cdenominaciontramite,
        "descripcion": tramite.cdescripcion,
        "requisitos": [r.cdescripcionrequisito for r in requisitos],
        "montos": _montos_vigentes(ccodigo),
        "costo_resumen": _costo_resumen(_montos_vigentes(ccodigo)),
        "plazo_dias_habiles": tramite.nplazodias,
        "oficinas_responsables": _unidades_de(ccodigo),
    }


def obtener_filtros():
    # tcatalogotramite no tiene una columna de "tipo" (el script asumido inicialmente
    # no coincide con el esquema real de bdtupa); se devuelve vacio para no inventar
    # una clasificacion que no existe en los datos reales.
    unidades = (
        db.session.query(UnidadOrganizativa)
        .join(UnidadTramite, UnidadTramite.nidtunidadorganizativa == UnidadOrganizativa.nidtunidadorganizativa)
        .join(CatalogoTramite, CatalogoTramite.ccodigo == UnidadTramite.ccodigo)
        .filter(CatalogoTramite.estado == "ACTIVO")
        .distinct()
        .order_by(UnidadOrganizativa.cnombreunidadorganizativa)
        .all()
    )

    return {
        "unidades": [
            {"id": u.nidtunidadorganizativa, "nombre": u.cnombreunidadorganizativa} for u in unidades
        ],
        "tipos": [],
    }

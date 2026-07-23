from datetime import datetime, timedelta

from app.extensions import db
from app.models.expediente import Expediente
from app.models.movimiento import MovimientoExpediente
from app.auth.decorators import ROLES_ADMINISTRADOR_SISTEMA
from app.admin.service import obtener_oficina_admin

ESTADOS_TERMINALES = ("APROBADO", "RECHAZADO")


def _rango_periodo(periodo: str, fecha_desde: str, fecha_hasta: str):
    hoy = datetime.utcnow().date()
    if fecha_desde and fecha_hasta:
        return (
            datetime.strptime(fecha_desde, "%Y-%m-%d").date(),
            datetime.strptime(fecha_hasta, "%Y-%m-%d").date(),
        )
    if periodo == "semana":
        return hoy - timedelta(days=7), hoy
    if periodo == "trimestre":
        return hoy - timedelta(days=90), hoy
    # "mes" o valor no reconocido: por defecto ultimos 30 dias
    return hoy - timedelta(days=30), hoy


def _oficina_del_filtro(cidtusuario: str, rol: str, oficina_query):
    """RN-24/RN-25: Personal Administrativo solo ve su propia oficina.
    ADMINISTRADOR ve todo, o filtra por una oficina especifica si la pide."""
    if rol in ROLES_ADMINISTRADOR_SISTEMA:
        return int(oficina_query) if oficina_query else None
    return obtener_oficina_admin(cidtusuario)


def generar_reporte(cidtusuario: str, rol: str, periodo: str, estado: str, fecha_desde: str, fecha_hasta: str, oficina_query):
    desde, hasta = _rango_periodo(periodo, fecha_desde, fecha_hasta)
    oficina = _oficina_del_filtro(cidtusuario, rol, oficina_query)

    if rol not in ROLES_ADMINISTRADOR_SISTEMA and oficina is None:
        return 403, {"error": "Su usuario no tiene una oficina asignada"}

    query = Expediente.query.filter(
        db.func.date(Expediente.dfecharegistro) >= desde,
        db.func.date(Expediente.dfecharegistro) <= hasta,
        Expediente.cestado != "BORRADOR",
    )
    if oficina is not None:
        query = query.filter(Expediente.nidtoficinaactual == oficina)
    if estado:
        query = query.filter(Expediente.cestado == estado)

    expedientes = query.all()

    if not expedientes:
        return 200, {
            "periodo": {"desde": desde.isoformat(), "hasta": hasta.isoformat()},
            "sin_datos": True,
            "mensaje": "No hay datos registrados para el periodo y filtros seleccionados.",
        }

    hoy = datetime.utcnow().date()
    tramites_vencidos = sum(
        1
        for e in expedientes
        if e.dfechavencimiento and e.dfechavencimiento < hoy and e.cestado not in ESTADOS_TERMINALES
    )

    conteo_tramites = {}
    for e in expedientes:
        nombre = e.tramite.cdenominaciontramite if e.tramite else e.ccodigo
        conteo_tramites[nombre] = conteo_tramites.get(nombre, 0) + 1
    top_5 = sorted(conteo_tramites.items(), key=lambda x: x[1], reverse=True)[:5]

    duraciones = []
    dentro_de_plazo = 0
    total_resueltos = 0
    for e in expedientes:
        if e.cestado not in ESTADOS_TERMINALES:
            continue
        total_resueltos += 1
        ultimo_movimiento = (
            MovimientoExpediente.query.filter_by(nro_expediente=e.cnroexpediente, estado_nuevo=e.cestado)
            .order_by(MovimientoExpediente.fecha_hora.desc())
            .first()
        )
        if ultimo_movimiento and e.dfecharegistro:
            duraciones.append((ultimo_movimiento.fecha_hora - e.dfecharegistro).days)
            if e.dfechavencimiento is None or ultimo_movimiento.fecha_hora.date() <= e.dfechavencimiento:
                dentro_de_plazo += 1

    tiempo_promedio = round(sum(duraciones) / len(duraciones), 1) if duraciones else None
    porcentaje_cumplimiento = (
        round(dentro_de_plazo / total_resueltos * 100, 1) if total_resueltos else None
    )

    return 200, {
        "periodo": {"desde": desde.isoformat(), "hasta": hasta.isoformat()},
        "sin_datos": False,
        "tramites_atendidos": len(expedientes),
        "tiempo_promedio_dias": tiempo_promedio,
        "top_5_procedimientos": [{"nombre": n, "cantidad": c} for n, c in top_5],
        "tramites_vencidos": tramites_vencidos,
        "porcentaje_cumplimiento": porcentaje_cumplimiento,
        "oficina_filtrada": oficina,
    }

from datetime import date

from sqlalchemy import text

from app.extensions import db


def obtener_feriados():
    """Devuelve (fijos, recurrentes): fijos es un set de fechas exactas,
    recurrentes es un set de (mes, dia) que aplican todos los anios."""
    feriados = db.session.execute(text("SELECT dfecha, brecurrente FROM tferiado")).all()
    fijos = {f.dfecha for f in feriados if not f.brecurrente}
    recurrentes = {(f.dfecha.month, f.dfecha.day) for f in feriados if f.brecurrente}
    return fijos, recurrentes


def es_feriado(fecha: date, fijos: set, recurrentes: set) -> bool:
    if fecha in fijos:
        return True
    return (fecha.month, fecha.day) in recurrentes


def sumar_dias_habiles(fecha_inicio: date, dias_habiles: int) -> date:
    fijos, recurrentes = obtener_feriados()

    fecha = fecha_inicio
    dias_contados = 0
    while dias_contados < dias_habiles:
        fecha = date.fromordinal(fecha.toordinal() + 1)
        if fecha.weekday() >= 5:
            continue
        if es_feriado(fecha, fijos, recurrentes):
            continue
        dias_contados += 1
    return fecha


def contar_dias_habiles_entre(fecha_inicio: date, fecha_fin: date) -> int:
    """Dias habiles entre fecha_inicio (exclusiva) y fecha_fin (inclusiva).
    Negativo si fecha_fin es anterior a fecha_inicio (plazo vencido)."""
    if fecha_fin == fecha_inicio:
        return 0

    fijos, recurrentes = obtener_feriados()
    signo = 1 if fecha_fin > fecha_inicio else -1
    paso = 1 if signo > 0 else -1

    fecha = fecha_inicio
    dias_contados = 0
    while fecha != fecha_fin:
        fecha = date.fromordinal(fecha.toordinal() + paso)
        if fecha.weekday() >= 5:
            continue
        if es_feriado(fecha, fijos, recurrentes):
            continue
        dias_contados += 1
    return dias_contados * signo

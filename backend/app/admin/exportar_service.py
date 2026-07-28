import io
from datetime import datetime

from openpyxl import Workbook
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def _encabezado(cidtusuario: str, periodo: dict) -> list:
    return [
        f"Generado: {datetime.utcnow().isoformat()}",
        f"Usuario: {cidtusuario}",
        f"Periodo consultado: {periodo['desde']} a {periodo['hasta']}",
    ]


def exportar_excel(reporte: dict, cidtusuario: str) -> io.BytesIO:
    libro = Workbook()
    hoja = libro.active
    hoja.title = "Reporte"

    for linea in _encabezado(cidtusuario, reporte["periodo"]):
        hoja.append([linea])
    hoja.append([])

    hoja.append(["Tramites atendidos", reporte["tramites_atendidos"]])
    hoja.append(["Tiempo promedio (dias)", reporte["tiempo_promedio_dias"]])
    hoja.append(["Tramites vencidos", reporte["tramites_vencidos"]])
    hoja.append(["% de cumplimiento", reporte["porcentaje_cumplimiento"]])
    hoja.append([])
    hoja.append(["Top 5 procedimientos", "Cantidad"])
    for item in reporte["top_5_procedimientos"]:
        hoja.append([item["nombre"], item["cantidad"]])

    buffer = io.BytesIO()
    libro.save(buffer)
    buffer.seek(0)
    return buffer


def exportar_pdf(reporte: dict, cidtusuario: str) -> io.BytesIO:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    ancho, alto = A4

    y = alto - 50
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Reporte de Desempeno - TUPA UNSAAC")
    y -= 25

    pdf.setFont("Helvetica", 9)
    for linea in _encabezado(cidtusuario, reporte["periodo"]):
        pdf.drawString(50, y, linea)
        y -= 15

    y -= 15
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(50, y, "Metricas generales")
    y -= 20

    pdf.setFont("Helvetica", 10)
    filas = [
        f"Tramites atendidos: {reporte['tramites_atendidos']}",
        f"Tiempo promedio de atencion (dias): {reporte['tiempo_promedio_dias']}",
        f"Tramites vencidos: {reporte['tramites_vencidos']}",
        f"% de cumplimiento: {reporte['porcentaje_cumplimiento']}",
    ]
    for fila in filas:
        pdf.drawString(50, y, fila)
        y -= 15

    y -= 15
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(50, y, "Top 5 procedimientos mas solicitados")
    y -= 20
    pdf.setFont("Helvetica", 10)
    for item in reporte["top_5_procedimientos"]:
        pdf.drawString(50, y, f"{item['nombre']}: {item['cantidad']}")
        y -= 15

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer

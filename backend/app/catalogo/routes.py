from flask import Blueprint, request, jsonify

from app.catalogo import service

catalogo_bp = Blueprint("catalogo", __name__)


@catalogo_bp.get("")
def buscar_catalogo():
    texto = request.args.get("q", "").strip()
    id_unidad = request.args.get("unidad", type=int)
    # "tipo" se acepta en la query string por compatibilidad con el contrato original,
    # pero no filtra nada porque el esquema real no tiene esa columna (ver service.py).
    request.args.get("tipo")

    resultado = service.buscar(texto, id_unidad)
    return jsonify(resultado), 200


@catalogo_bp.get("/filtros")
def filtros_catalogo():
    return jsonify(service.obtener_filtros()), 200


@catalogo_bp.get("/<ccodigo>")
def ficha_tramite(ccodigo):
    ficha = service.obtener_ficha(ccodigo)
    if ficha is None:
        return jsonify({"error": "Trámite no encontrado"}), 404
    return jsonify(ficha), 200

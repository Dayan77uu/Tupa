"""
ADVERTENCIA: este blueprint es SOLO PARA PRUEBAS del Sprint 3.

El panel administrativo real (CU-06, cambio de estado por un administrativo)
todavia no existe - es Sprint 4. Este endpoint permite forzar el estado de un
expediente para poder probar el dashboard de seguimiento y las notificaciones
sin esperar a que exista ese panel.

Debe eliminarse o protegerse por rol de administrador en Sprint 4. No tiene
ningun control de rol: cualquier usuario autenticado puede forzar el estado
de CUALQUIER expediente (no solo el suyo), a proposito, para simular lo que
hara un administrativo.

Como salvaguarda minima mientras tanto: el endpoint responde 404 (no 403,
para no revelar su existencia) fuera de FLASK_ENV=development. En este
entorno local FLASK_ENV no esta definido, lo cual cuenta como desarrollo.
"""
import os
from functools import wraps

from flask import Blueprint, request, jsonify, g, abort

from app.auth.decorators import requiere_auth
from app.models.expediente import Expediente
from app.seguimiento.service import registrar_movimiento

dev_bp = Blueprint("dev", __name__)

ESTADOS_VALIDOS = {"PENDIENTE", "EN_REVISION", "OBSERVADO", "APROBADO", "RECHAZADO"}


def solo_en_desarrollo(f):
    """404 (no 403) fuera de desarrollo, para no revelar que el endpoint existe.
    Se aplica ANTES que @requiere_auth para que ni siquiera un intento sin
    token llegue a distinguir este endpoint de una ruta inexistente."""

    @wraps(f)
    def decorada(*args, **kwargs):
        entorno = os.environ.get("FLASK_ENV")
        if entorno not in (None, "development"):
            abort(404)
        return f(*args, **kwargs)

    return decorada


@dev_bp.post("/dev/expedientes/<nro_expediente>/forzar-estado")
@solo_en_desarrollo
@requiere_auth
def forzar_estado(nro_expediente):
    print(
        f"[DEV] forzar-estado invocado sobre {nro_expediente} por {g.id_usuario} "
        "- endpoint SOLO PARA PRUEBAS, eliminar o proteger por rol en Sprint 4"
    )

    expediente = Expediente.query.filter_by(cnroexpediente=nro_expediente).first()
    if expediente is None:
        return jsonify({"error": "Expediente no encontrado"}), 404

    data = request.get_json(silent=True) or {}
    estado_nuevo = data.get("estado")
    comentario = data.get("comentario")
    id_requisito_observado = data.get("id_requisito_observado")

    if estado_nuevo not in ESTADOS_VALIDOS:
        return jsonify({"error": f"estado debe ser uno de: {', '.join(sorted(ESTADOS_VALIDOS))}"}), 400

    if estado_nuevo == "OBSERVADO" and not id_requisito_observado:
        return jsonify({"error": "id_requisito_observado es requerido cuando estado=OBSERVADO"}), 400

    registrar_movimiento(
        nro_expediente,
        estado_nuevo,
        comentario=comentario,
        usuario_responsable=g.id_usuario,
        id_requisito_observado=id_requisito_observado,
    )

    return jsonify({"nro_expediente": nro_expediente, "estado": estado_nuevo}), 200

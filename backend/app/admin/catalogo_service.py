from datetime import datetime

from sqlalchemy import or_

from app.extensions import db
from app.models.tramite import CatalogoTramite, RequisitoTramite, UnidadTramite, MontoTramite
from app.models.flujo_derivacion import FlujoDerivacion
from app.models.historial_catalogo import HistorialCatalogo

MENSAJE_NO_ENCONTRADO = "Tramite no encontrado"
MENSAJE_RESOLUCION_REQUERIDA = "numero_resolucion_rectoral es obligatorio para modificar el catalogo (RN-27)"


def listar_catalogo():
    tramites = CatalogoTramite.query.order_by(CatalogoTramite.cdenominaciontramite).all()
    return [
        {
            "ccodigo": t.ccodigo,
            "nombre": t.cdenominaciontramite,
            "estado": t.estado,
            "plazo_dias": t.nplazodias,
        }
        for t in tramites
    ]


def _registrar_cambio(ccodigo, campo, valor_anterior, valor_nuevo, usuario, numero_resolucion):
    db.session.add(
        HistorialCatalogo(
            ccodigo=ccodigo,
            campo_modificado=campo,
            valor_anterior=str(valor_anterior) if valor_anterior is not None else None,
            valor_nuevo=str(valor_nuevo) if valor_nuevo is not None else None,
            usuario=usuario,
            numero_resolucion=numero_resolucion,
        )
    )


def actualizar_tramite(ccodigo: str, cidtusuario: str, data: dict):
    tramite = db.session.get(CatalogoTramite, ccodigo)
    if tramite is None:
        return 404, {"error": MENSAJE_NO_ENCONTRADO}

    numero_resolucion = data.get("numero_resolucion_rectoral")
    if not numero_resolucion or not str(numero_resolucion).strip():
        return 400, {"error": MENSAJE_RESOLUCION_REQUERIDA}

    cambios = []

    if "plazo_dias" in data and data["plazo_dias"] is not None:
        plazo = data["plazo_dias"]
        if not isinstance(plazo, int) or isinstance(plazo, bool) or plazo <= 0:
            return 400, {"error": "plazo_dias debe ser un numero entero positivo"}
        if plazo != tramite.nplazodias:
            cambios.append(("plazo_dias", tramite.nplazodias, plazo))
            tramite.nplazodias = plazo

    if "descripcion" in data and data["descripcion"] is not None:
        nueva = data["descripcion"]
        if nueva != tramite.cdescripcion:
            cambios.append(("descripcion", tramite.cdescripcion, nueva))
            tramite.cdescripcion = nueva

    if "costo" in data and data["costo"] is not None:
        try:
            costo = float(data["costo"])
        except (TypeError, ValueError):
            return 400, {"error": "costo debe ser numerico"}
        if costo < 0:
            return 400, {"error": "costo no puede ser negativo"}

        ahora = datetime.utcnow()
        vigentes = MontoTramite.query.filter(
            MontoTramite.ccodigo == ccodigo,
            MontoTramite.dfechainicio <= ahora,
            or_(MontoTramite.dfechafin.is_(None), MontoTramite.dfechafin >= ahora),
        ).all()
        valor_anterior = vigentes[0].nmonto if vigentes else None
        for m in vigentes:
            m.dfechafin = ahora
        db.session.add(
            MontoTramite(
                ccodigo=ccodigo,
                nmonto=costo,
                cdescripcionpago="Actualizado desde el panel administrativo",
                dfechainicio=ahora,
                dfechafin=None,
            )
        )
        cambios.append(("costo", valor_anterior, costo))

    if "oficina_responsable" in data and data["oficina_responsable"] is not None:
        nueva_oficina = data["oficina_responsable"]
        anterior = UnidadTramite.query.filter_by(ccodigo=ccodigo).first()
        valor_anterior = anterior.nidtunidadorganizativa if anterior else None
        if valor_anterior != nueva_oficina:
            UnidadTramite.query.filter_by(ccodigo=ccodigo).delete()
            db.session.add(UnidadTramite(ccodigo=ccodigo, nidtunidadorganizativa=nueva_oficina))
            cambios.append(("oficina_responsable", valor_anterior, nueva_oficina))

    if "requisitos" in data and data["requisitos"] is not None:
        anteriores = [
            r.cdescripcionrequisito for r in RequisitoTramite.query.filter_by(ccodigo=ccodigo).all()
        ]
        nuevos = [r.get("descripcion", "") for r in data["requisitos"]]
        if anteriores != nuevos:
            RequisitoTramite.query.filter_by(ccodigo=ccodigo).delete()
            for req in data["requisitos"]:
                db.session.add(
                    RequisitoTramite(
                        ccodigo=ccodigo,
                        cdescripcionrequisito=req.get("descripcion"),
                        bobligatorio=req.get("obligatorio", True),
                        cformatospermitidos=req.get("formatos", "pdf,jpg,png"),
                        nmaxtamaniomb=req.get("tamano_max_mb", 5),
                    )
                )
            cambios.append(("requisitos", "; ".join(anteriores), "; ".join(nuevos)))

    if "flujo_derivacion" in data and data["flujo_derivacion"] is not None:
        FlujoDerivacion.query.filter_by(ccodigo=ccodigo).delete()
        for flujo in data["flujo_derivacion"]:
            db.session.add(
                FlujoDerivacion(
                    ccodigo=ccodigo,
                    oficina_origen=flujo["oficina_origen"],
                    oficina_destino=flujo["oficina_destino"],
                )
            )
        cambios.append(("flujo_derivacion", None, f"{len(data['flujo_derivacion'])} regla(s)"))

    if not cambios:
        return 400, {"error": "No se especifico ningun cambio valido"}

    for campo, anterior, nuevo in cambios:
        _registrar_cambio(ccodigo, campo, anterior, nuevo, cidtusuario, numero_resolucion)

    db.session.commit()
    return 200, {"ccodigo": ccodigo, "campos_modificados": [c[0] for c in cambios]}


def cambiar_estado(ccodigo: str, cidtusuario: str, nuevo_estado: str, numero_resolucion: str = None):
    tramite = db.session.get(CatalogoTramite, ccodigo)
    if tramite is None:
        return 404, {"error": MENSAJE_NO_ENCONTRADO}

    if nuevo_estado not in ("ACTIVO", "INACTIVO"):
        return 400, {"error": "estado debe ser ACTIVO o INACTIVO"}

    if not numero_resolucion or not str(numero_resolucion).strip():
        return 400, {"error": MENSAJE_RESOLUCION_REQUERIDA}

    anterior = tramite.estado
    if anterior == nuevo_estado:
        return 400, {"error": f"El tramite ya esta {nuevo_estado}"}

    tramite.estado = nuevo_estado
    _registrar_cambio(ccodigo, "estado", anterior, nuevo_estado, cidtusuario, numero_resolucion)
    db.session.commit()

    return 200, {"ccodigo": ccodigo, "estado": nuevo_estado}


def obtener_historial(ccodigo: str):
    tramite = db.session.get(CatalogoTramite, ccodigo)
    if tramite is None:
        return 404, {"error": MENSAJE_NO_ENCONTRADO}

    historial = (
        HistorialCatalogo.query.filter_by(ccodigo=ccodigo)
        .order_by(HistorialCatalogo.fecha.asc())
        .all()
    )
    return 200, {
        "ccodigo": ccodigo,
        "historial": [
            {
                "campo_modificado": h.campo_modificado,
                "valor_anterior": h.valor_anterior,
                "valor_nuevo": h.valor_nuevo,
                "usuario": h.usuario,
                "numero_resolucion": h.numero_resolucion,
                "fecha": h.fecha.isoformat() if h.fecha else None,
            }
            for h in historial
        ],
    }

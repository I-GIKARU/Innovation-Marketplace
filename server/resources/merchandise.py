from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt, verify_jwt_in_request
from models import db, Merchandise
from functools import wraps

from resources.auth import role_required


# Role-based access decorator


class MerchandiseList(Resource):
    def get(self):
        try:
            page = request.args.get("page", 1, type=int)
            per_page = request.args.get("per_page", 10, type=int)
            in_stock = request.args.get("in_stock", True, type=bool)

            query = Merchandise.query

            if in_stock:
                query = query.filter(Merchandise.is_in_stock == True)

            merchandise = query.paginate(page=page, per_page=per_page, error_out=False)

            return {
                "merchandise": [item.to_dict() for item in merchandise.items],
                "total": merchandise.total,
                "pages": merchandise.pages,
                "current_page": page,
            }, 200

        except Exception as exc:
            return {"error": str(exc)}, 500

    @jwt_required()
    @role_required("admin")
    def post(self):
        try:
            data = request.get_json()
            new_item = Merchandise(
                name=data["name"],
                description=data.get("description", ""),
                price=data.get("price", 0),
                image_url=data.get("image_url", ""),
                is_in_stock=data.get("is_in_stock", True)
            )
            db.session.add(new_item)
            db.session.commit()

            return {
                "message": "Merchandise created",
                "merchandise": new_item.to_dict()
            }, 201

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500


class MerchandiseDetail(Resource):
    def get(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            return {"merchandise": merchandise.to_dict()}, 200
        except Exception as exc:
            return {"error": str(exc)}, 500

    @jwt_required()
    @role_required("admin")
    def put(self, id):
        try:
            item = Merchandise.query.get_or_404(id)
            data = request.get_json()

            item.name = data.get("name", item.name)
            item.description = data.get("description", item.description)
            item.price = data.get("price", item.price)
            item.image_url = data.get("image_url", item.image_url)
            item.is_in_stock = data.get("is_in_stock", item.is_in_stock)

            db.session.commit()
            return {
                "message": "Merchandise updated",
                "merchandise": item.to_dict()
            }, 200

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500

    @jwt_required()
    @role_required("admin")
    def delete(self, id):
        try:
            item = Merchandise.query.get_or_404(id)
            db.session.delete(item)
            db.session.commit()
            return {"message": "Merchandise deleted"}, 200

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500


def setup_routes(api):
    api.add_resource(MerchandiseList, "/api/merchandise", endpoint="merchandise_list")
    api.add_resource(MerchandiseDetail, "/api/merchandise/<int:id>", endpoint="merchandise_detail")

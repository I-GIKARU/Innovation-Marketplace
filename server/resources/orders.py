from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import db, Order, OrderItem, Merchandise

class OrderList(Resource):
    @jwt_required()
    def post(self):
        try:
            claims = get_jwt()
            user_id = get_jwt_identity()

            if claims.get("role") != "user":
                return {"error": "Only registered users can place orders"}, 403

            data = request.get_json()

            if not data.get("items"):
                return {"error": "Order items are required"}, 400

            total_amount = 0
            order_items = []

            for item_data in data["items"]:
                merchandise = Merchandise.query.get(item_data["merchandise_id"])
                if not merchandise:
                    return {
                        "error": f'Merchandise {item_data["merchandise_id"]} not found'
                    }, 404

                if not merchandise.is_in_stock:
                    return {
                        "error": f"Merchandise '{merchandise.name}' is out of stock"
                    }, 400

                quantity = item_data["quantity"]
                item_total = merchandise.price * quantity
                total_amount += item_total

                order_items.append(
                    {
                        "merchandise_id": merchandise.id,
                        "quantity": quantity,
                        "price": merchandise.price,
                    }
                )

            order = Order(
                user_id=int(user_id),
                amount=total_amount,
                status="pending"
            )

            db.session.add(order)
            db.session.flush()

            for item_data in order_items:
                order_item = OrderItem(
                    order_id=order.id,
                    merchandise_id=item_data["merchandise_id"],
                    quantity=item_data["quantity"],
                    price=item_data["price"],
                )
                db.session.add(order_item)

            db.session.commit()

            return {
                "message": "Order created successfully",
                "order": order.to_dict(),
            }, 201

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500

    @jwt_required()
    def get(self):
        try:
            claims = get_jwt()
            user_id = get_jwt_identity()

            if claims.get("role") != "user":
                return {"error": "Only users can view orders"}, 403

            page = request.args.get("page", 1, type=int)
            per_page = request.args.get("per_page", 10, type=int)

            orders = (
                Order.query.filter_by(user_id=int(user_id))
                .order_by(Order.date.desc())
                .paginate(page=page, per_page=per_page, error_out=False)
            )

            return {
                "orders": [order.to_dict() for order in orders.items],
                "total": orders.total,
                "pages": orders.pages,
                "current_page": page,
            }, 200

        except Exception as exc:
            return {"error": str(exc)}, 500
class OrderDetail(Resource):
    @jwt_required()
    def get(self, id):
        try:
            user_id = get_jwt_identity()
            claims = get_jwt()
            role = claims.get("role")

            order = Order.query.get_or_404(id)

            # Users can only access their own orders
            if role == "user" and order.user_id != int(user_id):
                return {"error": "You can only view your own orders"}, 403

            # Other roles (like client) are not allowed at all
            if role not in ["user", "admin"]:
                return {"error": "Unauthorized"}, 403

            return {"order": order.to_dict()}, 200

        except Exception as exc:
            return {"error": str(exc)}, 500


class CancelOrder(Resource):
    @jwt_required()
    def post(self, id):
        try:
            user_id = get_jwt_identity()
            claims = get_jwt()
            role = claims.get("role")

            order = Order.query.get_or_404(id)

            # Only the user who created the order can cancel it
            if role != "user" or order.user_id != int(user_id):
                return {"error": "You can only cancel your own orders"}, 403

            if order.status != "pending":
                return {"error": "Only pending orders can be cancelled"}, 400

            order.status = "cancelled"
            db.session.commit()

            return {
                "message": "Order cancelled successfully",
                "order": order.to_dict(),
            }, 200

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500
class GuestOrder(Resource):
    def post(self):
        try:
            data = request.get_json()
            items = data.get("items")

            if not items:
                return {"error": "Order items are required"}, 400

            guest_email = data.get("email")  # optional

            total_amount = 0
            order_items = []

            for item_data in items:
                merchandise = Merchandise.query.get(item_data["merchandise_id"])
                if not merchandise:
                    return {
                        "error": f'Merchandise {item_data["merchandise_id"]} not found'
                    }, 404

                if not merchandise.is_in_stock:
                    return {
                        "error": f"Merchandise {merchandise.name} is out of stock"
                    }, 400

                quantity = item_data["quantity"]
                item_total = merchandise.price * quantity
                total_amount += item_total

                order_items.append(
                    {
                        "merchandise_id": merchandise.id,
                        "quantity": quantity,
                        "price": merchandise.price,
                    }
                )

            # Create guest order with optional email
            order = Order(
                user_id=None,
                email=guest_email,
                amount=total_amount,
                status="pending"
            )

            db.session.add(order)
            db.session.flush()  # get order.id

            for item_data in order_items:
                order_item = OrderItem(
                    order_id=order.id,
                    merchandise_id=item_data["merchandise_id"],
                    quantity=item_data["quantity"],
                    price=item_data["price"],
                )
                db.session.add(order_item)

            db.session.commit()

            return {
                "message": "Guest order placed successfully",
                "order": order.to_dict(),
            }, 201

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500


class AllOrders(Resource):
    @jwt_required()
    def get(self):
        try:
            claims = get_jwt()
            role = claims.get("role")

            if role != "admin":
                return {"error": "Admin access required"}, 403

            page = request.args.get("page", 1, type=int)
            per_page = request.args.get("per_page", 20, type=int)

            orders = (
                Order.query.order_by(Order.date.desc())
                .paginate(page=page, per_page=per_page, error_out=False)
            )

            return {
                "orders": [order.to_dict() for order in orders.items],
                "total": orders.total,
                "pages": orders.pages,
                "current_page": page,
            }, 200

        except Exception as exc:
            return {"error": str(exc)}, 500

def setup_routes(api):
    api.add_resource(OrderList, "/api/orders")
    api.add_resource(OrderDetail, "/api/orders/<int:id>")
    api.add_resource(CancelOrder, "/api/orders/<int:id>/cancel")
    api.add_resource(GuestOrder, "/api/guest-orders")
    api.add_resource(AllOrders, "/api/admin/orders")
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, Merchandise, User
from resources.auth.decorators import role_required, admin_or_role_required, get_current_user

class OrderList(Resource):
    @jwt_required(optional=True) # Allow guest orders
    def post(self):
        try:
            current_user = get_current_user()
            data = request.get_json()
            
            if not data.get('items'):
                return {'error': 'Order items are required'}, 400
            
            user_id = None
            user_email = None

            if current_user:
                # If logged in, use user_id
                user_id = current_user.id
                if current_user.role.name not in ['student', 'client', 'admin']:
                    return {'error': 'Only registered users can place orders'}, 403
            else:
                # If not logged in, it's a guest order, require email
                if not data.get('email'):
                    return {'error': 'Email is required for guest orders'}, 400
                user_email = data['email']
            
            # Calculate total amount
            total_amount = 0
            order_items_data = []
            
            for item_data in data['items']:
                merchandise = Merchandise.query.get(item_data['merchandise_id'])
                if not merchandise:
                    return {'error': f'Merchandise {item_data["merchandise_id"]} not found'}, 404
                
                if merchandise.quantity < item_data['quantity']:
                    return {'error': f'Merchandise {merchandise.name} is out of stock or insufficient quantity available'}, 400
                
                quantity = item_data['quantity']
                if not isinstance(quantity, int) or quantity <= 0:
                    return {'error': 'Quantity must be a positive integer'}, 400

                item_total = merchandise.price * quantity
                total_amount += item_total
                
                order_items_data.append({
                    'merchandise_id': merchandise.id,
                    'quantity': quantity,
                    'price': merchandise.price # Store price at time of order
                })
            
            # Create order
            order = Order(
                user_id=user_id,
                email=user_email,
                amount=total_amount,
                status='pending'
            )
            
            db.session.add(order)
            db.session.flush()  # Get order ID
            
            # Create order items and update stock
            for item_data in order_items_data:
                # Get merchandise again to update stock
                merchandise = Merchandise.query.get(item_data['merchandise_id'])
                
                order_item = OrderItem(
                    order_id=order.id,
                    merchandise_id=item_data['merchandise_id'],
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
                
                # Reduce stock quantity
                merchandise.quantity -= item_data['quantity']
                
                db.session.add(order_item)
                db.session.add(merchandise)
            
            db.session.commit()
            
            return {
                'message': 'Order created successfully',
                'order': order.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student', 'client']) # Users can view their own, admins can view all
    def get(self):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            query = Order.query
            if current_user.role.name != 'admin':
                # Regular users only see their own orders that are not hidden
                query = query.filter_by(user_id=current_user.id, hidden_from_user=False)
            # Admins see all orders regardless of hidden_from_user flag
            
            orders = query.order_by(Order.date.desc()).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            return {
                'orders': [order.to_dict() for order in orders.items],
                'total': orders.total,
                'pages': orders.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class OrderDetail(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'client'])
    def get(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            order = Order.query.get_or_404(id)
            
            # Check if user owns the order or is admin
            if current_user.role.name != 'admin' and order.user_id != current_user.id:
                return {'error': 'You can only view your own orders'}, 403
            
            return {'order': order.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class CancelOrder(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'client']) # Only regular users can cancel their own orders
    def post(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            order = Order.query.get_or_404(id)
            
            # Check if user owns the order
            if order.user_id != current_user.id:
                return {'error': 'You can only cancel your own orders'}, 403
            
            if order.status != 'pending':
                return {'error': 'Only pending orders can be cancelled'}, 400
            
            # Restore stock quantities for cancelled order
            for order_item in order.items:
                merchandise = Merchandise.query.get(order_item.merchandise_id)
                if merchandise:
                    merchandise.quantity += order_item.quantity
                    db.session.add(merchandise)
            
            order.status = 'cancelled'
            db.session.commit()
            
            return {
                'message': 'Order cancelled successfully',
                'order': order.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class HideOrder(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'client']) # Only regular users can hide their own orders
    def post(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            order = Order.query.get_or_404(id)
            
            # Check if user owns the order
            if order.user_id != current_user.id:
                return {'error': 'You can only hide your own orders'}, 403
            
            order.hidden_from_user = True
            db.session.commit()
            
            return {
                'message': 'Order hidden from your view successfully',
                'order': order.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student', 'client']) # Allow users to unhide their orders
    def delete(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            order = Order.query.get_or_404(id)
            
            # Check if user owns the order
            if order.user_id != current_user.id:
                return {'error': 'You can only unhide your own orders'}, 403
            
            order.hidden_from_user = False
            db.session.commit()
            
            return {
                'message': 'Order restored to your view successfully',
                'order': order.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

def setup_routes(api):
    api.add_resource(OrderList, '/api/orders')
    api.add_resource(OrderDetail, '/api/orders/<int:id>')
    api.add_resource(CancelOrder, '/api/orders/<int:id>/cancel')
    api.add_resource(HideOrder, '/api/orders/<int:id>/hide')

from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import db, Sales, SalesItem, Merchandise
from utils.mpesa import MpesaClient, validate_mpesa_config
from utils.email_service import send_order_confirmation_email
from resources.auth.decorators import role_required, get_current_user
import uuid

class BuyEndpoint(Resource):
    """Authenticated endpoint for purchasing merchandise"""
    @jwt_required()
    def post(self):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            data = request.get_json()
            
            if not data.get('items'):
                return {'error': 'Items are required'}, 400
            
            user_email = current_user.email
            
            # Calculate total amount
            total_amount = 0
            sales_items_data = []
            
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
                
                sales_items_data.append({
                    'merchandise_id': merchandise.id,
                    'quantity': quantity,
                    'price': merchandise.price # Store price at time of sale
                })
            
            # Create order immediately (M-Pesa payment handled separately)
            # Status set to 'completed' - we assume user will complete payment
            sale = Sales(
                user_id=current_user.id,  # Authenticated user
                email=user_email,
                amount=total_amount,
                status='completed'  # Mark as completed since payment is handled separately
            )
            
            db.session.add(sale)
            db.session.flush()  # Get sale ID
            
            # Create sales items and update stock immediately
            for item_data in sales_items_data:
                sales_item = SalesItem(
                    sales_id=sale.id,
                    merchandise_id=item_data['merchandise_id'],
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
                db.session.add(sales_item)
                
                # Update merchandise stock
                merchandise = Merchandise.query.get(item_data['merchandise_id'])
                if merchandise:
                    merchandise.quantity -= item_data['quantity']
                    db.session.add(merchandise)
            
            db.session.commit()
            
            # Prepare email data with detailed item information
            email_items = []
            for item_data in sales_items_data:
                merchandise = Merchandise.query.get(item_data['merchandise_id'])
                if merchandise:
                    email_items.append({
                        'name': merchandise.name,
                        'quantity': item_data['quantity'],
                        'price': item_data['price']
                    })
            
            # Send order confirmation email immediately
            email_data = {
                'email': user_email,
                'sale_id': sale.id,
                'amount': total_amount,
                'status': 'completed',
                'items': email_items
            }
            
            # Send email (don't fail the order if email fails)
            try:
                email_sent = send_order_confirmation_email(email_data)
                if email_sent:
                    print(f"✅ Order confirmation email sent to {user_email} for order #{sale.id}")
                else:
                    print(f"⚠️ Failed to send order confirmation email to {user_email} for order #{sale.id}")
            except Exception as email_error:
                print(f"❌ Email sending error for order #{sale.id}: {str(email_error)}")
            
            return {
                'message': 'Order placed successfully! You will receive a confirmation email shortly.',
                'sale_id': sale.id,
                'amount': total_amount,
                'status': 'completed',
                'email_sent': 'Confirmation email has been sent to your email address'
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class AdminSalesList(Resource):
    """Admin endpoint to view all sales"""
    @jwt_required()
    @role_required('admin')
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            status = request.args.get('status')  # Filter by status if provided
            
            query = Sales.query
            if status:
                query = query.filter_by(status=status)
                
            sales = query.order_by(Sales.date.desc()).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            return {
                'sales': [sale.to_dict() for sale in sales.items],
                'total': sales.total,
                'pages': sales.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500


class AdminSaleDetail(Resource):
    """Admin endpoint to view and manage individual sales"""
    @jwt_required()
    @role_required('admin')
    def get(self, id):
        try:
            sale = Sales.query.get_or_404(id)
            return {'sale': sale.to_dict()}, 200
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')
    def put(self, id):
        """Update sale status"""
        try:
            data = request.get_json()
            sale = Sales.query.get_or_404(id)
            
            if 'status' in data:
                valid_statuses = ['paid', 'completed', 'cancelled']
                new_status = data['status']
                
                if new_status not in valid_statuses:
                    return {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 400
                
                old_status = sale.status
                sale.status = new_status
                
                # If cancelling, restore stock
                if new_status == 'cancelled' and old_status != 'cancelled':
                    for sales_item in sale.items:
                        merchandise = Merchandise.query.get(sales_item.merchandise_id)
                        if merchandise:
                            merchandise.quantity += sales_item.quantity
                            db.session.add(merchandise)
                
                db.session.commit()
                
                return {
                    'message': f'Sale status updated to {new_status}',
                    'sale': sale.to_dict()
                }, 200
            
            return {'error': 'No valid fields to update'}, 400
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class AdminCancelSale(Resource):
    """Admin endpoint to cancel any sale"""
    @jwt_required()
    @role_required('admin')
    def post(self, id):
        try:
            sale = Sales.query.get_or_404(id)
            
            if sale.status in ['cancelled', 'refunded']:
                return {'error': 'Sale is already cancelled or refunded'}, 400
            
            # Restore stock quantities for cancelled sale
            for sales_item in sale.items:
                merchandise = Merchandise.query.get(sales_item.merchandise_id)
                if merchandise:
                    merchandise.quantity += sales_item.quantity
                    db.session.add(merchandise)
            
            sale.status = 'cancelled'
            db.session.commit()
            
            return {
                'message': 'Sale cancelled successfully by admin',
                'sale': sale.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class UserOrdersList(Resource):
    """User endpoint to view their orders"""
    @jwt_required()
    def get(self):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            # Get user's orders (sales where user_id matches)
            orders = Sales.query.filter_by(
                user_id=current_user.id,
                hidden_from_user=False
            ).order_by(Sales.date.desc()).paginate(
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

class UserOrderDetail(Resource):
    """Get specific order details for user"""
    @jwt_required()
    def get(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            order = Sales.query.filter_by(
                id=id,
                user_id=current_user.id,
                hidden_from_user=False
            ).first_or_404()
            
            return {'order': order.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class UserOrderCancel(Resource):
    """Cancel user's order"""
    @jwt_required()
    def post(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            order = Sales.query.filter_by(
                id=id,
                user_id=current_user.id
            ).first_or_404()
            
            if order.status in ['cancelled', 'completed', 'refunded']:
                return {'error': 'Order cannot be cancelled'}, 400
            
            # Restore stock quantities
            for sales_item in order.items:
                merchandise = Merchandise.query.get(sales_item.merchandise_id)
                if merchandise:
                    merchandise.quantity += sales_item.quantity
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

def setup_routes(api):
    # Authenticated buying endpoint
    api.add_resource(BuyEndpoint, '/api/buy')
    
    # User order management endpoints (authentication required)
    api.add_resource(UserOrdersList, '/api/orders')
    api.add_resource(UserOrderDetail, '/api/orders/<int:id>')
    api.add_resource(UserOrderCancel, '/api/orders/<int:id>/cancel')
    
    # Admin sales management endpoints (admin authentication required)
    api.add_resource(AdminSalesList, '/api/admin/sales')
    api.add_resource(AdminSaleDetail, '/api/admin/sales/<int:id>')
    api.add_resource(AdminCancelSale, '/api/admin/sales/<int:id>/cancel')
    
    # Admin order management endpoints (admin authentication required) - alias for sales
    # Using the same endpoint for backward compatibility
    api.add_resource(AdminSalesList, '/api/admin/orders', endpoint='admin_orders_list')

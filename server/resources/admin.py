from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, User, Category, Merchandise, Order, OrderItem, Role
from resources.auth.decorators import role_required
from sqlalchemy import func

class PendingProjects(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            projects = Project.query.filter_by(status='pending').paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return {
                'projects': [project.to_dict() for project in projects.items],
                'total': projects.total,
                'pages': projects.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class ApproveProject(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, id):
        try:
            project = Project.query.get_or_404(id)
            
            project.status = 'approved'
            
            db.session.commit()
            
            return {
                'message': 'Project approved successfully',
                'project': project.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class RejectProject(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, id):
        try:
            data = request.get_json()
            project = Project.query.get_or_404(id)
            
            reason = data.get('reason', 'Project rejected')
            
            project.status = 'rejected'
            
            db.session.commit()
            
            return {
                'message': 'Project rejected',
                'project': project.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class FeatureProject(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, id):
        try:
            project = Project.query.get_or_404(id)
            
            project.featured = not project.featured
            action = 'feature' if project.featured else 'unfeature'
            
            db.session.commit()
            
            return {
                'message': f'Project {action}d successfully',
                'project': project.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class AdminCategories(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self):
        try:
            data = request.get_json()
            
            if not data.get('name'):
                return {'error': 'Category name is required'}, 400
            
            # Check if category already exists
            if Category.query.filter_by(name=data['name']).first():
                return {'error': 'Category already exists'}, 400
            
            category = Category(
                name=data['name'],
                description=data.get('description', '')
            )
            
            db.session.add(category)
            db.session.commit()
            
            return {
                'message': 'Category created successfully',
                'category': category.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class AdminCategoryDetail(Resource):
    @jwt_required()
    @role_required('admin')
    def put(self, id):
        try:
            category = Category.query.get_or_404(id)
            data = request.get_json()
            
            if not data.get('name'):
                return {'error': 'Category name is required'}, 400
            
            # Check for duplicate name if changed
            if data['name'] != category.name and Category.query.filter_by(name=data['name']).first():
                return {'error': 'Category name already exists'}, 400

            category.name = data['name']
            category.description = data.get('description', category.description) # Use existing if not provided
            
            db.session.commit()
            
            return {
                'message': 'Category updated successfully',
                'category': category.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')
    def delete(self, id):
        try:
            category = Category.query.get_or_404(id)
            
            db.session.delete(category)
            db.session.commit()
            
            return {'message': 'Category deleted successfully'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class AdminMerchandise(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self):
        try:
            data = request.get_json()
            
            required_fields = ['name', 'price']
            for field in required_fields:
                if field not in data or data[field] is None:
                    return {'error': f'{field} is required'}, 400
            
            # Check if merchandise name already exists
            if Merchandise.query.filter_by(name=data['name']).first():
                return {'error': 'Merchandise with this name already exists'}, 400

            merchandise = Merchandise(
                name=data['name'],
                description=data.get('description', ''),
                price=data['price'],
                image_url=data.get('image_url', ''),
                is_in_stock=data.get('is_in_stock', True)
            )
            
            db.session.add(merchandise)
            db.session.commit()
            
            return {
                'message': 'Merchandise created successfully',
                'merchandise': merchandise.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class AdminMerchandiseDetail(Resource):
    @jwt_required()
    @role_required('admin')
    def put(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            data = request.get_json()
            
            if 'name' in data and data['name'] != merchandise.name:
                if Merchandise.query.filter_by(name=data['name']).first():
                    return {'error': 'Merchandise name already exists'}, 400
                merchandise.name = data['name']
            
            if 'description' in data: merchandise.description = data['description']
            if 'price' in data: merchandise.price = data['price']
            if 'image_url' in data: merchandise.image_url = data['image_url']
            if 'is_in_stock' in data: merchandise.is_in_stock = data['is_in_stock']
            
            db.session.commit()
            
            return {
                'message': 'Merchandise updated successfully',
                'merchandise': merchandise.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')
    def delete(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            
            db.session.delete(merchandise)
            db.session.commit()
            
            return {'message': 'Merchandise deleted successfully'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class AdminStats(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        try:
            # User stats
            total_users = User.query.count()
            total_students = User.query.join(Role).filter(Role.name == 'student').count()
            total_clients = User.query.join(Role).filter(Role.name == 'client').count()
            
            # Project stats
            total_projects = Project.query.count()
            approved_projects = Project.query.filter_by(status='approved').count()
            pending_projects = Project.query.filter_by(status='pending').count()
            featured_projects = Project.query.filter_by(featured=True).count()
            
            # Merchandise stats
            total_merchandise = Merchandise.query.count()
            in_stock_merchandise = Merchandise.query.filter_by(is_in_stock=True).count()
            
            # Order stats
            total_orders = Order.query.count()
            completed_orders = Order.query.filter_by(status='completed').count()
            
            # Top viewed projects
            top_projects = Project.query.filter_by(status='approved').order_by(Project.views.desc()).limit(5).all()
            
            return {
                'user_stats': {
                    'total': total_users,
                    'students': total_students,
                    'clients': total_clients
                },
                'project_stats': {
                    'total': total_projects,
                    'approved': approved_projects,
                    'pending': pending_projects,
                    'featured': featured_projects
                },
                'merchandise_stats': {
                    'total': total_merchandise,
                    'in_stock': in_stock_merchandise
                },
                'order_stats': {
                    'total': total_orders,
                    'completed': completed_orders
                },
                'top_projects': [project.to_dict() for project in top_projects]
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
        
class AdminAllOrders(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        try:

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
    api.add_resource(PendingProjects, '/api/admin/projects/pending')
    api.add_resource(ApproveProject, '/api/admin/projects/<int:id>/approve')
    api.add_resource(RejectProject, '/api/admin/projects/<int:id>/reject')
    api.add_resource(FeatureProject, '/api/admin/projects/<int:id>/feature')
    api.add_resource(AdminCategories, '/api/admin/categories')
    api.add_resource(AdminCategoryDetail, '/api/admin/categories/<int:id>')
    api.add_resource(AdminMerchandise, '/api/admin/merchandise')
    api.add_resource(AdminMerchandiseDetail, '/api/admin/merchandise/<int:id>')
    api.add_resource(AdminStats, '/api/admin/stats')
    api.add_resource(AdminAllOrders, "/api/admin/orders")

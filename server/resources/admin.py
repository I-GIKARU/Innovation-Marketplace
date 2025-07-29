from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, User, Category, Sales, Role
from resources.auth.decorators import role_required
from sqlalchemy import func


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


class AdminStats(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        try:
            # User stats
            total_users = User.query.count()
            total_students = User.query.join(Role).filter(Role.name == 'student').count()
            
            # Project stats
            total_projects = Project.query.count()
            approved_projects = Project.query.filter_by(status='approved').count()
            pending_projects = Project.query.filter_by(status='pending').count()
            featured_projects = Project.query.filter_by(featured=True).count()
            
            
            # Sales stats
            total_sales = Sales.query.count()
            completed_sales = Sales.query.filter_by(status='completed').count()
            
            # Top viewed projects
            top_projects = Project.query.filter_by(status='approved').order_by(Project.views.desc()).limit(5).all()
            
            return {
                'user_stats': {
                    'total': total_users,
                    'students': total_students
                },
                'project_stats': {
                    'total': total_projects,
                    'approved': approved_projects,
                    'pending': pending_projects,
                    'featured': featured_projects
                },
                'sales_stats': {
                    'total': total_sales,
                    'completed': completed_sales
                },
                'top_projects': [project.to_dict() for project in top_projects]
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
        
class AdminAllSales(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        try:

            page = request.args.get("page", 1, type=int)
            per_page = request.args.get("per_page", 20, type=int)

            sales = (
                Sales.query.order_by(Sales.date.desc())
                .paginate(page=page, per_page=per_page, error_out=False)
            )

            return {
                "sales": [sale.to_dict() for sale in sales.items],
                "total": sales.total,
                "pages": sales.pages,
                "current_page": page,
            }, 200

        except Exception as exc:
            return {"error": str(exc)}, 500

def setup_routes(api):
    api.add_resource(AdminCategories, '/api/admin/categories')
    api.add_resource(AdminCategoryDetail, '/api/admin/categories/<int:id>')
    api.add_resource(AdminStats, '/api/admin/stats')
    api.add_resource(AdminAllSales, "/api/admin/sales")

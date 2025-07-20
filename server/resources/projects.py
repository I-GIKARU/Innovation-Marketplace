from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, Category, UserProject
from sqlalchemy import or_
from resources.auth.decorators import role_required, admin_or_role_required, get_current_user
from datetime import date

class ProjectList(Resource):
    def get(self):
        try:
            # Get query parameters
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            search = request.args.get('search', '')
            category_name = request.args.get('category', '')
            featured_only = request.args.get('featured', False, type=bool)
            approved_only = request.args.get('approved', True, type=bool)
            
            query = Project.query
            
            # Filter by approval status
            if approved_only:
                query = query.filter(Project.status == 'approved')
            
            # Filter by featured
            if featured_only:
                query = query.filter(Project.featured == True)
            
            # Search filter
            if search:
                query = query.filter(
                    or_(
                        Project.title.ilike(f'%{search}%'),
                        Project.description.ilike(f'%{search}%'),
                        Project.tech_stack.ilike(f'%{search}%')
                    )
                )
            
            # Category filter
            if category_name:
                category = Category.query.filter_by(name=category_name).first()
                if category:
                    query = query.filter(Project.category_id == category.id)
                else:
                    return {'error': 'Category not found'}, 404
            
            # Order by id (newest first)
            query = query.order_by(Project.id.desc())
            
            # Paginate
            projects = query.paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return {
                'projects': [project.to_dict() for project in projects.items],
                'total': projects.total,
                'pages': projects.pages,
                'current_page': page,
                'per_page': per_page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('student') # Only students can create projects
    def post(self):
        try:
            user_id = int(get_jwt_identity())  # Convert string back to int
            
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'description', 'category_id']
            for field in required_fields:
                if field not in data or not data[field]:
                    return {'error': f'{field} is required'}, 400
            
            # Check if category exists
            category = Category.query.get(data['category_id'])
            if not category:
                return {'error': 'Category not found'}, 404
            
            # Create new project
            project = Project(
                title=data['title'],
                description=data['description'],
                category_id=data['category_id'],
                tech_stack=data.get('tech_stack', ''),
                github_link=data.get('github_link', ''),
                demo_link=data.get('demo_link', ''),
                is_for_sale=data.get('is_for_sale', False),
                status='pending', # New projects are pending by default
                featured=False,
                technical_mentor=data.get('technical_mentor', '')
            )
            
            db.session.add(project)
            db.session.flush()  # Get the project ID
            
            # Link student to project via UserProject
            user_project = UserProject(
                user_id=user_id,
                project_id=project.id,
                interested_in='contributor', # Default for student creating project
                date=date.today()
            )
            db.session.add(user_project)
            
            db.session.commit()
            
            return {
                'message': 'Project created successfully and submitted for review',
                'project': project.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectDetail(Resource):
    def get(self, id):
        try:
            project = Project.query.get_or_404(id)
            
            # Increment view count
            project.views += 1
            db.session.commit()
            
            return {'project': project.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student']) # Students can update their own, admins can update any
    def put(self, id):
        try:
            current_user = get_current_user()
            user_id = current_user.id
            role_name = current_user.role.name
            project = Project.query.get_or_404(id)
            
            # Check if user is the project owner or admin
            if role_name == 'student':
                user_project = UserProject.query.filter_by(
                    user_id=user_id,
                    project_id=id
                ).first()
                if not user_project:
                    return {'error': 'You can only update your own projects'}, 403
            elif role_name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            data = request.get_json()
            
            # Update project fields
            if 'title' in data: project.title = data['title']
            if 'description' in data: project.description = data['description']
            if 'tech_stack' in data: project.tech_stack = data['tech_stack']
            if 'github_link' in data: project.github_link = data['github_link']
            if 'demo_link' in data: project.demo_link = data['demo_link']
            if 'is_for_sale' in data: project.is_for_sale = data['is_for_sale']
            if 'category_id' in data: 
                category = Category.query.get(data['category_id'])
                if not category:
                    return {'error': 'Category not found'}, 404
                project.category_id = data['category_id']
            if 'technical_mentor' in data: project.technical_mentor = data['technical_mentor']
            
            # Admin-only fields
            if role_name == 'admin':
                if 'status' in data: project.status = data['status']
                if 'featured' in data: project.featured = data['featured']
            
            db.session.commit()
            
            return {
                'message': 'Project updated successfully',
                'project': project.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student']) # Students can delete their own, admins can delete any
    def delete(self, project_id):
        try:
            current_user = get_current_user()
            user_id = current_user.id
            role_name = current_user.role.name
            project = Project.query.get_or_404(project_id)
            
            # Check if user is the project owner or admin
            if role_name == 'student':
                user_project = UserProject.query.filter_by(
                    user_id=user_id,
                    project_id=project_id
                ).first()
                if not user_project:
                    return {'error': 'You can only delete your own projects'}, 403
            elif role_name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            db.session.delete(project)
            db.session.commit()
            
            return {'message': 'Project deleted successfully'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectCategories(Resource):
    def get(self):
        try:
            categories = Category.query.all()
            return {
                'categories': [category.to_dict() for category in categories]
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class ProjectClick(Resource):
    def post(self, id):
        try:
            project = Project.query.get_or_404(id)
            project.clicks += 1
            db.session.commit()
            
            return {'message': 'Click recorded'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectDownload(Resource):
    def post(self, id):
        try:
            project = Project.query.get_or_404(id)
            project.downloads += 1
            db.session.commit()
            
            return {'message': 'Download recorded'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

def setup_routes(api):
    api.add_resource(ProjectList, '/api/projects')
    api.add_resource(ProjectDetail, '/api/projects/<int:id>')
    api.add_resource(ProjectCategories, '/api/projects/categories')
    api.add_resource(ProjectClick, '/api/projects/<int:id>/click')
    api.add_resource(ProjectDownload, '/api/projects/<int:id>/download')

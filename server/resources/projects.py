from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, Student, Category, ProjectStudent
from sqlalchemy import or_

class ProjectList(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            search = request.args.get('search', '')
            category = request.args.get('category', '')
            featured_only = request.args.get('featured', False, type=bool)
            approved_only = request.args.get('approved', True, type=bool)
            
            query = Project.query

            if approved_only:
                query = query.filter(Project.is_approved == True)

            if featured_only:
                query = query.filter(Project.featured == True)

            if search:
                query = query.filter(
                    or_(
                        Project.title.ilike(f'%{search}%'),
                        Project.description.ilike(f'%{search}%'),
                        Project.tech_stack.ilike(f'%{search}%')
                    )
                )

            if category:
                query = query.join(Project.category).filter(Category.name.ilike(f'%{category}%'))

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
    def post(self):
        try:
            current_user = get_jwt_identity()
            
            if current_user['role'] != 'student':
                return {'error': 'Only students can create projects'}, 403
            
            data = request.get_json()
            
            required_fields = ['title', 'description']
            for field in required_fields:
                if field not in data or not data[field]:
                    return {'error': f'{field} is required'}, 400
            
            project = Project(
                title=data['title'],
                description=data['description'],
                tech_stack=data.get('tech_stack', ''),
                github_link=data.get('github_link', ''),
                demo_link=data.get('demo_link', ''),
                is_for_sale=data.get('is_for_sale', False),
                price=data.get('price', 0) if data.get('is_for_sale') else None,
                category_id=data.get('category_id'),
                status='pending'
            )
            
            db.session.add(project)
            db.session.flush()
            
            project_student = ProjectStudent(
                student_id=current_user['id'],
                project_id=project.id
            )
            db.session.add(project_student)
            
            db.session.commit()
            
            return {
                'message': 'Project created successfully',
                'project': project.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectDetail(Resource):
    def get(self, id):
        try:
            project = Project.query.get_or_404(id)
            
            project.views += 1
            db.session.commit()
            
            return {'project': project.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    def put(self, id):
        try:
            current_user = get_jwt_identity()
            project = Project.query.get_or_404(id)
            
            if current_user['role'] == 'student':
                project_student = ProjectStudent.query.filter_by(
                    student_id=current_user['id'],
                    project_id=id
                ).first()
                if not project_student:
                    return {'error': 'You can only update your own projects'}, 403
            elif current_user['role'] != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            data = request.get_json()
            
            if 'title' in data: project.title = data['title']
            if 'description' in data: project.description = data['description']
            if 'tech_stack' in data: project.tech_stack = data['tech_stack']
            if 'github_link' in data: project.github_link = data['github_link']
            if 'demo_link' in data: project.demo_link = data['demo_link']
            if 'is_for_sale' in data: project.is_for_sale = data['is_for_sale']
            if 'category_id' in data: project.category_id = data['category_id']
            
            if data.get('is_for_sale') and 'price' in data:
                project.price = data['price']
            elif not data.get('is_for_sale'):
                project.price = None
            
            db.session.commit()
            
            return {
                'message': 'Project updated successfully',
                'project': project.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    def delete(self, id):
        try:
            current_user = get_jwt_identity()
            project = Project.query.get_or_404(id)
            
            if current_user['role'] == 'student':
                project_student = ProjectStudent.query.filter_by(
                    student_id=current_user['id'],
                    project_id=id
                ).first()
                if not project_student:
                    return {'error': 'You can only delete your own projects'}, 403
            elif current_user['role'] != 'admin':
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

from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Project, UserProject, Sales, Merchandise, Role
from resources.auth.decorators import role_required, get_current_user

class StudentDashboard(Resource):
    @jwt_required()
    @role_required('student')
    def get(self):
        user = get_current_user()
        
        if not user:
            return {'error': 'User profile not found'}, 404
        
        # Get student's projects via UserProject
        user_projects = UserProject.query.filter_by(user_id=user.id).all()
        projects = [user_project.project for user_project in user_projects if user_project.project]
        
        return {
            'user': user.to_dict(),
            'projects': [project.to_dict() for project in projects]
        }, 200

class AdminDashboard(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        stats = {
            'total_users': User.query.count(),
            'total_students': User.query.join(Role).filter(Role.name == 'student').count(),
            'total_merchandise': Merchandise.query.count(),
            'total_projects': Project.query.count(),
            'approved_projects': Project.query.filter_by(status='approved').count(),
            'pending_projects': Project.query.filter_by(status='pending').count(),
            'total_sales': Sales.query.count(),
            'completed_sales': Sales.query.filter_by(status='completed').count()
        }
        
        # Recent projects for review
        recent_projects = Project.query.filter_by(status='pending').order_by(Project.id.desc()).limit(5).all()
        
        return {
            'stats': stats,
            'recent_projects': [project.to_dict() for project in recent_projects]
        }, 200

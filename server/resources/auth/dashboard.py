from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Project, UserProject, Order, Merchandise, Role
from resources.auth.decorators import role_required

class StudentDashboard(Resource):
    @jwt_required()
    @role_required('student')
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user:
            return {'error': 'User profile not found'}, 404
        
        # Get student's projects via UserProject
        user_projects = UserProject.query.filter_by(user_id=user.id).all()
        projects = [user_project.project for user_project in user_projects if user_project.project]
        
        # Get interests in student's projects (where user is a student on the project)
        client_interests = UserProject.query.filter(
            UserProject.project_id.in_([project.id for project in projects]),
            UserProject.user_id != user.id # Exclude the student's own UserProject entries
        ).all()
        
        return {
            'user': user.to_dict(),
            'projects': [project.to_dict() for project in projects],
            'client_interests': [client_interest.to_dict() for client_interest in client_interests]
        }, 200

class ClientDashboard(Resource):
    @jwt_required()
    @role_required('client')
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user:
            return {'error': 'User profile not found'}, 404
        
        # Get client's expressed interests (UserProject entries where client is the user)
        expressed_interests = UserProject.query.filter_by(user_id=user.id).all()
        
        return {
            'user': user.to_dict(),
            'expressed_interests': [expressed_interest.to_dict() for expressed_interest in expressed_interests]
        }, 200

class AdminDashboard(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        stats = {
            'total_users': User.query.count(),
            'total_students': User.query.join(Role).filter(Role.name == 'student').count(),
            'total_clients': User.query.join(Role).filter(Role.name == 'client').count(),
            'total_merchandise': Merchandise.query.count(),
            'total_projects': Project.query.count(),
            'approved_projects': Project.query.filter_by(status='approved').count(),
            'pending_projects': Project.query.filter_by(status='pending').count(),
            'total_orders': Order.query.count(),
            'completed_orders': Order.query.filter_by(status='completed').count()
        }
        
        # Recent projects for review
        recent_projects = Project.query.filter_by(status='pending').order_by(Project.created_at.desc()).limit(5).all()
        
        return {
            'stats': stats,
            'recent_projects': [project.to_dict() for project in recent_projects]
        }, 200

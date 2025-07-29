from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Project, UserProject, Sales, Merchandise, Role, Contribution
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
        
        # Get interests in student's projects (where user is a student on the project)
        client_interests = UserProject.query.filter(
            UserProject.project_id.in_([project.id for project in projects]),
            UserProject.user_id != user.id # Exclude the student's own UserProject entries
        ).all()
        
        # Get contributions to student's projects
        project_contributions = []
        if projects:
            project_contributions = Contribution.query.join(UserProject).filter(
                UserProject.project_id.in_([project.id for project in projects]),
                UserProject.user_id != user.id  # Exclude the student's own contributions
            ).order_by(Contribution.date.desc()).limit(10).all()
        
        return {
            'user': user.to_dict(),
            'projects': [project.to_dict() for project in projects],
            'client_interests': [client_interest.to_dict() for client_interest in client_interests],
            'project_contributions': [contribution.to_dict() for contribution in project_contributions]
        }, 200

class ClientDashboard(Resource):
    @jwt_required()
    @role_required('client')
    def get(self):
        user = get_current_user()
        
        if not user:
            return {'error': 'User profile not found'}, 404
        
        # Get client's expressed interests (UserProject entries where client is the user)
        expressed_interests = UserProject.query.filter_by(user_id=user.id).all()
        
        # Get client's orders
        orders = Sales.query.filter_by(user_id=user.id).order_by(Sales.date.desc()).all()
        
        # Get client's contributions
        client_contributions = Contribution.query.join(UserProject).filter(
            UserProject.user_id == user.id
        ).order_by(Contribution.date.desc()).all()
        
        # Calculate statistics
        total_orders = len(orders)
        completed_orders = len([o for o in orders if o.status == 'completed'])
        pending_orders = len([o for o in orders if o.status == 'pending'])
        cancelled_orders = len([o for o in orders if o.status == 'cancelled'])
        total_spent = sum(o.amount for o in orders if o.status == 'completed')
        
        # Contribution statistics
        total_contributed = sum(c.amount for c in client_contributions if c.amount)
        contribution_count = len(client_contributions)
        
        stats = {
            'totalOrders': total_orders,
            'completedOrders': completed_orders,
            'pendingOrders': pending_orders,
            'cancelledOrders': cancelled_orders,
            'totalSpent': total_spent,
            'totalContributed': total_contributed,
            'contributionCount': contribution_count
        }
        
        return {
            'user': user.to_dict(),
            'expressed_interests': [expressed_interest.to_dict() for expressed_interest in expressed_interests],
            'orders': [order.to_dict() for order in orders],
            'contributions': [contribution.to_dict() for contribution in client_contributions],
            'stats': stats
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
            'total_orders': Sales.query.count(),
            'completed_orders': Sales.query.filter_by(status='completed').count(),
            'total_contributions': Contribution.query.count(),
            'total_contribution_amount': sum(c.amount for c in Contribution.query.all() if c.amount)
        }
        
        # Recent projects for review
        recent_projects = Project.query.filter_by(status='pending').order_by(Project.id.desc()).limit(5).all()
        
        # Recent contributions
        recent_contributions = Contribution.query.order_by(Contribution.date.desc()).limit(5).all()
        
        return {
            'stats': stats,
            'recent_projects': [project.to_dict() for project in recent_projects],
            'recent_contributions': [contribution.to_dict() for contribution in recent_contributions]
        }, 200

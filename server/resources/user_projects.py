from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import db, UserProject, Project, Review, User
from resources.auth.decorators import admin_or_role_required, get_current_user, flexible_auth_required
from utils.firebase_auth import get_firebase_user_from_request, create_or_get_user_from_firebase
from datetime import date

class UserProjectList(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'client']) # Both students and clients can express interest
    def post(self):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            user_id = current_user.id
            role_name = current_user.role.name
            
            data = request.get_json()
            
            if not data.get('project_id') or not data.get('message'):
                return {'error': 'Project ID and message are required'}, 400
            
            # Check if project exists
            project = Project.query.get_or_404(data['project_id'])
            
            # Prevent duser_projectlicate entries for the same user and project
            existing_user_project = UserProject.query.filter_by(
                user_id=user_id,
                project_id=data['project_id']
            ).first()
            if existing_user_project:
                return {'error': 'You have already interacted with this project'}, 400
            
            # Determine interested_in based on role
            interested_in = data.get('interested_in')
            if role_name == 'student':
                # Students can collaborate on projects
                if not interested_in:
                    return {'error': 'For student, "interested_in" field is required (e.g., "collaboration")'}, 400
                if interested_in not in ['collaboration', 'contributor']: 
                    return {'error': 'Invalid "interested_in" value for student. Must be "collaboration" or "contributor"'}, 400
            elif role_name == 'client':
                # Clients can hire teams or purchase projects
                if not interested_in:
                    return {'error': 'For client, "interested_in" field is required (e.g., "hire", "purchase")'}, 400
                if interested_in not in ['hire', 'purchase', 'inquiry']:
                    return {'error': 'Invalid "interested_in" value for client. Must be "hire", "purchase", or "inquiry"'}, 400
            else:
                return {'error': 'Invalid user role'}, 403
            
            # Create user-project interaction
            user_project = UserProject(
                user_id=user_id,
                project_id=data['project_id'],
                interested_in=interested_in,
                message=data['message']
            )
            
            db.session.add(user_project)
            db.session.commit()
            
            return {
                'message': 'User-project interaction created successfully',
                'user_project': user_project.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student']) # Users can remove saved projects
    def get(self):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            user_id = current_user.id
            role_name = current_user.role.name
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            query = UserProject.query
            
            if role_name == 'student':
                # Students see interactions related to their projects
                # First, find projects where the current student is a contributor
                student_projects_ids = [
                    user_project.project_id for user_project in UserProject.query.filter_by(user_id=user_id, interested_in='contributor').all()
                ]
                # Then, find all UserProject entries for those projects, excluding their own 'contributor' entries
                query = query.filter(
                    UserProject.project_id.in_(student_projects_ids),
                    UserProject.user_id != user_id # Exclude the student's own project entries
                )
            elif role_name == 'admin':
                # Admins see all interactions
                pass
            else:
                return {'error': 'Unauthorized'}, 403
            
            user_projects = query.order_by(UserProject.date.desc()).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            return {
                'user_projects': [user_project.to_dict() for user_project in user_projects.items],
                'total': user_projects.total,
                'pages': user_projects.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class UserProjectDetail(Resource):
    @jwt_required()
    @admin_or_role_required(['student'])
    def get(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            user_id = current_user.id
            role_name = current_user.role.name
            user_project = UserProject.query.get_or_404(id)
            
            # Check permissions
            if role_name == 'student':
                # Check if student is part of the project associated with this UserProject
                is_project_member = UserProject.query.filter_by(
                    user_id=user_id,
                    project_id=user_project.project_id,
                    interested_in='contributor'
                ).first()
                if not is_project_member:
                    return {'error': 'You can only view interactions for your projects'}, 403
            elif role_name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            return {'user_project': user_project.to_dict()}, 200
            
        except Exception as e:
            return {'error': str(e)}, 500

class CreateProjectReview(Resource):
    @jwt_required()
    def post(self, project_id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            # Check if project exists
            project = Project.query.get_or_404(project_id)
            data = request.get_json()
            
            if not data.get('rating'):
                return {'error': 'Rating is required'}, 400
            
            rating = data['rating']
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return {'error': 'Rating must be an integer between 1 and 5'}, 400
            
            # Check if user has already reviewed this project
            existing_review = Review.query.filter_by(
                project_id=project_id,
                user_id=current_user.id
            ).first()
            if existing_review:
                return {'error': 'You have already reviewed this project'}, 400
            
            # Create authenticated review
            review = Review(
                project_id=project_id,
                user_id=current_user.id,  # Require user authentication
                rating=rating,
                comment=data.get('comment', '')
            )
            
            db.session.add(review)
            db.session.commit()
            
            return {
                'message': 'Review created successfully',
                'review': review.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500


class ProjectReviews(Resource):
    def get(self, id):
        try:
            # Get all reviews for a project directly
            reviews = Review.query.filter_by(
                project_id=id
            ).order_by(Review.date.desc()).all()
            
            return {
                'reviews': [review.to_dict() for review in reviews]
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class HireTeam(Resource):
    @jwt_required()
    def post(self, project_id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            # Only clients should be able to hire teams
            if current_user.role.name not in ['client', 'admin']:
                return {'error': 'Only clients can send hire requests'}, 403
            
            # Check if project exists
            project = Project.query.get_or_404(project_id)
            data = request.get_json()
            
            # Validate required fields (message is required, other fields can be taken from profile)
            if not data.get('message'):
                return {'error': 'Message is required'}, 400
            
            # Check if user has already sent a hire request for this project
            existing_request = UserProject.query.filter_by(
                user_id=current_user.id,
                project_id=project_id,
                interested_in='hire_request'
            ).first()
            if existing_request:
                return {'error': 'You have already sent a hire request for this project'}, 400
            
            # Create authenticated hire request
            hire_request = UserProject(
                user_id=current_user.id,  # Use authenticated user ID
                project_id=project_id,
                interested_in='hire_request',  # Special type for hire requests
                date=date.today(),  # Set current date
                message=f"HIRE REQUEST from {current_user.email}:\n\n" +
                       f"Company: {current_user.company or 'Not specified'}\n" +
                       f"Phone: {current_user.phone or 'Not provided'}\n\n" +
                       f"Message: {data['message']}"
            )
            
            db.session.add(hire_request)
            db.session.commit()
            
            return {
                'message': 'Hire request sent successfully! The team will be notified.',
                'hire_request_id': hire_request.id
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

def setuser_project_routes(api):
    api.add_resource(UserProjectList, '/api/user-projects')
    api.add_resource(UserProjectDetail, '/api/user-projects/<int:id>')
    api.add_resource(CreateProjectReview, '/api/projects/<int:project_id>/reviews')
    api.add_resource(ProjectReviews, '/api/projects/<int:id>/reviews')
    api.add_resource(HireTeam, '/api/projects/<int:project_id>/hire')

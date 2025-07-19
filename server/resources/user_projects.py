from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, UserProject, Project, Review
from resources.auth.decorators import role_required, admin_or_role_required

class UserProjectList(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'client']) # Students and Clients can create/view their own
    def post(self):
        try:
            current_user = get_jwt_identity()
            user_id = current_user['id']
            role_name = current_user['role']
            
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
                # Students can only be 'contributor' for their own projects
                # Or they can express interest in other projects for 'collaboration'
                if not interested_in:
                    return {'error': 'For student, "interested_in" field is required (e.g., "collaboration")'}, 400
                if interested_in not in ['collaboration']: # Extend as needed
                    return {'error': 'Invalid "interested_in" value for student'}, 400
            elif role_name == 'client':
                if not interested_in:
                    return {'error': 'For client, "interested_in" field is required (e.g., "buying", "hiring")'}, 400
                allowed_client_interests = ['buying', 'hiring']
                if interested_in not in allowed_client_interests:
                    return {'error': 'Invalid "interested_in" value for client'}, 400
            else:
                return {'error': 'Only students and clients can create user-project interactions'}, 403
            
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
    @admin_or_role_required(['student', 'client'])
    def get(self):
        try:
            current_user = get_jwt_identity()
            user_id = current_user['id']
            role_name = current_user['role']
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            query = UserProject.query
            
            if role_name == 'client':
                # Clients see their own interactions
                query = query.filter_by(user_id=user_id)
            elif role_name == 'student':
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
    @admin_or_role_required(['student', 'client'])
    def get(self, id):
        try:
            current_user = get_jwt_identity()
            user_id = current_user['id']
            role_name = current_user['role']
            user_project = UserProject.query.get_or_404(id)
            
            # Check permissions
            if role_name == 'client' and user_project.user_id != user_id:
                return {'error': 'You can only view your own interactions'}, 403
            elif role_name == 'student':
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

class CreateReview(Resource):
    @jwt_required()
    @role_required('client') # Only clients can create reviews for now
    def post(self, id):
        try:
            current_user = get_jwt_identity()
            user_id = current_user['id']
            
            user_project = UserProject.query.get_or_404(id)
            data = request.get_json()
            
            if not data.get('rating'):
                return {'error': 'Rating is required'}, 400
            
            # Check if client owns the user_project interaction
            if user_project.user_id != user_id:
                return {'error': 'You can only review your own interactions'}, 403
            
            # Check if review already exists for this user_project
            existing_review = Review.query.filter_by(user_project_id=id).first()
            if existing_review:
                return {'error': 'Review already exists for this interaction'}, 400
            
            rating = data['rating']
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return {'error': 'Rating must be an integer between 1 and 5'}, 400
            
            # Create review
            review = Review(
                user_project_id=id,
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
            # Get all reviews for a project through UserProject
            reviews = db.session.query(Review).join(UserProject).filter(
                UserProject.project_id == id
            ).order_by(Review.date.desc()).all()
            
            return {
                'reviews': [review.to_dict() for review in reviews]
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

def setuser_project_routes(api):
    api.add_resource(UserProjectList, '/api/user-projects')
    api.add_resource(UserProjectDetail, '/api/user-projects/<int:id>')
    api.add_resource(CreateReview, '/api/user-projects/<int:id>/review')
    api.add_resource(ProjectReviews, '/api/projects/<int:id>/reviews')

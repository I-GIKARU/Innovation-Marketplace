from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ClientInterest, Review, Project, Client

class ClientInterestList(Resource):
    @jwt_required()
    def post(self):
        try:
            current_user = get_jwt_identity()
            
            if current_user['role'] != 'client':
                return {'error': 'Only clients can express interest'}, 403
            
            data = request.get_json()
            
            if not data.get('project_id') or not data.get('message'):
                return {'error': 'Project ID and message are required'}, 400
            
            project = Project.query.get_or_404(data['project_id'])
            
            if not project.is_approved:
                return {'error': 'Cannot express interest in unapproved projects'}, 400
            
            client_interest = ClientInterest(
                project_id=data['project_id'],
                client_id=current_user['id'],
                interested_in=data.get('interested_in', 'buying,hiring'),
                message=data['message']
            )
            
            db.session.add(client_interest)
            db.session.commit()
            
            return {
                'message': 'Interest expressed successfully',
                'client_interest': client_interest.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            if current_user['role'] == 'client':
                interests = ClientInterest.query.filter_by(client_id=current_user['id']).order_by(ClientInterest.date.desc()).paginate(
                    page=page,
                    per_page=per_page,
                    error_out=False
                )
            elif current_user['role'] == 'student':
                from models import ProjectStudent
                student_projects = db.session.query(ProjectStudent.project_id).filter_by(student_id=current_user['id']).subquery()
                interests = ClientInterest.query.filter(ClientInterest.project_id.in_(student_projects)).order_by(ClientInterest.date.desc()).paginate(
                    page=page,
                    per_page=per_page,
                    error_out=False
                )
            elif current_user['role'] == 'admin':
                interests = ClientInterest.query.order_by(ClientInterest.date.desc()).paginate(
                    page=page,
                    per_page=per_page,
                    error_out=False
                )
            else:
                return {'error': 'Unauthorized'}, 403
            
            return {
                'client_interests': [interest.to_dict() for interest in interests.items],
                'total': interests.total,
                'pages': interests.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class ClientInterestDetail(Resource):
    @jwt_required()
    def get(self, id):
        try:
            current_user = get_jwt_identity()
            client_interest = ClientInterest.query.get_or_404(id)
            
            if current_user['role'] == 'client' and client_interest.client_id != current_user['id']:
                return {'error': 'You can only view your own interests'}, 403
            elif current_user['role'] == 'student':
                from models import ProjectStudent
                is_project_member = db.session.query(ProjectStudent).filter_by(
                    student_id=current_user['id'],
                    project_id=client_interest.project_id
                ).first()
                if not is_project_member:
                    return {'error': 'You can only view interests for your projects'}, 403
            elif current_user['role'] not in ['admin']:
                return {'error': 'Unauthorized'}, 403
            
            return {'client_interest': client_interest.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class ProjectReviews(Resource):
    def get(self, id):
        try:
            reviews = Review.query.filter_by(project_id=id).order_by(Review.date.desc()).all()
            
            return {
                'reviews': [review.to_dict() for review in reviews]
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

def setup_routes(api):
    api.add_resource(ClientInterestList, '/api/client-interests')
    api.add_resource(ClientInterestDetail, '/api/client-interests/<int:id>')
    api.add_resource(ProjectReviews, '/api/projects/<int:id>/reviews')
    
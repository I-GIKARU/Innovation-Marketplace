from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import db, Contribution, UserProject, Project
from resources.auth.decorators import role_required, admin_or_role_required, get_current_user
from datetime import date

class ContributionList(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'client'])
    def post(self):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            data = request.get_json()
            
            # Handle both direct project donations and user-project contributions
            users_projects_id = data.get('users_projects_id')
            project_id = data.get('project_id')
            
            if not users_projects_id and not project_id:
                return {'error': 'Either users_projects_id or project_id is required'}, 400
            
            # If project_id is provided (for donations), find or create user-project relationship
            if project_id and not users_projects_id:
                # Check if project exists
                project = Project.query.get_or_404(project_id)
                
                # Find existing user-project relationship or create one
                user_project = UserProject.query.filter_by(
                    user_id=current_user.id,
                    project_id=project_id
                ).first()
                
                if not user_project:
                    # Create a new user-project relationship for donation
                    user_project = UserProject(
                        user_id=current_user.id,
                        project_id=project_id,
                        interested_in='supporter',  # New type for supporters/donors
                        message=data.get('comment', 'Project supporter'),
                        date=date.today()
                    )
                    db.session.add(user_project)
                    db.session.flush()  # Get the ID
            else:
                # Check if UserProject exists and user has permission
                user_project = UserProject.query.get_or_404(users_projects_id)
            
            # Check permissions based on role
            if current_user.role.name == 'client':
                # Clients can only contribute to projects they've expressed interest in
                if user_project.user_id != current_user.id:
                    return {'error': 'You can only contribute to projects you are interested in'}, 403
            elif current_user.role.name == 'student':
                # Students can contribute to their own projects or projects they're collaborating on
                student_user_project = UserProject.query.filter_by(
                    user_id=current_user.id,
                    project_id=user_project.project_id
                ).first()
                if not student_user_project:
                    return {'error': 'You can only contribute to projects you are involved in'}, 403
            elif current_user.role.name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            # Create contribution
            contribution = Contribution(
                users_projects_id=user_project.id,
                amount=data.get('amount', 0.0),
                comment=data.get('comment', ''),
                date=date.today()
            )
            
            db.session.add(contribution)
            db.session.commit()
            
            return {
                'message': 'Contribution created successfully',
                'contribution': contribution.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student', 'client'])
    def get(self):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            query = Contribution.query.join(UserProject)
            
            if current_user.role.name == 'client':
                # Clients see contributions they've made
                query = query.filter(UserProject.user_id == current_user.id)
            elif current_user.role.name == 'student':
                # Students see contributions to their projects
                student_projects = Project.query.join(UserProject).filter(
                    UserProject.user_id == current_user.id,
                    UserProject.interested_in == 'contributor'
                ).all()
                project_ids = [p.id for p in student_projects]
                query = query.filter(UserProject.project_id.in_(project_ids))
            elif current_user.role.name == 'admin':
                # Admins see all contributions
                pass
            else:
                return {'error': 'Unauthorized'}, 403
            
            contributions = query.order_by(Contribution.date.desc()).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            return {
                'contributions': [contribution.to_dict() for contribution in contributions.items],
                'total': contributions.total,
                'pages': contributions.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class ContributionDetail(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'client'])
    def get(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            contribution = Contribution.query.get_or_404(id)
            user_project = contribution.user_project
            
            # Check permissions
            if current_user.role.name == 'client':
                if user_project.user_id != current_user.id:
                    return {'error': 'You can only view your own contributions'}, 403
            elif current_user.role.name == 'student':
                # Check if student is part of the project
                student_user_project = UserProject.query.filter_by(
                    user_id=current_user.id,
                    project_id=user_project.project_id
                ).first()
                if not student_user_project:
                    return {'error': 'You can only view contributions to your projects'}, 403
            elif current_user.role.name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            return {'contribution': contribution.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')  # Only admins can update contributions
    def put(self, id):
        try:
            contribution = Contribution.query.get_or_404(id)
            data = request.get_json()
            
            # Update allowed fields
            if 'comment' in data:
                contribution.comment = data['comment']
        
            if 'amount' in data:
                contribution.amount = data.get('amount', 0.0)
        
            db.session.commit()
            
            return {
                'message': 'Contribution updated successfully',
                'contribution': contribution.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectContributions(Resource):
    @jwt_required()
    @admin_or_role_required(['student', 'admin'])
    def get(self, id):
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'User not found'}, 404
            
            # Check if project exists
            project = Project.query.get_or_404(id)
            
            # Check if student is part of the project
            if current_user.role.name == 'student':
                student_user_project = UserProject.query.filter_by(
                    user_id=current_user.id,
                    project_id=id
                ).first()
                if not student_user_project:
                    return {'error': 'You can only view contributions to your projects'}, 403
            elif current_user.role.name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            # Get all contributions for this project
            contributions = Contribution.query.join(UserProject).filter(
                UserProject.project_id == id
            ).order_by(Contribution.date.desc()).all()
            
            # Calculate contribution statistics
            total_amount = sum(c.amount for c in contributions if c.amount)
            contribution_count = len(contributions)

            return {
                'project': {
                    'id': project.id,
                    'title': project.title
                },
                'contributions': [contribution.to_dict() for contribution in contributions],
                'statistics': {
                    'total_amount': total_amount,
                    'contribution_count': contribution_count,
                    'total_contributions': len(contributions)
                }
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

def setup_routes(api):
    api.add_resource(ContributionList, '/api/contributions')
    api.add_resource(ContributionDetail, '/api/contributions/<int:id>')
    api.add_resource(ProjectContributions, '/api/projects/<int:id>/contributions')

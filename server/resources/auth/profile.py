from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from utils.validation import validate_student_email, validate_email_format
from resources.auth.decorators import get_current_user

class UserProfile(Resource):
    @jwt_required()
    def get(self):
        user = get_current_user()
        
        if not user:
            return {'message': 'User not found'}, 404
        
        # Use the to_dict method for consistent serialization
        profile_data = user.to_dict()
        
        return {'user': profile_data}, 200
    
    @jwt_required()
    def put(self):
        user = get_current_user()
        data = request.get_json()
        
        if not user:
            return {'message': 'User not found'}, 404
        
        try:
            # Update email if provided and changed
            if 'email' in data and data['email'] != user.email:
                if user.role.name == 'student':
                    is_valid, message = validate_student_email(data['email'])
                else:
                    is_valid, message = validate_email_format(data['email'])
                
                if not is_valid:
                    return {'error': message}, 400
                if User.query.filter_by(email=data['email']).first():
                    return {'error': 'Email already exists'}, 400
                user.email = data['email']
            
            # Update general user fields (only fields that exist in User model)
            user.phone = data.get('phone', user.phone)
            user.bio = data.get('bio', user.bio)
            user.socials = data.get('socials', user.socials)
            user.past_projects = data.get('past_projects', user.past_projects)
            
            # Password updates are handled by Firebase Auth, not through this endpoint
            
            db.session.commit()
            return {'message': 'Profile updated successfully', 'user': user.to_dict()}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

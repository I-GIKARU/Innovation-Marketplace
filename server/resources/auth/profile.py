from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from utils.validation import validate_student_email, validate_email_format, validate_password_strength

class UserProfile(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user_id = current_user['id']
        role_name = current_user['role']
        
        user = User.query.get(user_id)
        
        if not user:
            return {'message': 'User not found'}, 404
        
        profile_data = {
            'id': user.id,
            'email': user.email,
            'role': role_name,
            'phone': user.phone,
            'bio': user.bio,
            'socials': user.socials,
            'company': user.company,
            'past_projects': user.past_projects
        }
        
        return {'user': profile_data}, 200
    
    @jwt_required()
    def put(self):
        current_user = get_jwt_identity()
        user_id = current_user['id']
        role_name = current_user['role']
        data = request.get_json()
        
        user = User.query.get(user_id)
        
        if not user:
            return {'message': 'User not found'}, 404
        
        try:
            # Update email if provided and changed
            if 'email' in data and data['email'] != user.email:
                if role_name == 'student':
                    is_valid, message = validate_student_email(data['email'])
                else:
                    is_valid, message = validate_email_format(data['email'])
                
                if not is_valid:
                    return {'error': message}, 400
                if User.query.filter_by(email=data['email']).first():
                    return {'error': 'Email already exists'}, 400
                user.email = data['email']
            
            # Update general user fields
            user.phone = data.get('phone', user.phone)
            user.bio = data.get('bio', user.bio)
            user.socials = data.get('socials', user.socials)
            user.company = data.get('company', user.company)
            user.past_projects = data.get('past_projects', user.past_projects)
            
            # Update password if provided
            if data.get('password'):
                is_valid_password, password_message = validate_password_strength(data['password'])
                if not is_valid_password:
                    return {'error': password_message}, 400
                user.password = data['password'] # Use the password setter
            
            db.session.commit()
            return {'message': 'Profile updated successfully', 'user': user.to_dict()}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

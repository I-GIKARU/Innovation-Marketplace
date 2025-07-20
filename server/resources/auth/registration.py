from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, set_access_cookies
from models import db, User, Role
from utils.validation import validate_student_email, validate_email_format, validate_password_strength
from datetime import timedelta

class UserRegistration(Resource):
    def post(self):
        try:
            data = request.get_json()
            
            if not data or 'email' not in data or 'password' not in data:
                return {'message': 'Email and password required'}, 400
            
            role_name = data.get('role', 'client').lower() # Default to 'client' if not specified
            
            # Validate password strength
            is_valid_password, password_message = validate_password_strength(data['password'])
            if not is_valid_password:
                return {'error': password_message}, 400
            
            # Check if user already exists
            if User.query.filter_by(email=data['email']).first():
                return {'error': 'User with this email already exists'}, 400
            
            # Get role object
            role = Role.query.filter_by(name=role_name).first()
            if not role:
                return {'error': f'Invalid role: {role_name}'}, 400
            
            # Role-specific validation and field assignment
            user_data = {
                'email': data['email'],
                'phone': data.get('phone'),
                'role_id': role.id
            }

            if role_name == 'student':
                is_valid_email, email_message = validate_student_email(data['email'])
                if not is_valid_email:
                    return {'error': email_message}, 400
                required_fields = ['bio', 'socials', 'past_projects']
                for field in required_fields:
                    user_data[field] = data.get(field)
            elif role_name == 'client':
                is_valid_email, email_message = validate_email_format(data['email'])
                if not is_valid_email:
                    return {'error': email_message}, 400
                required_fields = ['company']
                for field in required_fields:
                    user_data[field] = data.get(field)
            elif role_name == 'admin':
                # Only existing admins can create new admins
                try:
                    from flask_jwt_extended import jwt_required, get_jwt_identity
                    jwt_required()
                    current_user = get_jwt_identity()
                    if not current_user or current_user.get('role') != 'admin':
                        return {'error': 'Only admins can create admin accounts'}, 403
                except Exception:
                    return {'error': 'Admin authentication required to create admin accounts'}, 403
                is_valid_email, email_message = validate_email_format(data['email'])
                if not is_valid_email:
                    return {'error': email_message}, 400
            elif role_name == 'user':
                is_valid_email, email_message = validate_email_format(data['email'])
                if not is_valid_email:
                    return {'error': email_message}, 400
            
            # Create new user
            user = User(**user_data)
            user.password = data['password']
            
            db.session.add(user)
            db.session.commit()
            
            # Create access token
            identity = {
                'id': user.id,
                'email': user.email,
                'role': role.name
            }
            access_token = create_access_token(
                identity=str(user.id),  # Convert to string for JWT compliance
                expires_delta=timedelta(hours=24)
            )
            
            response = make_response(jsonify({
                'message': f'{role.name.capitalize()} registered successfully',
                'user': identity,
                'user_data': user.to_dict()
            }), 201)
            set_access_cookies(response, access_token)
            return response
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

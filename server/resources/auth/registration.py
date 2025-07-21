from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, set_access_cookies
from models import db, User, Role
from utils.validation import validate_student_email, validate_email_format
from utils.firebase_auth import verify_firebase_token, create_or_get_user_from_firebase
from datetime import timedelta

class FirebaseRegistration(Resource):
    def post(self):
        """
        Register/Login using Firebase ID token
        This handles both new user registration and existing user login
        """
        try:
            data = request.get_json()
            
            if not data or 'idToken' not in data:
                return {'message': 'Firebase ID token required'}, 400
            
            id_token = data['idToken']
            role_name = data.get('role', 'client').lower()  # Default role
            
            # Verify Firebase token
            firebase_user_data, error = verify_firebase_token(id_token)
            if error:
                return {'error': error}, 401
            
            # Create or get user from database with role information
            user, error = create_or_get_user_from_firebase(firebase_user_data, role_name, data)
            if error:
                return {'error': error}, 500
            
            if not user:
                return {'error': 'Failed to register/authenticate user'}, 500
            
            # Create JWT token for session management
            access_token = create_access_token(
                identity=str(user.id),
                expires_delta=timedelta(hours=24)
            )
            
            user_identity = {
                'id': user.id,
                'email': user.email,
                'role': user.role.name,
                'auth_provider': user.auth_provider
            }
            
            response = make_response(jsonify({
                'user': user_identity,
                'message': 'Registration/Login successful',
                'user_data': user.to_dict()
            }), 200)
            
            set_access_cookies(response, access_token)
            return response
            
        except Exception as exc:
            db.session.rollback()
            return {'error': f'Firebase registration failed: {str(exc)}'}, 500

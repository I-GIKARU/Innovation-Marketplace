from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from models import User
from datetime import timedelta
from utils.firebase_auth import verify_firebase_token, create_or_get_user_from_firebase

class CurrentUser(Resource):
    @jwt_required(optional=True) # Allow access without token
    def get(self):
        from flask import request
        try:
            identity = get_jwt_identity()
            if identity:
                # Convert string identity back to int and fetch user from database
                user_id = int(identity)
                user = User.query.get(user_id)
                if user:
                    user_data = {
                        'id': user.id,
                        'email': user.email,
                        'role': user.role.name
                    }
                    return jsonify({"user": user_data})
                return jsonify({"user": None})
            return jsonify({"user": None})
        except Exception as exc:
            return {"message": f"Error verifying user: {str(exc)}"}, 500

class FirebaseLogin(Resource):
    def post(self):
        """
        Login using Firebase ID token
        """
        try:
            data = request.get_json()
            
            if not data or 'idToken' not in data:
                return {'message': 'Firebase ID token required'}, 400
            
            id_token = data['idToken']
            
            # Verify Firebase token
            firebase_user_data, error = verify_firebase_token(id_token)
            if error:
                return {'error': error}, 401
            
            # Create or get user from database with role
            role = data.get('role')  # Get role from request if provided
            user, error = create_or_get_user_from_firebase(firebase_user_data, role)
            if error:
                return {'error': error}, 500
            
            if not user:
                return {'error': 'Failed to authenticate user'}, 500
            
            # Create our own JWT token for the session
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
                'message': 'Firebase login successful'
            }), 200)
            
            # Set JWT cookie for session management
            set_access_cookies(response, access_token)
            
            return response
            
        except Exception as exc:
            return {'error': f'Firebase login failed: {str(exc)}'}, 500

class UserLogout(Resource):
    def post(self):
        response = make_response(jsonify({'message': 'Logged out successfully'}), 200)
        unset_jwt_cookies(response)
        return response

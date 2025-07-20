from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from models import User
from datetime import timedelta

class UserLogin(Resource):
    def post(self):
        try:
            data = request.get_json()
            
            if not data or 'email' not in data or 'password' not in data:
                return {'message': 'Email and password required'}, 400
            
            email = data['email']
            password = data['password']
            
            user = User.query.filter_by(email=email).first()
            
            if not user or not user.verify_password(password): # Use verify_password
                return {'message': 'Invalid credentials'}, 401
            
            identity = {
                'id': user.id,
                'email': user.email,
                'role': user.role.name # Get role name from relationship
            }
            
            access_token = create_access_token(
                identity=str(user.id),  # Convert to string for JWT compliance
                expires_delta=timedelta(hours=24)
            )
            
            response = make_response(jsonify({
                'user': identity,
                'message': 'Login successful'
            }), 200)
            
            # Use standard JWT cookie setting with proper config
            set_access_cookies(response, access_token)
            
            return response
            
        except Exception as exc:
            return {'error': str(exc)}, 500

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

class UserLogout(Resource):
    def post(self):
        response = make_response(jsonify({'message': 'Logged out successfully'}), 200)
        unset_jwt_cookies(response)
        return response
